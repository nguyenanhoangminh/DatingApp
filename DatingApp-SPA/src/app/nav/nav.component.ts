import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/_service/auth.service';
import { AlertifyService } from 'src/app/_service/alertify.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};
  photoUrl: string;

  constructor(public authServices: AuthService, private alertify: AlertifyService,
     private router: Router) { }

  ngOnInit() {
    this.authServices.currentPhotoUrl.subscribe(photoUrl => this.photoUrl = photoUrl);
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
    localStorage.removeItem('user');
    this.authServices.currentUser = null;
    this.authServices.decodedToken = null;
    this.alertify.message('loggged out');
    this.router.navigate(['/home']);
  }
}
