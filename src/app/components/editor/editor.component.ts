import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import { Project } from '../../interfaces/project';
import { BlocksDefinition } from './blocks-definition';
import { Support } from '../../interfaces/support';

// Supported frameworks
import ArtoolkitSupport from './frameworks/artoolkit-support';
import VuforiaSupport from './frameworks/vuforia-support';
import { Resource } from '../../interfaces/resource';
import { DataSnapshot } from 'angularfire2/database/interfaces';
import { IpcService } from '../../services/ipc.service';

declare var Blockly: any;

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css'],
  providers: [IpcService]
})
export class EditorComponent implements OnInit {

  loadingProject: boolean = true;
  // TODO: Set to type message(type, content)
  messages: Array<any> = [];
  project: Project;
  // TODO: Use the Resource interface
  resources: any;

  frameworkSupport: Support;
  defaultWorkspace: string = 
    `<xml>
      <block type="start" deletable="false" movable="false"></block>
    </xml>`;

  constructor(
    private route: ActivatedRoute,
    private db: AngularFireDatabase,
    private ipcService: IpcService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {

      //  TODO: Show error for project not found
      let promises:Promise<DataSnapshot>[] = [
        this.db.object(`/projects/${params['id']}`).query.once('value'),
        this.db.list(`/resources/${params['id']}`).query.once('value'),
        this.db.object(`/workspaces/${params['id']}`).query.once('value')
      ];

      Promise.all(promises).then((results: DataSnapshot[]) => {
        // We are initializing resource first to fire resource-related events before interaction events
        // Get Project and resources
        this.project = results[0].val();
        this.resources = results[1].val();
        this.ipcService.onFrameworkReady(() => {
          if(!this.resources)
            this.resources = {};
          else {
            for(let key in this.resources) {
              this.ipcService.sendResourceCreated(this.resources[key]);
            }
          }
          this.setFrameworkSupport(this.project.framework);
          this.startBlockly();

          // Restore workspace
          if(results[2].val())
            this.setWorkspace(results[2].val());
          else
            this.setWorkspace(this.defaultWorkspace);

          this.loadingProject = false;
        });
        this.ipcService.sendProjectOpened(this.project.framework);
      });
      
    });
  }

  setFrameworkSupport(framework: string) {
    switch(framework){
      case 'artoolkit': {
        this.frameworkSupport = ArtoolkitSupport;
        break;
      }
      case 'vuforia': {
        this.frameworkSupport = VuforiaSupport;
        break;
      }
      default: {
        // TODO: Show error
        this.frameworkSupport = ArtoolkitSupport;
        break;
      }
    }
  }

  startBlockly() {
    // Initialize Blocks
    let blocksDefinition = new BlocksDefinition(Blockly);

    // Inject Blockly on DOM
    let blocklyArea: HTMLElement = document.getElementById('blocklyArea');
    let blocklyDiv = document.getElementById('blocklyDiv');
    let workspacePlayground = Blockly.inject(blocklyDiv, { toolbox: blocksDefinition.createToolbox(this.frameworkSupport) });
    
    // Resizable workspace
    // TODO: Emit resize event when the vertical scrollbar appears
    let onresize = function () {
      let element: HTMLElement = blocklyArea;
      let x = 0, y = 0;
      do {
        x += element.offsetLeft;
        //y += element.offsetTop;
        element = element.offsetParent as HTMLElement;
      } while (element);
      blocklyDiv.style.left = x + 'px';
      blocklyDiv.style.top = y + 'px';
      blocklyDiv.style.width = blocklyArea.offsetWidth + 'px';
      blocklyDiv.style.height = blocklyArea.offsetHeight + 'px';
      Blockly.svgResize(workspacePlayground);
    };
    window.addEventListener('resize', onresize, false);
    onresize();
    
    // Disable orphan blocks
    Blockly.mainWorkspace.addChangeListener(Blockly.Events.disableOrphans);

    // Add event listener for real time code generation
    Blockly.mainWorkspace.addChangeListener(event => {
      if (
        event.type == Blockly.Events.CREATE ||
        event.type == Blockly.Events.DELETE ||
        event.type == Blockly.Events.MOVE ||
        event.type == Blockly.Events.CHANGE ) {
        let code: string = Blockly.JSON.workspaceToCode(Blockly.mainWorkspace);
        if(this.checkGeneratedCode(code)) {
          let interactions = JSON.parse(code).interactions;
          this.ipcService.sendInteractionsApproved(interactions);
        }
        else {
          this.ipcService.sendInteractionsRejected();
        }
      }
    });

  }

  setWorkspace(workspace: string){
    // Initialize workspace with a Start Block
    Blockly.mainWorkspace.clear();
    Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(workspace), Blockly.mainWorkspace);
  }

  save() {
    let code: string = Blockly.JSON.workspaceToCode(Blockly.mainWorkspace);
    if(this.checkGeneratedCode(code)) {
      let interactions = JSON.parse(code).interactions;
      this.messages.push({
        type: 'success',
        content: 'Project saved !',
      });
      // Save interactions
      this.db.list('interactions').set(this.project.id, interactions);
      // Save workspace
      let xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
      let xml_text:string = Blockly.Xml.domToPrettyText(xml);
      this.db.list('workspaces').set(this.project.id, xml_text);
    }
    else {
      this.messages.push({
        type: 'danger',
        content: 'Some interactions are incomplete and/or there are remaining blocks',
      });
    }
  }

  // TODO: Validate semantic
  checkGeneratedCode(code: string) : boolean {
    try {
      JSON.parse(code).interactions;
      return true;
    } catch(e) {
      return false;
    }
  }

  public closeAlert(alert: any) {
    const index: number = this.messages.indexOf(alert);
    this.messages.splice(index, 1);
  }

}
