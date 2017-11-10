import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './authService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  type = 'login';
  buttonLabel = 'Registo';

  loginForm: FormGroup;
  registerForm: FormGroup;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.initializeLoginForm();
    this.initializeRegisterForm();
  }

  onToggleRegisterLogin() {
    this.type = this.type == 'register' ? 'login' : 'register';
    this.buttonLabel = this.buttonLabel == 'Registo' ? 'Login' : 'Registo';
  }

  initializeLoginForm() {
    this.loginForm = new FormGroup({
      lemail: new FormControl(null, Validators.required),
      lpasswd: new FormControl(null, Validators.required)
    });
  }

  initializeRegisterForm() {
    this.registerForm = new FormGroup({
      remail: new FormControl(null, Validators.required),
      rpasswd: new FormControl(null, Validators.required),
      rpasswd2: new FormControl(null, Validators.required)
    });
  }

  onLogin() {
    const values = this.loginForm.value;

    this.authService.login(
      values.lemail,
      values.lpasswd
    ).subscribe((res) => {
      const data = res.json().response;
      console.log(res.json());
      console.log(data.passwd.length, data.salt.length)
    });
  }

  onRegister() {
    const values = this.registerForm.value;

    if (values.rpasswd !== values.rpasswd2) {
      return false;
    }

    this.authService.register(
      values.remail,
      values.rpasswd
    ).subscribe((res) => {
      console.log(res);
    });
  }

}
