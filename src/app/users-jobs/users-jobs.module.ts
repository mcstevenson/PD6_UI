import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-jobs-routing.module';
import { UserJobsLayoutComponent } from './users-jobs-layout.component';
import { UsersJobListComponent } from './users-jobs-list.component';
import { JobAddEditComponent } from './users-jobs-add-edit.component';
import {JobProcessComponent} from './users-jobs-process.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        UsersRoutingModule
    ],
    declarations: [
        UserJobsLayoutComponent,
        UsersJobListComponent,
        JobAddEditComponent,
        JobProcessComponent
    ]
})
export class UsersJobModule { }
