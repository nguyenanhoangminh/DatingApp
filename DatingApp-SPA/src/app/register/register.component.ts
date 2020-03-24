import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/_service/auth.service';
import { AlertifyService } from 'src/app/_service/alertify.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  model: any = {};
  @Output() cancelRegister = new EventEmitter();
  constructor(private authServices: AuthService, private alertify: AlertifyService) { }

  ngOnInit() {
  }
  register() {
    this.authServices.register(this.model).subscribe(() => {
       this.alertify.success('registration successful');
     }, error => {
       this.alertify.error(error);
     });
  }
  cancel() {
    this.cancelRegister.emit(false);
  }
}
