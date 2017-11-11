import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  form: string = 'login';

  constructor() {}

  ngOnInit() {
  }

  toggleForms(event: string) {
    this.form = event;
  } 

}
