import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';

@Injectable()
export class LoggedinGuard implements CanActivate {

  constructor(private authService: AuthService,
              private router: Router,
              private alertify: AlertifyService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    //  const customRedirect = next.data['authGuardRedirect'];

      if (!this.authService.loggedIn()) {
        return true;
    }

   // const redirect = !!customRedirect ? customRedirect : '/';
    this.alertify.message('Currently Signed in');
    this.router.navigate(['/']);
    // this.router.navigate(['/', {outlets: {fullPage: [redirect]}]);
    return false;
  }
}
