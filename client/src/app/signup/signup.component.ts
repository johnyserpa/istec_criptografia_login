import { Component, OnInit, ViewEncapsulation, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../authService';
import { Md5 } from 'ts-md5/dist/md5';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    Md5
  ]
})
export class SignupComponent implements OnInit {

  form: FormGroup;
  buttonLabel = 'Login';
  @Output() changeForm: EventEmitter<string> = new EventEmitter()
  
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.initializeForm();
  }

  onChangeForm() {
    this.changeForm.emit('login');
  }

  initializeForm() {
    this.form = new FormGroup({
      email: new FormControl(null, Validators.required),
      passwd: new FormControl(null, Validators.required),
      passwd2: new FormControl(null, Validators.required)
    });
  }

  onRegister() {
    const values = this.form.value;

    if (values.passwd !== values.passwd2) {
      return false;
    }

    const hashedPasswd = this.hashPasswd(values.email, values.passwd)

    this.authService.register(
      values.email,
      hashedPasswd
    ).subscribe((res) => {
      console.log(res);
    });
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
