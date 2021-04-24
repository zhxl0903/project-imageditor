// refrence from http://jasonwatmore.com/post/2018/10/29/angular-7-user-registration-and-login-example-tutorial#index-html
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../_models';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }


    getById(id: number) {
        return this.http.get(`/users/` + id);
    }

    register(user: User) {
        return this.http.post(`/users/register`, user);
    }

    update(user: User) {
        return this.http.put(`/users/` + user.id, user);
    }
}
