import { Component, OnInit } from '@angular/core';
import { AuthService } from '_service/auth.service';
import { AlertifyService } from '_service/alertify.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};

  constructor(public authServices: AuthService, private alertify: AlertifyService,
     private router: Router) { }

  ngOnInit() {
  }
  login() {
    // login method return an observable
    // subcribe it if it next login success
    // if it error login fail
    this.authServices.login(this.model).subscribe(next => {
      this.alertify.success('logged in successfully');
    }, error =>{
      this.alertify.error(error);
    }, () => {
      this.router.navigate(['/members'])
    });
  }
  // loggedIn function to check whether the users are login or not
  loggedIn() {
    return this.authServices.loggedIn();
  }
  // logout function to clear the token
  logout() {
    // clear the token we store in localStorage earlier
    localStorage.removeItem('token');
    this.alertify.message('loggged out');
    this.router.navigate(['/home']);
  }
}
