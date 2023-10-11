import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

import {JobDetailRoutingModule} from './jobDetail-routing.module';
import {JobDetailLayoutComponent} from './jobDetail-layout.component';
import {JobDetailListComponent} from './jobDetail-list.component';
import {JobDetailAddEditComponent} from './jobDetail-add-edit.component';
import {JobDetailProcessComponent} from "@app/jobDetail/jobDetail-process.component";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    JobDetailRoutingModule
  ],
  declarations: [
    JobDetailLayoutComponent,
    JobDetailListComponent,
    JobDetailAddEditComponent,
    JobDetailProcessComponent
  ]
})
export class JobDetailModule {
}
