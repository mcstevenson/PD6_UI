import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService } from '@app/_services';

@Component({ templateUrl: 'users-jobs-list.component.html' })
export class UsersJobListComponent implements OnInit {
    jobs?: any[];

    constructor(private accountService: AccountService) {}

    ngOnInit() {
        this.accountService.getAllJobs()
            .pipe(first())
            .subscribe(jobs => this.jobs = jobs);
    }

    deleteUser(jobId: string) {
        const job = this.jobs!.find(x => x.jobId === jobId);
        job.isDeleting = true;
        this.accountService.delete(jobId)
            .pipe(first())
            .subscribe(() => this.jobs = this.jobs!.filter(x => x.jobId !== jobId));
    }
}