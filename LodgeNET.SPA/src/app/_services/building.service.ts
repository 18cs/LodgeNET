import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BuildingTable } from '../_models/buildingTable';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { Building } from '../_models/building';

@Injectable()
export class BuildingService {
  baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private jwtHelperService: JwtHelperService,
    private router: Router
  ) {}

  // getBuildings(): Observable<Building[]>{
  //     return this.http.get(this.baseUrl + 'buildings/dashboard')
  // }

  buildingDashboardData() {
    return this.http.get<BuildingTable>(this.baseUrl + 'building/dashboard').catch(this.handleError);
  }

  saveBuildingEdit(model: Building) {
    console.log(model);

    return this.http.post(this.baseUrl + 'building/edit', model, {headers: new HttpHeaders()
      .set('Content-Type', 'application/json')}).catch(this.handleError);
  }

  deleteBuildingById(buildingId:  number) {
    return this.http.delete(this.baseUrl + 'building' + '/' + buildingId).catch(this.handleError);
    // {headers: new HttpHeaders().set('Content-Type', 'application/json')}
  }

  // private jwt(){
  //     let token = localStorage.getItem('token');
  //     if(token) {
  //         let headers = new Headers({'Authorization': 'Bearer ' + token});
  //         headers.append('Content-type', 'application/json');
  //         return new RequestOptions({headers: headers})
  //     }
  // }

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
    return Observable.throw(modelStateErrors || 'Server Error');
  }
}
