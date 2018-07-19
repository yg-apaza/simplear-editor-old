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
      id: "",
      title: "",
      description: "",
      framework: "artoolkit",
      /** TODO: Set Author to logged user */
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
    this.newProject.id = this.db.createPushId();
    this.db.list('projects').set(this.newProject.id, this.newProject);
    console.log("Created: " + this.newProject.id);
    this.createProjectModalReference.close();
    this.router.navigate(['/edit', this.newProject.id]);
  }

  removeProject(projectId) {
    const itemRef = this.db.object(`/projects/${projectId}`);
    itemRef.remove();
    delete this.projects[projectId]
  }
}
