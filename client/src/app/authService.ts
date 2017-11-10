import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthService {

    url: string = 'http://localhost:3000';

    constructor(private http: Http) {}

    login(email: string, passwd: string) {
        console.log(this.url + "/login");
        return this.http.post(this.url + "/login", {
            email: email,
            passwd: passwd
        });
    }

    register (email: string, passwd) {
        return this.http.post(this.url + "/register", {
            email: email,
            passwd: passwd
        });
    }
}