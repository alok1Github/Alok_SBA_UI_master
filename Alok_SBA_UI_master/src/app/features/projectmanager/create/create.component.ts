import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AbstractControl, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { User } from '../../usermanager/user';
import { ProjectManagerService } from '../service/project-manager.service';
import { StatusType } from 'src/app/shared/enum/status-type';
import { UserManagerService } from '../../usermanager/service/user-manager.service';
import { SearchModalComponent } from 'src/app/shared/search-modal.component';
import { ActionType } from 'src/app/shared/enum/action-type';
import { Search } from 'src/app/shared/search';

@Component({
  selector: 'add-project',
  templateUrl: './create.component.html'
})

export class CreateProjectComponent implements OnInit {
  @Input() projectForm: FormGroup;
  @Output() onSave = new EventEmitter<boolean>();
  userDetails: User[];

  readonly Status = StatusType;

  selectedUser: User;
  modalRef: BsModalRef;
  status: StatusType;

  minStartDate = new Date();
  minEndDate = new Date(new Date().setDate((new Date().getDate() + 1)));

  get ProjectNameControl(): AbstractControl {
    return this.projectForm.get("name");
  }

  get EnableDatesControl(): AbstractControl {
    return this.projectForm.get("enableDates");
  }

  get StartDateControl(): AbstractControl {
    return this.projectForm.get("startDate");
  }

  get EndDateControl(): AbstractControl {
    return this.projectForm.get("endDate");
  }

  get FirstNameControl(): AbstractControl {
    return this.projectForm.get("user").get("firstName");
  }

  get LastNameControl(): AbstractControl {
    return this.projectForm.get("user").get("lastName");
  }

  get UserIdControl(): AbstractControl {
    return this.projectForm.get("user").get("userId");
  }

  get isEnableDatesNotSelected(): string {
    return this.EnableDatesControl.value === true ? null : "disabled";
  }

  constructor(
    private service: ProjectManagerService, 
    private userService: UserManagerService, 
    private modalService: BsModalService) { }

  ngOnInit(): void {
    this.status = StatusType.None;

    this.userService.getAllUsers().subscribe(userDetails => {
      this.userDetails = userDetails;
    })
  }

  save(): void {
    const request = this.projectForm.value;

    if (request && request.id) {
      this.service.updateProject(request).subscribe(() => {
        this.status = StatusType.Updated;
        if (this.selectedUser) {
          this.selectedUser.projectId = request.id;
          this.saveUser();
        }
      });
    } else {
      request.id = 0;
      this.service.addProject(request).subscribe(r => {
        this.status = StatusType.Added;
        if (this.selectedUser) {
          this.selectedUser.projectId = r._body;
          this.saveUser();
        }
      });
    }
  }

  reset(): void {
    this.projectForm.reset();
    this.status = StatusType.None;
  }

  openModal() {
    this.modalRef = this.modalService.show(SearchModalComponent, { initialState: { actionType: ActionType.ViewUser } });
    this.modalRef.content.selectedId.subscribe(value => this.updateEmittedValue(value))
  }

  private updateEmittedValue(searchResponse: Search) {
    if (searchResponse.id) {
      this.selectedUser = this.userService.Users.find(t => t.id === searchResponse.id);
      this.FirstNameControl.patchValue(this.selectedUser.firstName);
      this.LastNameControl.patchValue(this.selectedUser.lastName);
      this.UserIdControl.patchValue(this.selectedUser.id);
    }

    this.modalService.hide(1);
  }

  private saveUser(): void {
    this.userService.updateUser(this.selectedUser).subscribe(() => {
      this.projectForm.reset();
      this.onSave.emit(true);
    })
  }
}