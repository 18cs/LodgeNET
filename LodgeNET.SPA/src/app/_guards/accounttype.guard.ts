import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';

@Injectable()
export class AccountTypeGuard implements CanActivate {

  constructor(private authService: AuthService,
              private router: Router,
              private alertify: AlertifyService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      const customRedirect = next.data['accountTypeGuardRedirect'];

      if (this.authService.accountType !== next.data['unauthorizedAccountType']) {
        return true;
    }

    const redirect = !!customRedirect ? customRedirect : '/';
    this.alertify.error('Unauthorized Access');
    this.router.navigate(['/', redirect]);
    // this.router.navigate(['/', {outlets: {fullPage: [redirect]}]);
    return false;
  }
}