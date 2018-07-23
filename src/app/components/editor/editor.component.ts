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

declare var Blockly: any;

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

  loadingProject: boolean;
  alerts: Array<any> = [];
  project: Project;
  // TODO: Use the Resource interface
  resources: any;

  frameworkSupport: Support;
  workspace: string = 
    `<xml>
      <block type="start" deletable="false" movable="false"></block>
    </xml>`;

  constructor(
    private route: ActivatedRoute,
    private db: AngularFireDatabase
  ) { }

  ngOnInit() {
    this.loadingProject = true;
    
    this.route.params.subscribe(params => {

      let promises:Promise<DataSnapshot>[] = [
        this.db.object(`/projects/${params['id']}`).query.once('value'),
        this.db.list(`/resources/${params['id']}`).query.once('value')
      ];

      Promise.all(promises).then((results: DataSnapshot[]) => {
        // Get Project
        this.project = results[0].val();
        this.setFrameworkSupport(this.project.framework);
        this.startBlockly();

        // Get Resources
        this.resources = results[1].val();
        if(!this.resources)
          this.resources = {};

        this.loadingProject = false;
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
    
    // Initialize workspace with a Start Block
    Blockly.mainWorkspace.clear();
    Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(this.workspace), workspacePlayground);

    // Disable orphan blocks
    Blockly.mainWorkspace.addChangeListener(Blockly.Events.disableOrphans);
  }

  save() {
    let code: string = Blockly.JSON.workspaceToCode(Blockly.mainWorkspace);
    console.log(code);
  }

}
