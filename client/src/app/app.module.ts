import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';


import { AppComponent } from './app.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthService } from './authService';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { SocketIoModule, SocketIoConfig, Socket } from 'ngx-socket-io';
import { BannerComponent } from './banner/banner.component';

const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    BannerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    SocketIoModule.forRoot(config) 
  ],
  providers: [
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
