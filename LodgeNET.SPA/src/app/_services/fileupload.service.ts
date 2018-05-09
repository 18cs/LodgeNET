import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { FileRow } from '../_models/fileRow';
import { environment } from '../../environments/environment';

@Injectable()
export class FileuploadService {
    baseUrl = environment.apiUrl;

constructor(private http: HttpClient) { }


uploadUnaccomData(fileRows: FileRow[]) {
    console.log(fileRows);
    return this.http.post(this.baseUrl + 'file/DataRows', fileRows, {headers: new HttpHeaders()
        .set('Content-Type', 'application/json')}).catch(this.handleError);
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
