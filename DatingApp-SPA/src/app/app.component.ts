import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/_service/auth.service';
import {JwtHelperService} from '@auth0/angular-jwt';
import { User } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
// when reload the web page
//check whether there are a token in local storage
export class AppComponent implements OnInit {
  jwtHelper = new JwtHelperService();
  constructor(private authService: AuthService){}
  ngOnInit() {
    const token = localStorage.getItem('token');
    //we store user in local storage as a string so we need to change it to a object
    const user: User = JSON.parse(localStorage.getItem('user'));

    if (token) {
      this.authService.decodedToken = this.jwtHelper.decodeToken(token);
    }
    if (user) {
      this.authService.currentUser = user;
      this.authService.changeMemberPhoto(user.photoUrl);
    }
  }
}
