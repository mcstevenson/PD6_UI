import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserJobsLayoutComponent } from './users-jobs-layout.component';
import { UsersJobListComponent } from './users-jobs-list.component';
import { UserJobAddEditComponent } from './users-jobs-add-edit.component';

const routes: Routes = [
    {
        path: '', component: UserJobsLayoutComponent,
        children: [
            { path: '', component: UsersJobListComponent },
            { path: 'add-user-job', component: UserJobAddEditComponent },
            { path: 'edit-user-job/:id', component: UserJobAddEditComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UsersRoutingModule { }