import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UnitsService } from '../_services/units.service';
import { Observable } from 'rxjs/Observable';
import { UnitParams } from '../_models/params/unitParams';

@Injectable()
export class UnitsResolverService {

constructor(private unitService: UnitsService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<FormData> | Promise<FormData> | FormData {
        return this.unitService.getUnits();
    }
}
