import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from 'src/app/_service/auth.service';
import { AlertifyService } from 'src/app/_service/alertify.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private alertify: AlertifyService
   ) {}
  // return boolean
  // if user are not loggedIn, don't let them pass
  canActivate(): boolean {
  if (this.authService.loggedIn()) {
    return true;
  }
  this.alertify.error('You shall not pass!!!');
  this.router.navigate(['/home']);
  return false;
  }
}
