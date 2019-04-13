import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire/';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
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
import { AuthGuard } from './services/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { AppLayoutComponent } from './layout/app-layout/app-layout.component';
import { FooterComponent } from './layout/footer/footer.component';

const appRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    redirectTo: '/projects',
    pathMatch: 'full'
  },
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      {
        path: 'projects',
        component: ProjectsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'edit/:id',
        component: EditorComponent,
        canActivate: [AuthGuard]
      },
      {
        path: '**',
        component: PageNotFoundComponent
      }
    ]
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
    PredefinedNaturalMarkerComponent,
    LoginComponent,
    AppLayoutComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    NgbModule.forRoot(),
    FormsModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    )
  ],
  entryComponents: [
    LoadingComponent
  ],
  providers: [ AuthGuard ],
  bootstrap: [ AppComponent ]
})

export class AppModule { }
