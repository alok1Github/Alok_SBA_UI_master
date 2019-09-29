import { TestBed, async } from '@angular/core/testing';
import { of } from 'rxjs';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateUserComponent } from './create.commponent';
import { UserManagerService } from '../service/user-manager.service';
import { StatusType } from 'src/app/shared/enum/status-type';

describe('Create User component', () => {
    let component: CreateUserComponent;
    let mockUserManagerService: UserManagerService;

    beforeEach(async(() => {
        mockUserManagerService = jasmine.createSpyObj(UserManagerService.name, ["createUser", "updateUser"]);
        (mockUserManagerService.createUser as jasmine.Spy).and.returnValue(of({}));
        (mockUserManagerService.updateUser as jasmine.Spy).and.returnValue(of({}));

        TestBed.configureTestingModule({
            imports: [
                FormsModule,
                ReactiveFormsModule
            ],
            declarations: [
                CreateUserComponent
            ],
            providers: [
                { provide: UserManagerService, useValue: mockUserManagerService }
            ]
        }).compileComponents();

        const fixture = TestBed.createComponent(CreateUserComponent);
        component = fixture.debugElement.componentInstance;
        component.userForm = new FormBuilder().group({
            id: undefined,
            firstName: "first name",
            lastName: "last name",
            employeeId: 111,
            projectId: undefined,
            taskId: undefined
        });

        component.ngOnInit();
    }));

    it('should create component', () => {
        expect(component).toBeTruthy();
    });

    it('should call the add user on save', () => {
        component.save();
        expect(mockUserManagerService.createUser).toHaveBeenCalled();
    });
    
    it('should set status type to none on clickng reset', () => {
        component.reset();
        expect(component.status).toBe(StatusType.None);
    });

    it('should call the update user on save', () => {
        component.userForm.patchValue({ id: 1 });
        component.save();
        expect(mockUserManagerService.updateUser).toHaveBeenCalled();
    });

})