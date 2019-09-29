import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../user';
import { Http, Response } from '@angular/http';

@Injectable()
export class UserManagerService {
    private users: User[];
    baseUrl: string = "http://localhost:49934/api/project/";

    constructor(private http: Http) { }

    get Users(): User[] {
        return this.users;
    }

    set Users(value: User[]) {
        this.users = value;
    }

    createUser(item): Observable<any> {
        return this.http.post(this.baseUrl, item);
    }

    updateUser(item): Observable<any> {
        return this.http.put(this.baseUrl+item.id, item);
    }

    deleteUser(item): Observable<any> {
        return this.http.delete(this.baseUrl + item.id);
    }

    getAllUsers(): Observable<User[]> {
        return this.http.get(this.baseUrl).pipe(map(this.mapUsers));
    }

    private mapUsers(response: Response) {

        if (response.status < 200 || response.status >= 300) {
            throw new Error('Bad response status: ' + response.status);
        }

        let body = response.json(); 
     
        return body || { };
    }
}