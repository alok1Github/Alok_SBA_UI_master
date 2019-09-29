import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AbstractControl, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { UserManagerService } from '../service/user-manager.service';
import { StatusType } from 'src/app/shared/enum/status-type';


@Component({
  selector: 'add-user',
  templateUrl: './create.component.html'
})

export class CreateUserComponent implements OnInit {
  @Input() userForm: FormGroup;
  @Output() onSave = new EventEmitter<boolean>();

  status: StatusType;

  readonly Status = StatusType;
  isEditUser: boolean;

  get FirstNameControl(): AbstractControl {
    return this.userForm.get("firstName");
  }

  get LastNameControl(): AbstractControl {
    return this.userForm.get("lastName");
  }

  get EmployeeIdControl(): AbstractControl {
    return this.userForm.get("employeeId");
  }

  constructor(private service: UserManagerService) { }

  ngOnInit(): void {
    this.status = StatusType.None;
  }

  save(): void {
    const request = this.userForm.value;

    if (request && request.id) {
      this.service.updateUser(request).subscribe(() => {
        this.status = StatusType.Updated;
        this.userForm.reset();
        this.onSave.emit(true);
      });
    } else {
      this.service.createUser(request).subscribe(() => {
        this.status = StatusType.Added;
        this.userForm.reset();
        this.onSave.emit(true);
      });
    }
  }

  reset(): void {
    this.userForm.reset();
    this.status = StatusType.None;
  }
}
