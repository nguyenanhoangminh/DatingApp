import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject} from 'rxjs';
import {map} from 'rxjs/operators';
import {JwtHelperService} from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //shortcut url
  baseUrl = environment.apiUrl + 'auth/';
  jwtHelper = new JwtHelperService();
  decodedToken: any;
  currentUser: User;
  photoUrl = new BehaviorSubject<string>('../../assets/original.png');
  currentPhotoUrl = this.photoUrl.asObservable();


  constructor(private http: HttpClient) { }


  changeMemberPhoto(photoUrl: string) {
    // pass the string of photoUrl it will update a new photo
    this.photoUrl.next(photoUrl);
  }
  register(model: any) {
     return this.http.post(this.baseUrl + 'register', model);
  }

  login(model: any) {
    return this.http.post(this.baseUrl + 'login', model)// return a token
    .pipe(
      map((response: any) => {
        const user = response;
        if (user) { // if response not null
          localStorage.setItem('token', user.token); // store the value of the token
          localStorage.setItem('user', JSON.stringify(user.user)); // store the value of the user
          this.decodedToken = this.jwtHelper.decodeToken(user.token);
          this.currentUser = user.user;
          this.changeMemberPhoto(this.currentUser.photoUrl);
        }
      })
    );
  }

  loggedIn() {  
    // get the token we store in localStorage earlier
    const token = localStorage.getItem('token');
    // return true if token is not expired
    return !this.jwtHelper.isTokenExpired(token);
  }
}
