import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BuildingTable } from '../_models/buildingTable';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { Building } from '../_models/building';
import { BuildingType } from '../_models/buildingType';
import { PaginatedResult } from '../_models/pagination';
import { BuildingCategory } from '../_models/buildingCategory';
import { BuildingParams } from '../_models/params/buildingParams';
import { BuildingDisplay } from '../_models/display/buildingDisplay';
import { BuildingTypeDisplay } from '../_models/display/buildingTypeDisplay';

@Injectable()
export class BuildingService {
  baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private jwtHelperService: JwtHelperService,
    private router: Router
  ) { }

  buildingDashboardData() {
    return this.http.get<BuildingTable>(this.baseUrl + 'building/dashboard');
  }

  getBuildings(userParams?: BuildingParams): Observable<Building[]> {
    let params;
    if (userParams != null) {
      params = this.processBuildingParams(params);
    }

    return this.http.get<Building[]>(this.baseUrl + 'building/getbuildings', { params });
  }

  getBuildingsPagination(
    page?,
    itemsPerPage?,
    userParams?: BuildingParams
  ): Observable<PaginatedResult<Building[]>> {
    const paginatedResult: PaginatedResult<Building[]> = new PaginatedResult<Building[]>();
    let params = new HttpParams();

    if (userParams != null) {
      params = this.processBuildingParams(userParams);
    }

    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }

    return this.http
      .get<Building[]>(this.baseUrl + 'building/getbuildingspagination', {
        observe: 'response',
        params
      })
      .map(response => {
        paginatedResult.result = response.body;
        if (response.headers.get('Pagination') != null) {
          paginatedResult.pagination = JSON.parse(
            response.headers.get('Pagination')
          );
        }
        return paginatedResult;
      });
  }

  getBuildingsDisplay(userParams: BuildingParams): Observable<BuildingDisplay[]> {
    let params;
    if (userParams != null) {
      params = this.processBuildingParams(userParams);
    }
    return this.http.get<BuildingDisplay[]>(this.baseUrl + 'building/getbuildingdisplay', { params });
  }

  private processBuildingParams(userParams: BuildingParams): HttpParams {
    let params = new HttpParams();
    if (userParams.buildingCategoryId != null) {
      params = params.append('buildingCategoryId', userParams.buildingCategoryId.toString()
      );
    }
    return params;
  }

  getBuildingTypesPagination(
    page?,
    itemsPerPage?
  ): Observable<PaginatedResult<BuildingType[]>> {
    const paginatedResult: PaginatedResult<BuildingType[]> = new PaginatedResult<BuildingType[]>();
    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }

    return this.http
      .get<BuildingType[]>(this.baseUrl + 'building/getbuildingtypespagination', {
        observe: 'response',
        params
      })
      .map(response => {
        paginatedResult.result = response.body;
        if (response.headers.get('Pagination') != null) {
          paginatedResult.pagination = JSON.parse(
            response.headers.get('Pagination')
          );
        }
        return paginatedResult;
      });
  }

  getBuildingTypes() {
    return this.http
      .get<BuildingCategory[]>(this.baseUrl + 'building/getbuildingtypes');
  }

  getBuildingTypesDisplay() {
    return this.http
      .get<BuildingTypeDisplay[]>(this.baseUrl + 'building/getbuildingtypesdisplay');
  }

  saveBuildingEdit(model: Building) {
    return this.http
      .post(this.baseUrl + 'building/edit', model, {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
      });
  }

  addBuilding(model: Building) {
    return this.http
      .post(this.baseUrl + 'building/add', model, {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
      });
  }

  saveBuildingTypeEdit(model: BuildingType) {
    return this.http
      .post(this.baseUrl + 'building/edittype', model, {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
      });
  }

  addBuildingType(model: BuildingType) {
    return this.http
      .post(this.baseUrl + 'building/addtype', model, {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
      });
  }

  deleteBuildingById(buildingId: number) {
    return this.http
      .delete(this.baseUrl + 'building' + '/' + buildingId);
  }

  deleteBuildingTypeById(buildingTypeId: number) {
    return this.http
      .delete(this.baseUrl + 'building/buildingtype/' + buildingTypeId);
  }

  // private jwt(){
  //     let token = localStorage.getItem('token');
  //     if(token) {
  //         let headers = new Headers({'Authorization': 'Bearer ' + token});
  //         headers.append('Content-type', 'application/json');
  //         return new RequestOptions({headers: headers})
  //     }
  // }
}
