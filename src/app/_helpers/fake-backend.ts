import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, materialize, dematerialize } from 'rxjs/operators';
// // @ts-ignore
// import * as usersData from "../../staticData/userdata.json";
// @ts-ignore
//import * as jobData from "../../staticData/jobdata.json";

// array in local storage for registered users
const usersKey = 'listening-buddy-users';
let users: any[] = JSON.parse(localStorage.getItem(usersKey)!) || [];
const jobsKey = 'listening-buddy-jobs';
let jobs: any[] = JSON.parse(localStorage.getItem(jobsKey)!) || [];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {


//   constructor(){
//     this.ngOnInit();
//   }

//   public ngOnInit(): void{
//     localStorage.setItem(jobData, JSON.stringify([]))
//         jobData.default.forEach((job: { jobId: any; }) =>{
//       if(!jobs.find(x => x.jobId === job.jobId as any )){
//         jobs.push(job);
//         localStorage.setItem(jobsKey, JSON.stringify(jobs));
//       }
//     })
//   }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        return handleRoute();

        function handleRoute() {
          console.log("handleRoute url: " + url +" "+ method)
            switch (true) {
                case url.endsWith('/users/authenticate') && method === 'POST':
                    return authenticate();
                case url.endsWith('/users/register') && method === 'POST':
                    return register();
                case url.endsWith('/users') && method === 'GET':
                    return getUsers();
                case url.match(/\/users\/\d+$/) && method === 'GET':
                    return getUserById();
                case url.match(/\/users\/\d+$/) && method === 'PUT':
                    return updateUser();
                case url.match(/\/users\/\d+$/) && method === 'DELETE':
                    return deleteUser();
                    case url.endsWith('/userJobs/register') && method === 'POST':
                        return registerJob();
                    case url.endsWith('/userJobs') && method === 'GET':
                        return getAllJobs();
                    case url.match(/\/userJobs\/\d+$/) && method === 'GET':
                        return getJobsById();
                    case url.match(/\/userJobs\/\d+$/) && method === 'PUT':
                        return updateJobs();
                default:
                    // pass through any requests not handled above
                    return next.handle(request);
            }
        }

        // route functions

        function authenticate() {
            const { username, password } = body;
            const user = users.find(x => x.username === username && x.password === password);
            if (!user) return error('Username or password is incorrect');
            return ok({
                ...basicDetails(user),
                token: 'fake-jwt-token'
            })
        }

        function register() {
            const user = body

            if (users.find(x => x.username === user.username)) {
                return error('Username "' + user.username + '" is already taken')
            }

            user.id = users.length ? Math.max(...users.map(x => x.id)) + 1 : 1;
            users.push(user);
            localStorage.setItem(usersKey, JSON.stringify(users));
            return ok();
        }

        function registerJob() {
            const job = body

            if (jobs.find(x => x.clientFirstName === job.clientFirstName && x.clientLastName === job.clientLastName && x.clientDob === job.clientDob)) {
                return error('Client name "' + job.clientFirstName + '" is already taken')
            }

            job.jobId = jobs.length ? Math.max(...jobs.map(x => x.jobId)) + 1 : 1;
            jobs.push(job);
            localStorage.setItem(jobsKey, JSON.stringify(jobs));
            return ok();
        }

        function getUsers() {
            if (!isLoggedIn()) return unauthorized();
            return ok(users.map(x => basicDetails(x)));
        }

        function getUserById() {
            if (!isLoggedIn()) return unauthorized();

            const user = users.find(x => x.id === idFromUrl());
            return ok(basicDetails(user));
        }

        function updateUser() {
            if (!isLoggedIn()) return unauthorized();

            let params = body;
            let user = users.find(x => x.id === idFromUrl());

            // only update password if entered
            if (!params.password) {
                delete params.password;
            }

            // update and save user
            Object.assign(user, params);
            localStorage.setItem(usersKey, JSON.stringify(users));

            return ok();
        }

        function deleteUser() {
            if (!isLoggedIn()) return unauthorized();

            users = users.filter(x => x.id !== idFromUrl());
            localStorage.setItem(usersKey, JSON.stringify(users));
            return ok();
        }

        function getJobsById() {
             const job = jobs.find(x => x.jobId === idFromUrl());
            return ok(basicJobDetails(job));
        }

        function updateJobs() {

          console.log(updateJobs)
            if (!isLoggedIn()) return unauthorized();

            let params = body;
            let job = jobs.find(x => x.jobId === idFromUrl());

            // update and save client
            Object.assign(job, params);
            localStorage.setItem(jobsKey, JSON.stringify(jobs));

            return ok();
        }


        function getAllJobs() {
             if (!isLoggedIn()) return unauthorized();
            return ok(jobs.map(x => basicJobDetails(x)));
        }

        // helper functions

        function ok(body?: any) {
            return of(new HttpResponse({ status: 200, body }))
                .pipe(delay(500)); // delay observable to simulate server api call
        }

        function error(message: string) {
            return throwError(() => ({ error: { message } }))
                .pipe(materialize(), delay(500), dematerialize()); // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648);
        }

        function unauthorized() {
            return throwError(() => ({ status: 401, error: { message: 'Unauthorized' } }))
                .pipe(materialize(), delay(500), dematerialize());
        }

        function basicDetails(user: any) {
            const { id, username, firstName, lastName } = user;
            return { id, username, firstName, lastName };
        }

        function isLoggedIn() {
            return headers.get('Authorization') === 'Bearer fake-jwt-token';
        }

        function idFromUrl() {
            const urlParts = url.split('/');
            return parseInt(urlParts[urlParts.length - 1]);
        }

        function basicJobDetails(job: any) {
           // const { jobId, clientFirstName, clientLastName, postCode, add timeSlot } = job;
            return job ; // { jobId, clientFirstName, clientLastName, postCode, timeSlot};
        }
    }
}

export const fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};



