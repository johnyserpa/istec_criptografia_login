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
  @Output() newMessage: EventEmitter<any> = new EventEmitter();
  
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
    this.form.reset();  

    if (values.passwd !== values.passwd2) {
      this.newMessage.emit({
        success: false,
        msg: 'Passwords don\'t match!'
      });
      return false;
    }

    this.newMessage.emit({success: true, msg: "Preparing to hash password Md5(" + values.email + " + " + values.passwd + ")..."});
    
    this.hashPasswd(values.email, values.passwd)
      .then((hashedPasswd: string) => {
        // Alert hashed passwd.
        this.newMessage.emit({success: true, msg: 'Password hashed into ' + hashedPasswd + "..."});
        this.newMessage.emit({success: true, msg: 'Sending email and password to server...'});

        this.authService.signup(
          values.email,
          hashedPasswd
        ).subscribe((res) => {
            res = res.json();
            this.newMessage.emit(res);
          console.log(res);
        });
      })

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
    return new Promise( (resolve, reject) => {
      setTimeout( () => {
        resolve(Md5.hashStr(email + passwd).toString());
      }, 1500);
    });
  }

}
