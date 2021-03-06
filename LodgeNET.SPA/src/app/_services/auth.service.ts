import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { FormData } from '../_models/formData';
import { AuthUser } from '../_models/authUser';
import { Router } from '@angular/router';
import { PaginatedResult } from '../_models/pagination';
import { User } from '../_models/user';
import { UserParams } from '../_models/params/userParams';
import { AccountType } from '../_models/accountType';
import { UserDisplay } from '../_models/display/userDisplay';

@Injectable()
export class AuthService {
    baseUrl = environment.apiUrl;
    userToken: any;
    decodedToken: any;
    currentUser: any;
    accountType: string;
    pendingAcctCount: number;

    constructor(private http: HttpClient, private jwtHelperService: JwtHelperService, private router: Router) { }

    login(model: any) {
        return this.http.post<AuthUser>(this.baseUrl + 'auth/login', model, {
            headers: new HttpHeaders()
                .set('Content-Type', 'application/json')
        }).pipe(map(auth => {
            if (auth) {
                localStorage.setItem('token', auth.tokenString);
                this.decodedToken = this.jwtHelperService.decodeToken(auth.tokenString);
                this.currentUser = this.decodedToken.unique_name;
                this.accountType = this.decodedToken.role;

                if(this.accountType === 'Admin') {
                    this.GetPendingAcctCount();
                }
            }
        }));
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
        });
    }

    loggedIn() {
        const token = this.jwtHelperService.tokenGetter();
        if (!token) {
            return false;
        }
        return !this.jwtHelperService.isTokenExpired(token);
    }

    formData() {
        return this.http.get<FormData>(this.baseUrl + 'auth/register');
    }

    GetPendingAcctCount() {
        return this.http.get<Number>(this.baseUrl + 'user/pendingAcctCount')
            .pipe(map((count: number) => {
                this.pendingAcctCount = count;
            }));
    }

    GetUsersPagination(page?, itemsPerPage?, userParams?: UserParams): Observable<PaginatedResult<User[]>> {
        const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();
        let params = new HttpParams();

        if (userParams != null) {
            params = this.processUserUserParams(userParams);
        }

        if (page != null && itemsPerPage != null) {
            params = params.append('pageNumber', page);
            params = params.append('pageSize', itemsPerPage);
        }

        return this.http.
            get<User[]>(this.baseUrl + 'user/getuserspagination', { observe: 'response', params })
            .pipe(map((response) => {
                paginatedResult.result = response.body;

                if (response.headers.get('Pagination') != null) {
                    paginatedResult.pagination = JSON.parse(
                        response.headers.get('Pagination'));
                }
                return paginatedResult;
            }));
    }

    getUsersDisplay(userParams?: UserParams): Observable<UserDisplay[]> {
        let params = new HttpParams();
        if (userParams != null) {
            params = this.processUserUserParams(userParams);
        }
        return this.http.get<UserDisplay[]>(this.baseUrl + 'user/getusersdisplay', { params });
    }

    private processUserUserParams(userParams: UserParams): HttpParams {
        let params = new HttpParams();

        if (userParams.accountTypeId != null) {
            params = params.append('accountTypeId', userParams.accountTypeId.toString());
        }

        if (userParams.userName != null) {
            params = params.append('userName', userParams.userName);
        }

        if (userParams.approved != null) {
            params = params.append('approved', userParams.approved.toString());
        }
        return params;
    }

    getAccountTypes() {
        return this.http.get<AccountType[]>(this.baseUrl + 'auth/accountTypes');
    }

    updateUser(model: any) {
        return this.http.post(this.baseUrl + 'user/update', model, {
            headers: new HttpHeaders()
                .set('Content-Type', 'application/json')
        });
    }

    deleteUser(id: number) {
        return this.http.delete(this.baseUrl + 'user/' + id);
    }
}
