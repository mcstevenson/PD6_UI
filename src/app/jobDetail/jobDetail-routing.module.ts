import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JobDetailLayoutComponent } from './jobDetail-layout.component';
import { JobDetailListComponent } from './jobDetail-list.component';
import { JobDetailAddEditComponent } from './jobDetail-add-edit.component';
import { JobDetailProcessComponent } from './jobDetail-process.component';


const routes: Routes = [
    {
        path: '', component: JobDetailLayoutComponent,
        children: [
            { path: '', component: JobDetailListComponent },
            { path: 'add', component: JobDetailAddEditComponent },
            { path: 'edit/:id', component: JobDetailAddEditComponent },
          { path: 'process/:id', component: JobDetailProcessComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class JobDetailRoutingModule { }
