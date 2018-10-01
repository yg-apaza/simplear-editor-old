import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
import { NgbModalRef, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

declare var Blockly: any;

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

  loadingProject: boolean = true;
  project: Project;
  // TODO: Use the Resource interface
  resources: any;
  previewKey: string = "";
  previewKeyModalReference: NgbModalRef;

  frameworkSupport: Support;
  defaultWorkspace: string = 
    `<xml>
      <block type="start" deletable="false" movable="false"></block>
    </xml>`;

  @ViewChild('loadingResourcesModal')
  private loadingResourcesModal;
  loadingResourceModalReference: NgbModalRef;

  constructor(
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private db: AngularFireDatabase
  ) { }

  ngOnInit() {
    window.onunload = window.onbeforeunload = () => this.ngOnDestroy();

    this.route.params.subscribe(params => {

      //  TODO: Show error for project not found
      let promises:Promise<DataSnapshot>[] = [
        this.db.object(`/projects/${params['id']}`).query.once('value'),
        this.db.list(`/resources/${params['id']}`).query.once('value'),
        this.db.object(`/workspaces/${params['id']}`).query.once('value')
      ];

      Promise.all(promises).then((results: DataSnapshot[]) => {
        // Get Project and resources
        this.project = results[0].val();
        this.setFrameworkSupport(this.project.framework);
        this.startBlockly();
        
        this.resources = results[1].val();
        if(!this.resources)
          this.resources = {};
        
        // Restore workspace
        if(results[2].val())
          this.setWorkspace(results[2].val());
        else
          this.setWorkspace(this.defaultWorkspace);

        let resourcesWatcher = {};
        for(let r in this.resources) {
          resourcesWatcher[r] = false;
        }

        this.previewKey = this.db.createPushId();
        this.db.list('previews').set(this.previewKey, {
          id: this.previewKey,
          projectId: this.project.id,
          locked: false,
          resources: resourcesWatcher
        });

        let modalOpened = false;
        
        // TODO: Stop listening this after destroying lifecycle Angular
        this.db.object(`/previews/${this.previewKey}`).valueChanges().subscribe( (data: any) => {
          if(data.locked) {
            let resourcesReady: boolean = true;
            for(let resourceName in data.resources) {
              if(!data.resources[resourceName]) {
                let options: NgbModalOptions = {};
                options.backdrop = 'static';
                options.keyboard = false;
                if(!modalOpened) {
                  this.loadingResourceModalReference = this.modalService.open(this.loadingResourcesModal, options);
                  modalOpened = true;
                }
                resourcesReady = false;
                break;
              }
            }

            if(resourcesReady) {
              this.loadingResourceModalReference.close();
              modalOpened = false;

              // TODO: Hacky code for sending update event on Firebase
              this.db.object(`/interactions/${this.project.id}`).query.once('value').then(dataSnapshot => {
                this.db.list('interactions').set(this.project.id, dataSnapshot.val() + " ");
              });
            }
          }
          else {
            // TODO: Show loadingResourceModal while looping here, to avoid the user to add more resources
            for(let resourceName in data.resources) {
              this.db.list(`/previews/${this.previewKey}/resources`).set(resourceName, false);
            }
          }
        });        

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
        // Auto-save for every change detected
        this.save();
      }
    });

  }

  setWorkspace(workspace: string){
    // Initialize workspace with a Start Block
    Blockly.mainWorkspace.clear();
    Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(workspace), Blockly.mainWorkspace);
  }

  save() {
    // Save workspace
    let xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
    let xml_text:string = Blockly.Xml.domToPrettyText(xml);
    this.db.list('workspaces').set(this.project.id, xml_text);

    let code: string = Blockly.JSON.workspaceToCode(Blockly.mainWorkspace);
    if(this.checkGeneratedCode(code)) {
      this.db.list('interactions').set(this.project.id, code);
      /* this.messages.push({
        type: 'success',
        content: 'Project saved !',
      }); */
      // TODO: Show "interaction approved" message
    }
    else {
      /* this.messages.push({
        type: 'danger',
        content: 'Some interactions are incomplete and/or there are remaining blocks',
      }); */
      // TODO: Show "interaction rejected" message
    }
  }

  // TODO: Validate semantic
  checkGeneratedCode(code: string) : boolean {
    try {
      let interactions = JSON.parse(code).interactions;
      return true;
    } catch(e) {
      return false;
    }
  }

  openPreviewKeyModal(content) {
    this.previewKeyModalReference = this.modalService.open(content);
  }

  ngOnDestroy()	{
    // TODO: Remove when reloading
    const previewKeyRef = this.db.object(`/previews/${this.previewKey}`);
    previewKeyRef.remove();
  }

}
