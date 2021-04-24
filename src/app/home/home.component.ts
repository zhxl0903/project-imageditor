import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

import { User } from '../_models';
import { UserService, AuthenticationService } from '../_services';
import { Router } from '@angular/router';

@Component({ templateUrl: 'home.component.html',
styleUrls: ['./home.component.css'] })
export class HomeComponent implements OnInit{
    currentUser: User;
    currentUserSubscription: Subscription;
    users: User[] = [];

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private userService: UserService
    ) {
        this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
            this.currentUser = user;
        });
    }

    ngOnInit(){

    }
    on2DModel(){
        this.router.navigate(['/engine2d']);
    }

    on3DModel(){
        this.router.navigate(['/engine3d']);
    }

    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }
}