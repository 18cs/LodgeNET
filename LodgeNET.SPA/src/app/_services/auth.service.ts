import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { FormData } from '../_models/formData';
import { AuthUser } from '../_models/authUser';
import { Router } from '@angular/router';
import { PaginatedResult } from '../_models/pagination';
import { User } from '../_models/user';

@Injectable()
export class AuthService {
    baseUrl = environment.apiUrl;
    userToken: any;
    decodedToken: any;
    currentUser: any;
    accountType: string;

    constructor(private http: HttpClient, private jwtHelperService: JwtHelperService, private router: Router) { }

    login(model: any) {
        return this.http.post<AuthUser>(this.baseUrl + 'auth/login', model, {
            headers: new HttpHeaders()
                .set('Content-Type', 'application/json')
        }).map(auth => {
            if (auth) {
                localStorage.setItem('token', auth.tokenString);
                this.decodedToken = this.jwtHelperService.decodeToken(auth.tokenString);
                this.currentUser = this.decodedToken.unique_name;
                this.accountType = this.decodedToken.role;
            }
        }).catch(this.handleError);
    }

    logout() {
        if (this.loggedIn()) {
            this.userToken = null;
            localStorage.removeItem('token');
            this.router.navigate(['/home']);
            return true;
        }
        return false;
    }

    register(model: any) {
        // const url = this.baseUrl + 'auth/register';
        return this.http.post(this.baseUrl + 'auth/register', model, {
            headers: new HttpHeaders()
                .set('Content-Type', 'application/json')
        }).catch(this.handleError);
    }

    loggedIn() {
        const token = this.jwtHelperService.tokenGetter();
        if (!token) {
            return false;
        }
        return !this.jwtHelperService.isTokenExpired(token);
    }

    formData() {
        return this.http.get<FormData>(this.baseUrl + 'auth/register')
            .catch(this.handleError);
    }

    GetPendingAcctCount() {
        return this.http.get<Number>(this.baseUrl + 'auth/pendingAcctCount')
            .catch(this.handleError);
    }

    GetUsers(page?, itemsPerPage?): Observable<PaginatedResult<User[]>> {
        const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();
        let params = new HttpParams();

        if (page != null && itemsPerPage != null) {
            params = params.append('pageNumber', page);
            params = params.append('pageSize', itemsPerPage);
        }

        return this.http.
            get<User[]>(this.baseUrl + 'auth/users', { observe: 'response', params })
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

    updateUser(model: any) {
        return this.http.post(this.baseUrl + 'auth/update', model, {
            headers: new HttpHeaders()
                .set('Content-Type', 'application/json')
        }).catch(this.handleError);
    }

    deleteUser(id: number) {
        return this.http.delete(this.baseUrl + 'auth/' + id).catch(this.handleError);
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
