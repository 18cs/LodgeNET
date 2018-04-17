import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RegisterForm } from '../_models/registerForm';
import { AuthUser } from '../_models/authUser';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {
    baseUrl = environment.apiUrl;
    userToken: any;
    decodedToken: any;
    currentUser: any;
    accountType: string;

    constructor(private http: HttpClient, private jwtHelperService: JwtHelperService, private router: Router) {}

    login(model: any) {
      return this.http.post<AuthUser>(this.baseUrl + 'auth/login', model, {headers: new HttpHeaders()
        .set('Content-Type', 'application/json')}).map(auth => {
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
        const url = this.baseUrl + 'auth/register';
        console.log(model);
        return this.http.post(this.baseUrl + 'auth/register', model, {headers: new HttpHeaders()
            .set('Content-Type', 'application/json')}).catch(this.handleError);
    }

    loggedIn() {
        const token = this.jwtHelperService.tokenGetter();
        if (!token) {
            return false;
        }
        return !this.jwtHelperService.isTokenExpired(token);
    }

    registerFormData() {
        return this.http.get<RegisterForm>(this.baseUrl + 'auth/register')
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
