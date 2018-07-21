import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireDatabase } from 'angularfire2/database';
import { PolyService } from '../../../services/poly.service';
import { Project } from '../../../interfaces/project';
import { Resource } from '../../../interfaces/resource';
import { PolyGetResponse } from '../../../interfaces/responses/poly-get-response';

@Component({
  selector: 'app-poly',
  templateUrl: './poly.component.html',
  styleUrls: ['./poly.component.css'],
  providers: [PolyService]
})
export class PolyComponent implements OnInit {

  public static TYPE_NAME: string = 'poly';

  @Input() project: Project;
  @Input() resources: any;

  polyResources: Array<PolyGetResponse> = [];
  polyResourcesIds: Array<string> = [];

  // Add poly resource
  addResourceModalReference: NgbModalRef;
  keywords: string;
  // TODO: Set Asset as type
  searchResult: Array<any>;
  showPlaceholderEmptySearch: boolean;
  selectedResourceIndex: number;

  constructor(
    private modalService: NgbModal,
    private db: AngularFireDatabase,
    private polyService: PolyService
  ) { }

  ngOnInit() {
    this.load();
    this.showPlaceholderEmptySearch = true;
  }

  load() {
    let promises:Promise<PolyGetResponse>[] = [];

    for (let name in this.resources) {
      let resource: Resource = this.resources[name];
      if(resource.type === PolyComponent.TYPE_NAME){
        promises.push(this.polyService.getAsset({ name: resource.content }).toPromise());
        this.polyResourcesIds.push(resource.id);
      }
    }

    Promise.all(promises).then((results: PolyGetResponse[]) => {
      this.polyResources = results;
    });
  }

  openAddResourceModal(content) {
    // TODO: Clean textbox and results
    this.addResourceModalReference = this.modalService.open(content);
  }

  searchKeywords() {
    // TODO: Show all pages
    this.polyService.listAssets({ keywords: this.keywords, format: 'OBJ', pageSize: '12' })
        .subscribe(
            res => {
                this.searchResult = res.assets;
                if (this.searchResult && this.searchResult.length != 0)
                    this.showPlaceholderEmptySearch = false;
                else
                    this.showPlaceholderEmptySearch = true;
                this.selectedResourceIndex = -1;
            },
            err => {
                // TODO: Show error message
                console.log("Error occurred");
            }
        )
  }

  addResource() {
    // TODO: Show error message
    if (this.selectedResourceIndex && this.selectedResourceIndex !== -1) {
      let selectedResource = this.searchResult[this.selectedResourceIndex];
      let content = selectedResource.name.substring(7);
      // TODO: Allow the user to set the resource id, currently the id matches the poly id 
      let id = content;

      // TODO: Use real-time listening for this.resources
      let newResource = {
        id: id,
        // TODO: Allow the user to set a pretty resource name
        description: "",
        content: content,
        type: PolyComponent.TYPE_NAME
      };

      this.resources[content] = newResource;
      
      this.db.list(`resources/${this.project.id}/`).set(id, newResource);
      console.log(`Resource added: ${id}`);

      this.polyResources.push(selectedResource);
      this.polyResourcesIds.push(id);
    }

    this.addResourceModalReference.close();
}


}
