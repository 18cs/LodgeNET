import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs/Observable";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { BuildingTable } from "../_models/buildingTable";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Router } from "@angular/router";
import { Building } from "../_models/building";
import { BuildingType } from "../_models/buildingType";
import { PaginatedResult } from "../_models/pagination";
import { BuildingCategory } from "../_models/buildingCategory";
import { BuildingParams } from "../_models/params/buildingParams";

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
    return this.http
      .get<BuildingTable>(this.baseUrl + "building/dashboard")
      .catch(this.handleError);
  }

  getBuildings(
    page?,
    itemsPerPage?,
    userParams?: BuildingParams
  ): Observable<PaginatedResult<Building[]>> {
    const paginatedResult: PaginatedResult<Building[]> = new PaginatedResult<
      Building[]
    >();
    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append("pageNumber", page);
      params = params.append("pageSize", itemsPerPage);
    }

    if (userParams != null) {
      if (userParams.buildingCategoryId != null) {
        params = params.append(
          "buildingCategoryId",
          userParams.buildingCategoryId.toString()
        );
      }
    }

    return this.http
      .get<Building[]>(this.baseUrl + "building", {
        observe: "response",
        params
      })
      .map(response => {
        paginatedResult.result = response.body;
        if (response.headers.get("Pagination") != null) {
          paginatedResult.pagination = JSON.parse(
            response.headers.get("Pagination")
          );
        }
        console.log(paginatedResult.pagination);
        return paginatedResult;
      })
      .catch(this.handleError);
  }

  getBuildingTypes(
    page?,
    itemsPerPage?
  ): Observable<PaginatedResult<BuildingType[]>> {
    const paginatedResult: PaginatedResult<
      BuildingType[]
    > = new PaginatedResult<BuildingType[]>();
    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append("pageNumber", page);
      params = params.append("pageSize", itemsPerPage);
    }

    return this.http
      .get<BuildingType[]>(this.baseUrl + "building/buildingtypes", {
        observe: "response",
        params
      })
      .map(response => {
        paginatedResult.result = response.body;
        if (response.headers.get("Pagination") != null) {
          paginatedResult.pagination = JSON.parse(
            response.headers.get("Pagination")
          );
        }
        console.log(paginatedResult.pagination);
        return paginatedResult;
      })
      .catch(this.handleError);
  }

  getAllBuildingTypes() {
    return this.http
      .get<BuildingCategory[]>(this.baseUrl + "building/allbuildingtypes")
      .catch(this.handleError);
  }

  getAllBuildings() {
    return this.http
      .get<Building[]>(this.baseUrl + "building/allbuildings")
      .catch(this.handleError);
  }

  saveBuildingEdit(model: Building) {
    console.log(model);

    return this.http
      .post(this.baseUrl + "building/edit", model, {
        headers: new HttpHeaders().set("Content-Type", "application/json")
      })
      .catch(this.handleError);
  }

  addBuilding(model: Building) {
    console.log(model);

    return this.http
      .post(this.baseUrl + "building/add", model, {
        headers: new HttpHeaders().set("Content-Type", "application/json")
      })
      .catch(this.handleError);
  }

  saveBuildingTypeEdit(model: BuildingType) {
    console.log(model);

    return this.http
      .post(this.baseUrl + "building/edittype", model, {
        headers: new HttpHeaders().set("Content-Type", "application/json")
      })
      .catch(this.handleError);
  }

  addBuildingType(model: BuildingType) {
    console.log(model);

    return this.http
      .post(this.baseUrl + "building/addtype", model, {
        headers: new HttpHeaders().set("Content-Type", "application/json")
      })
      .catch(this.handleError);
  }

  deleteBuildingById(buildingId: number) {
    return this.http
      .delete(this.baseUrl + "building" + "/" + buildingId)
      .catch(this.handleError);
    // {headers: new HttpHeaders().set('Content-Type', 'application/json')}
  }

  deleteBuildingTypeById(buildingTypeId: number) {
    return this.http
      .delete(this.baseUrl + "building/buildingtype/" + buildingTypeId)
      .catch(this.handleError);
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
    const applicationError = error.headers.get("Application-Error");
    if (applicationError) {
      return Observable.throw(applicationError);
    }
    const serverError = error["error"];
    let modelStateErrors = "";
    if (serverError) {
      for (const key in serverError) {
        if (serverError[key]) {
          modelStateErrors += serverError[key] + "\n";
        }
      }
    }
    return Observable.throw(modelStateErrors || "Server Error");
  }
}
