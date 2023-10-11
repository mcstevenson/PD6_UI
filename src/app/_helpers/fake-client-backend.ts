import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, materialize, dematerialize } from 'rxjs/operators';

// array in local storage for registered clients
const usersKey = 'listening-buddy-client';
let clients: any[] = JSON.parse(localStorage.getItem(usersKey)!) || [];

@Injectable()
export class FakeClientBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        return handleRoute();

        function handleRoute() {
            switch (true) {
                case url.endsWith('/userJobs/register') && method === 'POST':
                    return register();
                case url.endsWith('/userJobs') && method === 'GET':
                    return getUsers();
                case url.match(/\/usersJobs\/\d+$/) && method === 'GET':
                    return getClientById();
                // case url.match(/\/usersJobs\/\d+$/) && method === 'PUT':
                //     return updateUser();
                default:
                    // pass through any requests not handled above
                    return next.handle(request);
            }    
        }

        // route functions

        function register() {
            const client = body

            if (clients.find(x => x.username === client.username)) {
                return error('Username "' + client.username + '" is already taken')
            }

            client.id = clients.length ? Math.max(...clients.map(x => x.id)) + 1 : 1;
            clients.push(client);
            localStorage.setItem(usersKey, JSON.stringify(clients));
            return ok();
        }

        function getUsers() {
            if (!isLoggedIn()) return unauthorized();
            return ok(clients.map(x => basicDetails(x)));
        }

        function getClientById() {
            if (!isLoggedIn()) return unauthorized();

            const client = clients.find(x => x.id === idFromUrl());
            return ok(basicDetails(client));
        }

        function updateJobs() {
            if (!isLoggedIn()) return unauthorized();

            let params = body;
            let client = clients.find(x => x.id === idFromUrl());

            // only update password if entered
            if (!params.password) {
                delete params.password;
            }

            // update and save client
            Object.assign(client, params);
            localStorage.setItem(usersKey, JSON.stringify(clients));

            return ok();
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

        function basicDetails(client: any) {
            const { id, username, firstName, lastName } = client;
            return { id, username, firstName, lastName };
        }

        function isLoggedIn() {
            return headers.get('Authorization') === 'Bearer fake-jwt-token';
        }

        function idFromUrl() {
            const urlParts = url.split('/');
            return parseInt(urlParts[urlParts.length - 1]);
        }
    }
}

export const fakeClientBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeClientBackendInterceptor,
    multi: true
};