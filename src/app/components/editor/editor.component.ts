import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import { Project } from '../../interfaces/project';
import { BlocksDefinition } from './blocks-definition';
import { Support } from '../../interfaces/support';

// Supported frameworks
import ArtoolkitSupport from './frameworks/artoolkit-support';
import VuforiaSupport from './frameworks/vuforia-support';

declare var Blockly: any;

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

  loadingProject: boolean;
  project: Project;
  alerts: Array<any> = [];

  // Blockly parameters
  frameworkSupport: Support;
  
  workspace: string = 
    `<xml>
      <block type="start" deletable="false" movable="false"></block>
    </xml>`

  constructor(
    private route: ActivatedRoute,
    private db: AngularFireDatabase
  ) { }

  ngOnInit() {
    this.loadingProject = true;
    
    this.route.params.subscribe(params => {
      this.db.object(`/projects/${params['id']}`).query.once('value')
        .then(data => {
          this.loadingProject = false;
          this.project = data.val();
          
          this.setFrameworkSupport(this.project.framework);
          this.startBlockly();
        });;
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
    let onresize = function (e) {
      let element: HTMLElement = blocklyArea;
      let x = 0, y = 0;
      do {
        x += element.offsetLeft;
        y += element.offsetTop;
        element = element.offsetParent as HTMLElement;
      } while (element);
      blocklyDiv.style.left = x + 'px';
      blocklyDiv.style.top = y + 'px';
      blocklyDiv.style.width = blocklyArea.offsetWidth + 'px';
      blocklyDiv.style.height = blocklyArea.offsetHeight + 'px';
    };
    window.addEventListener('resize', onresize, false);
    onresize(1);
    Blockly.svgResize(workspacePlayground);

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
