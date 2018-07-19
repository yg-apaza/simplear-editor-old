import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import { Project } from '../../interfaces/project';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

  loadingProject: boolean;
  project: Project;
  alerts: Array<any> = [];

  constructor(
    private route: ActivatedRoute,
    private db: AngularFireDatabase
  ) { }

  ngOnInit() {
    this.loadingProject = true;

    this.route.params.subscribe(params => {
      this.db.object(`/projects/${params['id']}`).query.once('value')
        .then(data => {
          this.project = data.val();
          this.loadingProject = false;
        });;
    });
  }

}
