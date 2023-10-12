import { Component } from '@angular/core';

import { AccountService } from './_services';
import { Jobs, User } from './_models';


// @ts-ignore
import * as usersData from '../staticData/userData.json';

// @ts-ignore
import * as jobsData from '../staticData/jobData.json';

const usersKey = 'listening-buddy-users';
let users: any[] = JSON.parse(localStorage.getItem(usersKey)!) || [];


const jobsKey = 'listening-buddy-jobs';
let jobs: any[] = JSON.parse(localStorage.getItem(jobsKey)!) || [];

@Component({ selector: 'app-root', templateUrl: 'app.component.html' })
export class AppComponent {
    user?: User | null;
    job?: Jobs | null;

    constructor(private accountService: AccountService) {
        this.accountService.user.subscribe(x => this.user = x);
        this.accountService.job.subscribe(x => this.job = x);
        this.ngOnInit();
    }



  public ngOnInit(): void{
    usersData.default.forEach((user: { id: any; }) =>{
      if(! users.find(x => x.id === user.id as any )){
        users.push(user);
        localStorage.setItem(usersKey, JSON.stringify(users));
      }
    })


    jobsData.default.forEach((job: { jobId: any; }) =>{
      if(! jobs.find(x => x.jobId === job.jobId as any )){
        jobs.push(job);
        localStorage.setItem(jobsKey, JSON.stringify(jobs));
      }
    })
  }

    logout() {
        this.accountService.logout();
    }
}
