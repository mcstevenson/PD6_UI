import {Component, OnInit} from '@angular/core';
import {first} from 'rxjs/operators';

import {AccountService} from '@app/_services';

@Component({templateUrl: 'users-jobs-list.component.html'})
export class UsersJobListComponent implements OnInit {
  jobs?: any[];
  jobStatus = ['Assigned', 'On the way', 'Checkin', 'Emergency', 'CheckinOut'];
  processId = null;

  constructor(private accountService: AccountService) {
  }

  ngOnInit() {
    this.accountService.getAllJobs()
      .pipe(first())
      .subscribe(jobs => {
          let filteredKeys = jobs.filter(job => job.status != this.jobStatus[0]
            || job.status != this.jobStatus[4] || job.status != this.jobStatus[3])
          if (filteredKeys.length > 1) {
            // @ts-ignore
            this.processId = filteredKeys[0].jobId;
          }
          this.jobs = jobs;
        }
      );
  }

  updateSatus(jobId: string, status: any) {
    const job = this.jobs!.find(x => x.jobId === jobId);

    this.jobs?.filter(x => x.jobId === jobId).forEach(x => x.status = status);
    this.accountService.updateSatus(jobId, {status})
      .pipe(first())
      .subscribe(() => this.jobs);
  }

  deleteUser(jobId: string) {
    const job = this.jobs!.find(x => x.jobId === jobId);
    job.isDeleting = true;
    this.accountService.delete(jobId)
      .pipe(first())
      .subscribe(() => this.jobs = this.jobs!.filter(x => x.jobId !== jobId));
  }
}
