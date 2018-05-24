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
    return this.http.post(this.baseUrl + 'file/DataRows', fileRows, {headers: new HttpHeaders()
        .set('Content-Type', 'application/json')});
}
}
