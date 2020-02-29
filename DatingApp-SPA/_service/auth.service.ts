import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map} from 'rxjs/operators';
import {JwtHelperService} from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService { 
  baseUrl = 'http://localhost:5000/api/auth/';
  jwtHelper = new JwtHelperService();
  decodedToken: any;
constructor(private http: HttpClient) { }
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
          this.decodedToken = this.jwtHelper.decodeToken(user.token);
          console.log(this.decodedToken);

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
