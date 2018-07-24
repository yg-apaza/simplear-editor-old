import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireDatabase } from 'angularfire2/database';
import { Project } from '../../interfaces/project';
import { IpcService } from '../../services/ipc.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
  providers: [IpcService]
})
export class ProjectsComponent implements OnInit {

  loadingProjects: boolean;
  // TODO: set to a defined type
  projects: any;
  newProject: Project = {
    id: "",
    title: "",
    description: "",
    framework: "artoolkit",
    /** TODO: Set Author to logged user */
    author: "John Doe"
  };
  createProjectModalReference: NgbModalRef;
  viewerIsReady: boolean = false;

  constructor(
    private router: Router,
    private db: AngularFireDatabase,
    private modalService: NgbModal,
    private ipcService: IpcService
  ) { }

  ngOnInit() {
    this.loadingProjects = true;
    this.loadProjects();
  }

  openModal(content) {
    this.createProjectModalReference = this.modalService.open(content);
  }

  loadProjects() {
    this.ipcService.sendWaitingViewer();
    this.ipcService.onViewerReady((event, args) => {
      console.log("on viewer ready");
      this.db.list('projects').query.once('value')
      .then(data => {
        this.projects = data.val();
        this.loadingProjects = false;
      });
    });
  }

  createProject() {
    this.newProject.id = this.db.createPushId();
    this.db.list('projects').set(this.newProject.id, this.newProject);
    console.log(`Created: ${this.newProject.id}`);
    this.createProjectModalReference.close();
    this.router.navigate(['/edit', this.newProject.id]);
  }

  removeProject(projectId) {
    const projectsRef = this.db.object(`/projects/${projectId}`);
    const resourcesRef = this.db.object(`/resources/${projectId}`);
    const interactionsRef = this.db.object(`/interactions/${projectId}`);
    const workspacesRef = this.db.object(`/workspaces/${projectId}`);

    projectsRef.remove();
    resourcesRef.remove();
    interactionsRef.remove();
    workspacesRef.remove();

    delete this.projects[projectId]
  }
}
