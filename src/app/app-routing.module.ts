import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

 import { HomeComponent } from './home';
// import { ListComponent } from './users/list.component';
import { AuthGuard } from './_helpers';

const accountModule = () => import('./account/account.module').then(x => x.AccountModule);
const usersModule = () => import('./users/users.module').then(x => x.UsersModule);
const creditModule = () => import('./credits/credits.module').then(x => x.CreditModule);
const jobDetailModule =  () => import('./jobDetail/jobDetail.module').then(x => x.JobDetailModule);
const usersJobDetailModule =  () => import('./users-jobs/users-jobs.module').then(x => x.UsersJobModule);

const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'users', loadChildren: usersModule, canActivate: [AuthGuard] },
    { path: 'account', loadChildren: accountModule },
    { path: 'jobDetail', loadChildren: jobDetailModule },
    { path: 'credits', loadChildren: creditModule },
    { path: 'userJobs', loadChildren: usersJobDetailModule },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
