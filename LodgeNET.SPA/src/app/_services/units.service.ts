import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { Unit } from '../_models/unit';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UnitsService {

constructor(private http: HttpClient) { }
baseUrl = environment.apiUrl;

getUnits() {
    return this.http.get<Unit[]>(this.baseUrl + 'unit')
        .catch(this.handleError);
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
