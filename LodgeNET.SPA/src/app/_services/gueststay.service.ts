import { Injectable } from '@angular/core';
import { PaginatedResult } from '../_models/pagination';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { Room } from '../_models/room';

@Injectable()
export class GueststayService {
    baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getAvaliableRooms(page?, itemsPerPage?, buildingId?, onlyAvailableRooms?): Observable< PaginatedResult<Room[]>> {
        const paginatedResult: PaginatedResult<Room[]> = new PaginatedResult<Room[]>();
        let params = new HttpParams();

        if (page != null && itemsPerPage != null) {
            params = params.append('pageNumber', page);
            params = params.append('pageSize', itemsPerPage);
        }

        if (buildingId != null) {
            params = params.append('buildingId', buildingId);
        }

        if (onlyAvailableRooms != null) {
            params = params.append('onlyAvailableRooms', onlyAvailableRooms);
        }

        return this.http.
            get<Room[]>(this.baseUrl + 'gueststay/availableRooms', { observe: 'response', params })
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

    private handleError(error: any) {
        const applicationError = error.headers.get('Application-Error');
        if (applicationError) {
            return Observable.throw(applicationError);
        }
        const serverError = error['error'];
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