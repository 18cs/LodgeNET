import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { Observable } from 'rxjs';
import { FormData } from '../_models/formData';

@Injectable()
export class FormdataResolver implements Resolve<FormData> {

constructor(private authService: AuthService) { }

resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<FormData> | Promise<FormData> | FormData {
        return this.authService.formData();
}

}
