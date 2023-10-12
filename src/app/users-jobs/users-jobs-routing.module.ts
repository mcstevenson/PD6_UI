import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserJobsLayoutComponent } from './users-jobs-layout.component';
import { UsersJobListComponent } from './users-jobs-list.component';
import { JobAddEditComponent } from './users-jobs-add-edit.component';

const routes: Routes = [
    {
        path: '', component: UserJobsLayoutComponent,
        children: [
            { path: '', component: UsersJobListComponent },
            { path: 'addJob', component: JobAddEditComponent },
            { path: 'userJobs/:jobId', component: JobAddEditComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UsersRoutingModule { }
