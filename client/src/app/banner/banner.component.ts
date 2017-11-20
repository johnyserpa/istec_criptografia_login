import { Component, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BannerComponent {

  @Input('messages') messages: {success: boolean, msg: string}[] = [];
  /*msgs: {success: boolean, msg: string}[] = [];
  @Input('messages') set messages(msg) {
    console.log(msg, this.msgs)
    if (!msg) return;

    if (msg.msg == 'clean'){
      this.msgs = [];
      return;
    }
    
    this.msgs.push(msg);
  } */

  constructor() { }

  @Output() onClear: EventEmitter<any> = new EventEmitter();
  
  clear() {
    console.log("clear")
    this.onClear.emit('clear');
  }


}
