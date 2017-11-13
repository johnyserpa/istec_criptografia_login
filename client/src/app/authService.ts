import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthService {

    url: string = 'http://localhost:3000';

    constructor(private http: Http) {}

    login(email: string, passwd: string) {
        console.log("Login authservice..");
        
        return this.http.post(this.url + "/login", {
            email: email,
            passwd: passwd
        });

    }

    signup(email: string, passwd: string) {
        return this.http.post(this.url + "/signup", {
            email: email,
            passwd: passwd
        });
    }
}