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
  @Output() changeForm: EventEmitter<string> = new EventEmitter();
  @Output() newMessage: EventEmitter<any> = new EventEmitter();
  @Output() connected: EventEmitter<any> = new EventEmitter();
  
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.initializeForm();

    this.authService.socketHandshake()
      .subscribe((handshake) => {
        this.connected.emit('lock')
        console.log("Handshake: " + handshake);
      })

    this.authService.socketLoginMessages()
      .subscribe((msg) => {
        if (!msg.success) return this.newMessage.emit(msg);;
        this.newMessage.emit(msg);
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

  async onLogin() {
    // Get values easier.
    const values = this.form.value;

    // Alert for preparing to hash.
    this.newMessage.emit({success: true, msg: "Preparing to hash password Md5(" + values.email + " + " + values.passwd + ")..."});

    // Hash async passwd.
    const hashedPasswd = await this.hashPasswd(values.email, values.passwd);
    // Alert hashed passwd.
    this.newMessage.emit({success: true, msg: 'Password hashed into ' + hashedPasswd + "..."});
    this.newMessage.emit({success: true, msg: 'Sending email and password to server...'});

    this.authService.login(values.email, hashedPasswd);

    this.form.reset();
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
