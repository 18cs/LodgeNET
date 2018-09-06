import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UnitsService } from '../_services/units.service';
import { Observable } from 'rxjs';
import { UnitParams } from '../_models/params/unitParams';
import { Unit } from '../_models/unit';

@Injectable()
export class UnitsResolverService {

constructor(private unitService: UnitsService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<Unit[]> | Promise<Unit[]> | Unit[] {
        return this.unitService.getUnits();
    }
}
