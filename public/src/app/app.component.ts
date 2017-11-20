import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  form: string = 'login';
  messages: {success: boolean, msg: string}[] = [];
  connected = 'lock_open';
  token: string = "";

  constructor() {}

  ngOnInit() {
  }

  toggleForms(event: string) {
    this.form = event;
  } 

  onNewMessage(event: {success: boolean, msg: string, token?:string, response?: any}) {
    this.messages.push(event);
    if (event.token) this.token = event.token;
  }

  getMessages() {
    return this.messages;
  }

  clearMessages(event) {
    console.log(event);
    this.messages = [];
    this.token = "";
  }



}
