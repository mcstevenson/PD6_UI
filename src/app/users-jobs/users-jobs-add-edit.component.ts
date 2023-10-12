import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';

@Component({ templateUrl: 'users-jobs-add-edit.component.html' })
export class JobAddEditComponent implements OnInit {
    form!: FormGroup;
    jobId?: string;
    title!: string;
    loading1 = false;
    submitting1 = false;
    submitted1 = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        this.jobId = this.route.snapshot.params['jobId'];

        // form with validation rules
        this.form = this.formBuilder.group({
            clientFirstName: ['', Validators.required],
            clientLastName: ['', Validators.required],
            postCode: ['', Validators.required],
            timeSlot: ['', Validators.required],...(!this.jobId ? [Validators.required] : [])
        });

        this.title = "Add Job"
        if (this.jobId) {
            // edit mode
            this.title = 'Edit Job';
            this.loading1 = true;
            this.accountService.getJobById(this.jobId)
                .pipe(first())
                .subscribe(x => {
                    this.form.patchValue(x);
                    this.loading1 = false;
                });
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted1 = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.submitting1 = true;
        this.saveJob()
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Job saved', { keepAfterRouteChange: true });
                    this.router.navigateByUrl('/userJobs');
                },
                error: error => {
                    this.alertService.error(error);
                    this.submitting1 = false;
                }
            })
    }

    private saveJob() {
        // create or update user based on id param
        return this.jobId
            ? this.accountService.updateJobs(this.jobId!, this.form.value)
            : this.accountService.register(this.form.value);
    }
}