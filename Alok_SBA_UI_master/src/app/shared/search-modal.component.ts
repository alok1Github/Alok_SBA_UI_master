import { Component, Output, EventEmitter, Input } from '@angular/core'
import { ActionType } from './enum/action-type';
import { Search } from './search';
import { TaskItem } from '../features/taskmanager/task-item';
import { Project } from '../features/projectmanager/project';
import { ProjectManagerService } from '../features/projectmanager/service/project-manager.service';
import { TaskManagerService } from '../features/taskmanager/service/task-manager.service';
import { UserManagerService } from '../features/usermanager/service/user-manager.service';
import { User } from '../features/usermanager/user';


@Component({
    templateUrl: './search-modal.component.html'
})

export class SearchModalComponent {
    readonly ActionType = ActionType;

    taskDetails:TaskItem[]
    tasks: TaskItem[];
    projects: Project[];
    users: User[];

    @Input() actionType: ActionType;
    @Output() selectedId = new EventEmitter();

    constructor(
        private projectManagerService: ProjectManagerService,
        private taskManagerService: TaskManagerService,
        private userManagerService: UserManagerService) { }

    ngOnInit(): void {
        if (this.actionType === ActionType.ViewParentTask) {
            this.searchParentTasks();
        } else if (this.actionType === ActionType.ViewProject) {
            this.searchProjects();
        } else if (this.actionType === ActionType.ViewUser) {
            this.searchUser();
        }
    }

    private searchParentTasks(): void {
        this.taskManagerService.getAllTasks()
        .subscribe(
            p => this.taskDetails = p.filter(res => !res.endTask)
        );
    };

    private searchProjects(): void {
        this.projectManagerService.getAllProjects().subscribe((response) => {
            this.projectManagerService.Projects = response;
            this.projects = response;
        });
    }

    private searchUser(): void {
        this.userManagerService.getAllUsers().subscribe((response) => {
            this.userManagerService.Users = response;
            this.users = response;
        });
    }

    onSelection(id: number): void {
        this.selectedId.emit({ actionType: this.actionType, id: id } as Search);
    }
}
