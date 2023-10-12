﻿import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User, Jobs} from '@app/_models';
@Injectable({ providedIn: 'root' })
export class AccountService {
    private userSubject: BehaviorSubject<User | null>;
    public user: Observable<User | null>;
    private jobSubject: BehaviorSubject<Jobs | null>;
    public job: Observable<Jobs | null>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')!));
        this.user = this.userSubject.asObservable();
        this.jobSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('job')!));
        this.job = this.jobSubject.asObservable();
    }

    public get userValue() {
        return this.userSubject.value;
    }


    public get clientValue() {
        return this.jobSubject.value;
    }

    login(username: string, password: string) {
        return this.http.post<User>(`${environment.apiUrl}/users/authenticate`, { username, password })
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
                this.userSubject.next(user);
                return user;
            }));
    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/account/login']);
    }

    register(user: User) {
        return this.http.post(`${environment.apiUrl}/users/register`, user);
    }

    
    registerJob(job: Jobs) {
        return this.http.post(`${environment.apiUrl}/userJobs/register`, job);
    }

    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/users`);
    }

    getById(id: string) {
        return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
    }

    update(id: string, params: any) {
        return this.http.put(`${environment.apiUrl}/users/${id}`, params)
            .pipe(map(x => {
                // update stored user if the logged in user updated their own record
                if (id == this.userValue?.id) {
                    // update local storage
                    const user = { ...this.userValue, ...params };
                    localStorage.setItem('user', JSON.stringify(user));

                    // publish updated user to subscribers
                    this.userSubject.next(user);
                }
                return x;
            }));
    }

    delete(id: string) {
        return this.http.delete(`${environment.apiUrl}/users/${id}`)
            .pipe(map(x => {
                // auto logout if the logged in user deleted their own record
                if (id == this.userValue?.id) {
                    this.logout();
                }
                return x;
            }));
    }

    updateJobs(jobId: string, params: any) {
        return this.http.put(`${environment.apiUrl}/usersJobs/${jobId}`, params)
            .pipe(map(x => {
                // update stored user if the logged in user updated their own record
                if (jobId == this.clientValue?.jobId) {
                    // update local storage
                    const client = { ...this.clientValue, ...params };
                    localStorage.setItem('job', JSON.stringify(client));

                    // publish updated user to subscribers
                    this.jobSubject.next(client);
                }
                return x;
            }));
    }

    getAllJobs() {
        return this.http.get<Jobs[]>(`${environment.apiUrl}/userJobs`);
    }

    getJobById(jobId: string) {
        return this.http.get<Jobs[]>(`${environment.apiUrl}/userJobs/${jobId}`);
    }


}