import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UnitsService } from '../_services/units.service';
import { Observable } from 'rxjs/Observable';
import { Service } from '../_models/Service';

@Injectable()
export class ServicesResolverService {

constructor(private unitService: UnitsService) { }

resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<Service[]> | Promise<Service[]> | Service[] {
        return this.unitService.getServices();
    }

}
