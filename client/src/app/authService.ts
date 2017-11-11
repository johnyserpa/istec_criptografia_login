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

    trySocket() {
        console.log("trying socket...")
        this.socket.emit("message", "login", (s) => {
            console.log("OI" + s)
        });
    }

    socketMessage() {
        return this.socket
            .fromEvent<any>("message");
    }

    socketHandshake() {
        return this.socket
            .fromEvent<any>("handshake");
    }

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