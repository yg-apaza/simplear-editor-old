import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireDatabase } from 'angularfire2/database';
import { Project } from '../../interfaces/project';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  loadingProjects: boolean;
  projects: any;
  newProject: Project;
  createProjectModalReference: NgbModalRef;

  constructor(
    private router: Router,
    private db: AngularFireDatabase,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.loadProjects();
    this.newProject = {
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
    console.log(this.newProject);
    const pushId = this.db.createPushId();
    const item = { ...this.newProject, id: pushId };
    this.db.list('projects').set(item.id, item);
    
    console.log("Created: " + item.id);
    this.createProjectModalReference.close();
  }

}
