import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { NgxElectronModule } from 'ngx-electron';
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { LoadingDirective } from './directives/loading.directive';
import { LoadingComponent } from './components/loading/loading.component';
import { EditorComponent } from './components/editor/editor.component';
import { PolyComponent } from './components/editor/resources/poly/poly.component';
import { PredefinedFiducialMarkerComponent } from './components/editor/resources/predefined-fiducial-marker/predefined-fiducial-marker.component';
import { PredefinedNaturalMarkerComponent } from './components/editor/resources/predefined-natural-marker/predefined-natural-marker.component';

const appRoutes: Routes = [
  {
    path: 'projects',
    component: ProjectsComponent
  },
  {
    path: 'edit/:id',
    component: EditorComponent
  },
  {
    path: '',
    redirectTo: '/projects',
    pathMatch: 'full'
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    ProjectsComponent,
    PageNotFoundComponent,
    LoadingDirective,
    LoadingComponent,
    EditorComponent,
    PolyComponent,
    PredefinedFiducialMarkerComponent,
    PredefinedNaturalMarkerComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    NgbModule.forRoot(),
    NgxElectronModule,
    FormsModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    )
  ],
  entryComponents: [
    LoadingComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
