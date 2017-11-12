import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthService {

    url: string = 'http://localhost:3000';

    constructor(private http: Http,
                private socket: Socket) {}

    socketHandshake() {
        return this.socket
            .fromEvent<any>("handshake");
    }

    socketLoginMessages() {
        return this.socket
            .fromEvent<any>('login');
    }

    login(email: string, passwd: string) {
        console.log("Login authservice..");
        
        this.socket.emit('login', {
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