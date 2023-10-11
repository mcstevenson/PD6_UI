import { Component } from '@angular/core';

import { AccountService } from './_services';
import { User } from './_models';


// @ts-ignore
import * as usersData from '../staticData/userData.json';

const usersKey = 'listening-buddy-users';
let users: any[] = JSON.parse(localStorage.getItem(usersKey)!) || [];

@Component({ selector: 'app-root', templateUrl: 'app.component.html' })
export class AppComponent {
    user?: User | null;

    constructor(private accountService: AccountService) {
        this.accountService.user.subscribe(x => this.user = x);
        this.ngOnInit();
    }



  public ngOnInit(): void{
    usersData.default.forEach((user: { id: any; }) =>{
      if(! users.find(x => x.id === user.id as any )){
        users.push(user);
        localStorage.setItem(usersKey, JSON.stringify(users));
      }
    })
  }

    logout() {
        this.accountService.logout();
    }
}
