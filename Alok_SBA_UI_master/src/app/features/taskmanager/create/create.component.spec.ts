import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of as observableOf, Observable, throwError, of } from 'rxjs';
import { FormsModule }   from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Router,ActivatedRoute} from '@angular/router';
import { TaskItem } from '../task-item';
import { TaskManagerService } from '../service/task-manager.service';
import { CreateComponent } from './create.component';
import { MockTaskManagerService } from '../service/task-manager.service.spec';
import { BsModalService, BsDatepickerModule, ModalModule, BsModalRef } from 'ngx-bootstrap';

import { CommonModule } from '@angular/common';
import { UserManagerService } from '../../usermanager/service/user-manager.service';
import { ProjectManagerService } from '../../projectmanager/service/project-manager.service';
import { Search } from 'src/app/shared/search';
import { ActionType } from 'src/app/shared/enum/action-type';


describe('Create Task Component', () => {
  let component: CreateComponent;
  let fixture: ComponentFixture<CreateComponent>;
  let service : TaskManagerService; 
  let mockUserManagerService: UserManagerService;
  let mockModalService: BsModalService;
  let mockProjectManagerService: ProjectManagerService;

  const TaskDetails : any[] = [{ "id": 1, "name": "Task 1", "startDate": Date.now, 
    "endDate" :Date.now, "priority":10, 
    "endTask":false, "parentTaskId":2, "parentName":"parent" },
    { "id": 2, "name": "Task 2", "startDate": Date.now, "endDate": Date.now,
     "priority":10, "endTask":true, "parentTaskId":2, "parentName":"parent" }
  ];

  let mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(async(() => {
    mockUserManagerService = jasmine.createSpyObj(UserManagerService.name, ["updateUser"]);
    (mockUserManagerService.updateUser as jasmine.Spy).and.returnValue(of("2"));

    mockModalService = jasmine.createSpyObj(BsModalService.name, ["show", "hide"]);
    (mockModalService.hide as jasmine.Spy).and.returnValue(new BsModalRef());

    mockModalService.show = (): BsModalRef => {
        return { hide: null, content: { selectedId: of(new Search(1, ActionType.ViewUser)) } };
    };

    mockProjectManagerService = jasmine.createSpyObj(ProjectManagerService.name, ["getAllProjects"]);

    TestBed.configureTestingModule({
      imports: [ 
        CommonModule,
        RouterTestingModule,
        FormsModule,
        BsDatepickerModule.forRoot(),
        ModalModule.forRoot()
      ],
      declarations: [ CreateComponent ] , 
      providers: [
        { provide: TaskManagerService, useClass: MockTaskManagerService },
        { provide: UserManagerService, useValue: mockUserManagerService },
        { provide: ProjectManagerService, useValue: mockProjectManagerService },
        { provide: BsModalService, useValue: mockModalService },
        { provide: Router, useValue: mockRouter}
      ]
    })    
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateComponent);
    component = fixture.componentInstance;
    service = TestBed.get(TaskManagerService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();   
  });

  it('should return Task details', () => {
    spyOn(service,'getAllTasks').and.returnValues(observableOf(TaskDetails));
    component.ngOnInit();
    expect(1).toBe(component.taskDetails.length);
    expect("Task 1").toBe(component.taskDetails[0].name);
  }); 
 

  it('resetting Task Detail should reset base properties', () => {
    arrageTaskDetails(component);

    component.onResetTask();          
    expect(0).toBe(component.taskDetail.priority);
    expect(component.taskDetail.startDate).toBeDefined();
    expect(component.taskDetail.endDate).toBeDefined();   
  })

  it ('onclose modal should go to view', () => {
    component.closeModal();     
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/view']);
  })
  
  function arrageTaskDetails(component: CreateComponent) {
    var taskDetail = new TaskItem();
    component.taskDetail = taskDetail;
    console.log(component.taskDetail.name);
    taskDetail.name = "task 1";
    taskDetail.id = 1;
    taskDetail.priority = 10;
  }
});


