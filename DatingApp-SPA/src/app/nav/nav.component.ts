import { Component, OnInit } from '@angular/core';
import { AuthService } from '_service/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};

  constructor(private authServices: AuthService) { }

  ngOnInit() {
  }
  login() {
    // login method return an observable
    // subcribe it if it next login success
    // if it error login fail
    this.authServices.login(this.model).subscribe(next => {
      console.log('logged in successfully');
    }, error =>{
      console.log(error);
    });
  }
  // loggedIn function to check whether the users are login or not
  loggedIn() {
    // get the token we store in localStorage earlier
    const token = localStorage.getItem('token');
    // return true if token is not null
    return !!token;
  }
  // logout function to clear the token
  logout() {
    // clear the token we store in localStorage earlier
    localStorage.removeItem('token');
    console.log('loggged out');
  }
}
