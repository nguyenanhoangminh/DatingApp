import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/_service/auth.service';
import { AlertifyService } from 'src/app/_service/alertify.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { User } from '../models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  user: User;
  @Output() cancelRegister = new EventEmitter();
  registerForm: FormGroup;
  bsConfig: Partial<BsDatepickerConfig>;
  constructor(private authServices: AuthService, private router: Router,private alertify: AlertifyService, private fb: FormBuilder) { }

  ngOnInit() {
    this.bsConfig = {
      containerClass: 'theme-red'
    };
    this.createRegisterForm();
  }

  createRegisterForm() {
    this.registerForm = this.fb.group({
      gender: ['male'],
      username: ['', Validators.required],
      knownAs:   ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', Validators.required]
    }, {validator: this.passwordMatchValidator});
  }
  passwordMatchValidator(g: FormGroup) {
    return g.get('password').value === g.get('confirmPassword').value ? null : {mismatch: true};
  }
  register() {
    if (this.registerForm.valid) {
      this.user = Object.assign({}, this.registerForm.value);
      this.authServices.register(this.user).subscribe(() => {
        this.alertify.success('registration successful');
      }, error => {
        this.alertify.error(error);
      }, () =>  {
        this.authServices.login(this.user).subscribe(() => {
          this.router.navigate(['/members']);
        });
      });
    }
  }
  cancel() {
    this.cancelRegister.emit(false);
  }
}
