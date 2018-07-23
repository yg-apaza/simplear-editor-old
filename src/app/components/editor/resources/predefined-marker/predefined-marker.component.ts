import { Component, OnInit, Input } from '@angular/core';
import { Project } from '../../../../interfaces/project';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireDatabase } from 'angularfire2/database';
import { Resource } from '../../../../interfaces/resource';
import PredefinedMarker from './predefined-marker';

@Component({
  selector: 'app-predefined-marker',
  templateUrl: './predefined-marker.component.html',
  styleUrls: ['./predefined-marker.component.css']
})
export class PredefinedMarkerComponent implements OnInit {

  public static TYPE_NAME: string = 'pmarker';

  @Input() project: Project;
  @Input() resources: any;

  // TODO: Set type to predefined-marker.ts
  predefinedMarkerResources: Array<string> = [];
  predefinedMarkerResourcesIds: Array<string> = [];

  // Add predefined marker resource
  addPredefinedMarkerModalReference: NgbModalRef;
  selectedPredefinedMarker: string;
  availablePredefinedMarkers = PredefinedMarker;

  constructor(
    private modalService: NgbModal,
    private db: AngularFireDatabase
  ) { }

  ngOnInit() {
    this.load();
  }

  load() {
    for (let name in this.resources) {
      let resource: Resource = this.resources[name];
      if(resource.type === PredefinedMarkerComponent.TYPE_NAME){
        this.predefinedMarkerResources.push(this.availablePredefinedMarkers[resource.content].path);
        this.predefinedMarkerResourcesIds.push(resource.id);
      }
    }
  }

  openAddPredefinedMarkerModal(content) {
    this.addPredefinedMarkerModalReference = this.modalService.open(content);
  }

  addPredefinedMarker() {
    if (this.selectedPredefinedMarker && this.selectedPredefinedMarker !== "") {
      let content = this.selectedPredefinedMarker;
      // TODO: Allow the user to set the resource id, currently the id matches the poly id 
      let id = content;

      let newPredefinedMarker = {
        id: id,
        // TODO: Allow the user to set a pretty resource name
        description: "",
        content: content,
        type: PredefinedMarkerComponent.TYPE_NAME
      };

      this.resources[content] = newPredefinedMarker;
      
      this.db.list(`resources/${this.project.id}/`).set(id, newPredefinedMarker);
      console.log(`Resource added: ${id}`);

      this.predefinedMarkerResources.push(this.availablePredefinedMarkers[this.selectedPredefinedMarker].path);
      this.predefinedMarkerResourcesIds.push(id);
    }

    this.addPredefinedMarkerModalReference.close();
  }
}