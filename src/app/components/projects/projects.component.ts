import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireDatabase } from 'angularfire2/database';
import { CreateProjectModal } from '../../interfaces/create-project-modal';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  loadingProjects: boolean;
  projects: any;
  createProjectModal: CreateProjectModal;
  createProjectModalReference: NgbModalRef;

  constructor(
    private router: Router,
    private db: AngularFireDatabase,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.loadProjects();
    this.createProjectModal = {
      title: "",
      description: "",
      framework: "artoolkit",
      author: "John Doe"
    };
  }

  openModal(content) {
    this.createProjectModalReference = this.modalService.open(content);
  }

  loadProjects() {
    this.loadingProjects = true;
    this.db.list('projects').query.once('value')
      .then(data => {
        this.projects = data.val();
        this.loadingProjects = false;
      });
  }

  createProject() {
    console.log(this.createProjectModal);
    const pushId = this.db.createPushId();
    const item = { ...this.createProjectModal, id: pushId };
    this.db.list('projects').set(item.id, item);
    
    console.log("Created: " + item.id);
    this.createProjectModalReference.close();
  }

}
