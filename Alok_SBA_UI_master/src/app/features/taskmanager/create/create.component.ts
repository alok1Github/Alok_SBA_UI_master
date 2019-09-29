import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router} from '@angular/router';
import { TaskItem } from '../task-item';
import { TaskManagerService } from '../service/task-manager.service';
import { Project } from '../../projectmanager/project';
import { User } from '../../usermanager/user';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { StatusType } from 'src/app/shared/enum/status-type';
import { ProjectManagerService } from '../../projectmanager/service/project-manager.service';
import { UserManagerService } from '../../usermanager/service/user-manager.service';
import { SearchModalComponent } from 'src/app/shared/search-modal.component';
import { ActionType } from 'src/app/shared/enum/action-type';
import { Search } from 'src/app/shared/search';


@Component({
  templateUrl: './create.component.html'
})
export class CreateComponent implements OnInit {

  @ViewChild('showmodal') showmodal:ElementRef;
  taskDetails:TaskItem[]
  projectDetails: Project[];
  userDetails: User[];
  public taskDetail:TaskItem;
  results:string
  modalRef: BsModalRef;
  selectedUser: User;
  status: StatusType;
  isParentTask: boolean = false;

  constructor(
    private taskManagerService: TaskManagerService,
    private projectManagerService: ProjectManagerService,
    private userManagerService: UserManagerService,
    private modalService: BsModalService,
    private router: Router
  ) { 
    this.onResetTask();
  }

  ngOnInit() {
    this.taskManagerService.getAllTasks().subscribe(
      taskDetails => {
        this.taskDetails = taskDetails.filter(taskItem => !taskItem.endTask);
      });
  }

  onParentTaskSelection(event): void {
    this.isParentTask = event.target.checked;

    if (this.isParentTask) {
      this.onResetTask();
    }
  }

  onAddTask() {
    this.taskManagerService.createTask(this.taskDetail).subscribe(response => {
      this.results = "Task " + response + " added successfully.";
      this.openModal();
      this.status = StatusType.Added;
      if (this.isParentTask) {
        this.taskDetail.id = +response;
        this.taskDetail.parentTaskId = +response;
        this.onUpdateTask();
      } else {
        if (this.selectedUser) {
          this.selectedUser.taskId = +response;
          this.saveUser();
        }
      }
    },
    error => {
      if(error.status < 200 || error.status > 300)
        this.results = JSON.parse(error._body);
        this.openModal();
    });
  }

  onUpdateTask() {
    this.taskManagerService.updateTask(this.taskDetail, this.taskDetail.id)
        .subscribe(response => {
        },
        error => {
            if(error.status < 200 || error.status > 300)
            this.results = JSON.parse(error._body);
            this.openModal();
        }
    );
  }

  onResetTask() {
    if (!this.taskDetail) {
      this.taskDetail = new TaskItem();
    }
    
    this.taskDetail.startDate = new Date();
    this.taskDetail.endDate = new Date(new Date().setDate((new Date().getDate() + 1)));
    this.taskDetail.priority = 0;
  }

  openModal() {
    this.showmodal.nativeElement.click();
  }

  closeModal() {
    this.router.navigate(['/view']);
  }

  showProjectModal() {
    this.modalRef = this.modalService.show(SearchModalComponent, { initialState: { actionType: ActionType.ViewProject } });
    this.modalRef.content.selectedId.subscribe(value => this.updateEmittedValue(value));
  }

  showUserModal() {
    this.modalRef = this.modalService.show(SearchModalComponent, { initialState: { actionType: ActionType.ViewUser } });
    this.modalRef.content.selectedId.subscribe(value => this.updateEmittedValue(value));
  }

  private updateEmittedValue(searchResponse: Search) {
    if (searchResponse.id) {
      switch (searchResponse.actionType) {
        case ActionType.ViewProject:
          const project = this.projectManagerService.Projects.find(t => t.id === searchResponse.id);
          this.taskDetail.projectId = project.id;
          this.taskDetail.projectName = project.name;
          break;
        case ActionType.ViewUser:
          this.selectedUser = this.userManagerService.Users.find(t => t.id === searchResponse.id);
          this.taskDetail.userId = this.selectedUser.id;
          this.taskDetail.userName = this.selectedUser.firstName;
          break;
      }
    }

    this.modalService.hide(1);
  }

  private saveUser(): void {
    this.userManagerService.updateUser(this.selectedUser).subscribe(() => {
      this.onResetTask();
    })
  }
}