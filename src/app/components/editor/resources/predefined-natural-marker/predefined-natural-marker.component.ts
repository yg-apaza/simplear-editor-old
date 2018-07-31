import { Component, OnInit, Input } from '@angular/core';
import { IpcService } from '../../../../services/ipc.service';
import { Project } from '../../../../interfaces/project';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireDatabase } from 'angularfire2/database';
import PredefinedNaturalMarker from './predefined-natural-marker';
import { Resource } from '../../../../interfaces/resource';

@Component({
  selector: 'app-predefined-natural-marker',
  templateUrl: './predefined-natural-marker.component.html',
  styleUrls: ['./predefined-natural-marker.component.css'],
  providers: [IpcService]
})
export class PredefinedNaturalMarkerComponent implements OnInit {

  public static TYPE_NAME: string = 'pnmarker';

  @Input() project: Project;
  @Input() resources: any;

  // TODO: Set type to predefined-fiducial-marker.ts
  predefinedNaturalMarkerResources: Array<string> = [];
  predefinedNaturalMarkerResourcesIds: Array<string> = [];

  // Add predefined marker resource
  addPredefinedNaturalMarkerModalReference: NgbModalRef;
  selectedPredefinedNaturalMarker: string;
  availablePredefinedNaturalMarkers = PredefinedNaturalMarker;

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
      if(resource.type === PredefinedNaturalMarkerComponent.TYPE_NAME){
        this.predefinedNaturalMarkerResources.push(this.availablePredefinedNaturalMarkers[resource.content].path);
        this.predefinedNaturalMarkerResourcesIds.push(resource.id);
      }
    }
  }

  openAddPredefinedNaturalMarkerModal(content) {
    this.addPredefinedNaturalMarkerModalReference = this.modalService.open(content);
  }

  addPredefinedNaturalMarker() {
    if (this.selectedPredefinedNaturalMarker && this.selectedPredefinedNaturalMarker !== "") {
      let content = this.selectedPredefinedNaturalMarker;
      // TODO: Allow the user to set the resource id, currently the id matches the poly id 
      let id = content;

      let newPredefinedNaturalMarker: Resource = {
        id: id,
        // TODO: Allow the user to set a pretty resource name
        description: "",
        content: content,
        type: PredefinedNaturalMarkerComponent.TYPE_NAME
      };
      
      this.db.list(`resources/${this.project.id}/`).set(id, newPredefinedNaturalMarker);
      this.predefinedNaturalMarkerResources.push(this.availablePredefinedNaturalMarkers[this.selectedPredefinedNaturalMarker].path);
      this.predefinedNaturalMarkerResourcesIds.push(id);
      this.resources[content] = newPredefinedNaturalMarker;
      this.ipcService.sendResourceCreated(newPredefinedNaturalMarker);

      console.log(`Resource added: ${id}`);
    }

    this.addPredefinedNaturalMarkerModalReference.close();
  }

}
