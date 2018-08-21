import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Building } from '../_models/building';
import { BuildingService } from '../_services/building.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class BuildingsResolverService {

constructor(private buildingService: BuildingService) { }

resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<Building[]> | Promise<Building[]> | Building[] {
        return this.buildingService.getBuildings();
    }

}
