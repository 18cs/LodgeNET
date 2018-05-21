import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { Unit } from '../_models/unit';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { UnitParams } from '../_models/params/unitParams';
import { PaginatedResult } from '../_models/pagination';

@Injectable()
export class UnitsService {

    constructor(private http: HttpClient) { }
    baseUrl = environment.apiUrl;

    getUnitsPag(page?, itemsPerPage?, userParams?: UnitParams) {
        const paginatedResult: PaginatedResult<Unit[]> = new PaginatedResult<Unit[]>();
        let params = new HttpParams();

        if (page != null && itemsPerPage != null) {
            params = params.append('pageNumber', page);
            params = params.append('pageSize', itemsPerPage);
        }

        if (userParams != null) {
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
        }

        return this.http.get<Unit[]>(this.baseUrl + 'unit/pagination', { observe: 'response', params })
            .map((response) => {
                paginatedResult.result = response.body;

                if (response.headers.get('Pagination') != null) {
                    paginatedResult.pagination = JSON.parse(
                        response.headers.get('Pagination'));
                }
                return paginatedResult;
            })
            .catch(this.handleError);
    }

    getUnits() {
        return this.http.get<Unit[]>(this.baseUrl + 'unit').catch(this.handleError);
    }

    updateUnit(model: any) {
        return this.http.post(this.baseUrl + 'unit/update', model, {
            headers: new HttpHeaders()
                .set('Content-Type', 'application/json')
        }).catch(this.handleError);
    }

    deleteUnit(id: number) {
        return this.http.delete(this.baseUrl + 'unit/deleteunit/' + id).catch(this.handleError);
    }

    private handleError(error: any) {
        console.log(error);
        const applicationError = error.headers.get('Application-Error');
        if (applicationError) {
            console.log(applicationError);
            return Observable.throw(applicationError);
        }
        const serverError = error.json();
        console.log(serverError);
        let modelStateErrors = '';
        if (serverError) {
            for (const key in serverError) {
                if (serverError[key]) {
                    modelStateErrors += serverError[key] + '\n';
                }
            }
        }
        return Observable.throw(
            modelStateErrors || 'Server Error'
        );
    }

}
