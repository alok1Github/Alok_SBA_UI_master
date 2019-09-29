import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import { Project } from '../project';
import { User } from '../../usermanager/user';
import { Http } from '@angular/http';

@Injectable()
export class ProjectManagerService {
    private projects: Project[];
    baseUrl: string = "http://localhost:49934/api/project/";

    constructor(private http: Http) { }

    get Projects(): Project[] {
        return this.projects;
    }

    set Projects(value: Project[]) {
        this.projects = value;
    }

    addProject(item): Observable<any> {
        return this.http.post(this.baseUrl, item);
    }

    updateProject(item): Observable<any> {
        return this.http.put(this.baseUrl + item.id, item);
    }

    deleteProject(item): Observable<any> {
        return this.http.delete(this.baseUrl + item.id);
    }

    getAllProjects(): Observable<Project[]> {
        return this.http.get(this.baseUrl).pipe(map(this.mapProjects));
    }

    private mapProjects(response: Response) {
        if (response.status < 200 || response.status >= 300) {
           throw new Error('Bad response status: ' + response.status);
        }
        let body = response.json(); // parse JSON string into JavaScript objects
    
        return body || { };
    }
}