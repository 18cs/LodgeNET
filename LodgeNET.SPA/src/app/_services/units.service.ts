import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Unit } from '../_models/unit';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { UnitParams } from '../_models/params/unitParams';
import { PaginatedResult } from '../_models/pagination';
import { Service } from '../_models/service';
import { UnitDisplay } from '../_models/display/unitDisplay';

@Injectable()
export class UnitsService {

    constructor(private http: HttpClient) { }
    baseUrl = environment.apiUrl;

    getUnitsPagination(page?, itemsPerPage?, userParams?: UnitParams) {
        const paginatedResult: PaginatedResult<Unit[]> = new PaginatedResult<Unit[]>();
        let params = new HttpParams();

        if (userParams != null) {
            params = this.processUnitUserParams(userParams);
        }

        if (page != null && itemsPerPage != null) {
            params = params.append('pageNumber', page);
            params = params.append('pageSize', itemsPerPage);
        }

        return this.http.get<Unit[]>(this.baseUrl + 'unit/getunitpagination', { observe: 'response', params })
            .pipe(map((response) => {
                paginatedResult.result = response.body;

                if (response.headers.get('Pagination') != null) {
                    paginatedResult.pagination = JSON.parse(
                        response.headers.get('Pagination'));
                }
                return paginatedResult;
            }));
    }

    getUnits(userParams?: UnitParams): Observable<Unit[]> {
        let params = new HttpParams();
        if (userParams != null) {
            params = this.processUnitUserParams(userParams);
        }
        return this.http.get<Unit[]>(this.baseUrl + 'unit/getunits', { params });
    }

    getUnitsDisplay(userParams?: UnitParams) {
        let params = new HttpParams();
        if (userParams != null) {
            params = this.processUnitUserParams(userParams);
        }

        return this.http.get<UnitDisplay[]>(this.baseUrl + 'unit/getunitsdisplay', { params });
    }

    private processUnitUserParams(userParams: UnitParams): HttpParams {
        let params = new HttpParams();
        if (userParams.unitId != null) {
            params = params.append('unitId', userParams.unitId.toString());
        }

        if (userParams.parentUnitId) {
            params = params.append('parentUnitId', userParams.parentUnitId.toString());
        }

        if (userParams.includeParentUnit) {
            params = params.append('includeParentUnit', userParams.includeParentUnit.toString());
        }

        if (userParams.unitName != null) {
            params = params.append('unitName', userParams.unitName);
        }

        if (userParams.unitAbbreviation != null) {
            params = params.append('unitAbbreviation', userParams.unitAbbreviation);
        }
        return params;
    }

    getServices() {
        return this.http.get<Service[]>(this.baseUrl + 'unit/service');
    }

    addUnit(model: Unit) {
        return this.http
          .post(this.baseUrl + 'unit/add', model, {
            headers: new HttpHeaders().set('Content-Type', 'application/json')
          });
      }

    updateUnit(model: any) {
        return this.http.post(this.baseUrl + 'unit/update', model, {
            headers: new HttpHeaders()
                .set('Content-Type', 'application/json')
        });
    }

    deleteUnit(id: number) {
        return this.http.delete(this.baseUrl + 'unit/deleteunit/' + id);
    }
}
