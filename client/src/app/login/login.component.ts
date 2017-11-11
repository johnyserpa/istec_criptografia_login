import { Component, OnInit, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../authService';
import { Md5 } from 'ts-md5/dist/md5';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    Md5
  ]
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  buttonLabel = 'Signup';
  @Output() changeForm: EventEmitter<string> = new EventEmitter()
  
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.initializeForm();
    this.authService.socketMessage()
      .subscribe((message) => {
        console.log("Message received: " + message);
      })

    this.authService.socketHandshake()
      .subscribe((handshake) => {
        console.log("Handshake: " + handshake);
      })
  }

  onChangeForm() {
    this.changeForm.emit('signup');
  }

  initializeForm() {
    this.form = new FormGroup({
      email: new FormControl(null, Validators.required),
      passwd: new FormControl(null, Validators.required)
    });
  }

  onLogin() {
    const values = this.form.value;
    const hashedPasswd = this.hashPasswd(values.email, values.passwd);
    
    console.log(hashedPasswd);

    this.authService.login(
      values.email,
      hashedPasswd
    ).subscribe((res) => {
      const data = res.json().response;
      console.log(res.json());

      if (!res) return console.log("Login not successfull");
      console.log(data.passwd.length, data.salt.length)
    });
  }

  onSocketLogin() {
    this.authService.trySocket();
  }

  /**
   * Hash Password.
   * ---
   * Password should be hashed with 
   * user.email + passwd + domainName.
   * ---
   * For now, let's just use user.email + passwd
   */
  hashPasswd(email, passwd) {
    return Md5.hashStr(email + passwd).toString();
  }

}
