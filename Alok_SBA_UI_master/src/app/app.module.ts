import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule, ModalModule } from "ngx-bootstrap";
import { ViewComponent } from './features/taskmanager/get/view.component';
import { CreateComponent } from './features/taskmanager/create/create.component';
import { EditComponent } from './features/taskmanager/put/edit.component';
import { CreateProjectComponent } from './features/projectmanager/create/create.component';
import { ViewProjectComponent } from './features/projectmanager/get/view.component';
import { CreateUserComponent } from './features/usermanager/create/create.commponent';
import { ViewUserComponent } from './features/usermanager/get/view.component';
import { SearchPipe } from './features/taskmanager/service/search.pipe';
import { SearchModalComponent } from './shared/search-modal.component';
import { SearchTasksComponent } from './features/taskmanager/search/search.component';
import { TaskManagerService } from './features/taskmanager/service/task-manager.service';
import { ProjectManagerService } from './features/projectmanager/service/project-manager.service';
import { UserManagerService } from './features/usermanager/service/user-manager.service';



const appRoutes: Routes = [
  { path: "", component: ViewComponent },
  { path: "create", component: CreateComponent, pathMatch : "full" },
  { path: "view", component: ViewComponent, pathMatch : "full" },
  { path: "edit", component: EditComponent, pathMatch : "full" },
  { path: "add-project", component: CreateProjectComponent, pathMatch: "full" },
  { path: "view-project", component: ViewProjectComponent, pathMatch: "full" },
  { path: "add-user", component: CreateUserComponent, pathMatch: "full" },
  { path: "view-user", component: ViewUserComponent, pathMatch: "full" }
]

@NgModule({
  declarations: [
    AppComponent,
    CreateComponent,
    ViewComponent,
    SearchPipe,
    EditComponent,
    ViewProjectComponent,
    CreateProjectComponent,
    CreateUserComponent,
    ViewUserComponent,
    SearchModalComponent,
    SearchTasksComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot()
  ],
  providers: [
    TaskManagerService,
    ProjectManagerService,
    UserManagerService
  ],
  bootstrap: [AppComponent],
  entryComponents: [SearchModalComponent]
})
export class AppModule { }
