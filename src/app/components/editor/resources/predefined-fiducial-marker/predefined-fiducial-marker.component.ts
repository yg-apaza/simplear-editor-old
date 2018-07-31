import { Component, OnInit, Input } from '@angular/core';
import { Project } from '../../../../interfaces/project';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireDatabase } from 'angularfire2/database';
import { Resource } from '../../../../interfaces/resource';
import PredefinedFiducialMarker from './predefined-fiducial-marker';
import { IpcService } from '../../../../services/ipc.service';

@Component({
  selector: 'app-predefined-fiducial-marker',
  templateUrl: './predefined-fiducial-marker.component.html',
  styleUrls: ['./predefined-fiducial-marker.component.css'],
  providers: [IpcService]
})
export class PredefinedFiducialMarkerComponent implements OnInit {

  public static TYPE_NAME: string = 'pfmarker';

  @Input() project: Project;
  @Input() resources: any;

  // TODO: Set type to predefined-fiducial-marker.ts
  predefinedFiducialMarkerResources: Array<string> = [];
  predefinedFiducialMarkerResourcesIds: Array<string> = [];

  // Add predefined marker resource
  addPredefinedFiducialMarkerModalReference: NgbModalRef;
  selectedPredefinedFiducialMarker: string;
  availablePredefinedFiducialMarkers = PredefinedFiducialMarker;

  constructor(
    private modalService: NgbModal,
    private db: AngularFireDatabase,
    private ipcService: IpcService
  ) { }

  ngOnInit() {
    this.load();
  }

  load() {
    for (let name in this.resources) {
      let resource: Resource = this.resources[name];
      if(resource.type === PredefinedFiducialMarkerComponent.TYPE_NAME){
        this.predefinedFiducialMarkerResources.push(this.availablePredefinedFiducialMarkers[resource.content].path);
        this.predefinedFiducialMarkerResourcesIds.push(resource.id);
      }
    }
  }

  openAddPredefinedFiducialMarkerModal(content) {
    this.addPredefinedFiducialMarkerModalReference = this.modalService.open(content);
  }

  addPredefinedFiducialMarker() {
    if (this.selectedPredefinedFiducialMarker && this.selectedPredefinedFiducialMarker !== "") {
      let content = this.selectedPredefinedFiducialMarker;
      // TODO: Allow the user to set the resource id, currently the id matches the poly id 
      let id = content;

      let newPredefinedFiducialMarker: Resource = {
        id: id,
        // TODO: Allow the user to set a pretty resource name
        description: "",
        content: content,
        type: PredefinedFiducialMarkerComponent.TYPE_NAME
      };
      
      this.db.list(`resources/${this.project.id}/`).set(id, newPredefinedFiducialMarker);
      this.predefinedFiducialMarkerResources.push(this.availablePredefinedFiducialMarkers[this.selectedPredefinedFiducialMarker].path);
      this.predefinedFiducialMarkerResourcesIds.push(id);
      this.resources[content] = newPredefinedFiducialMarker;
      this.ipcService.sendResourceCreated(newPredefinedFiducialMarker);

      console.log(`Resource added: ${id}`);
    }

    this.addPredefinedFiducialMarkerModalReference.close();
  }
}