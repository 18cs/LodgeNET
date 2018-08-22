import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { FileRow } from '../_models/fileRow';
import { environment } from '../../environments/environment';
import { Upload } from '../_models/upload';
import { PaginatedResult } from '../_models/pagination';
import { UploadParams } from '../_models/params/uploadParams';

@Injectable()
export class FileuploadService {
    baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    uploadUnaccomData(fileRows: FileRow[], userParams?: UploadParams) {
        let params = new HttpParams();

        if (userParams != null)
            params = params.append('uploadId', userParams.uploadId.toString());

        return this.http.post(this.baseUrl + 'file/DataRows', fileRows, {headers: new HttpHeaders()
            .set('Content-Type', 'application/json'), params: params});
    }

    getUploadsPagination(page?, itemsPerPage?, userParams?: UploadParams) {
        const paginatedResult: PaginatedResult<Upload[]> = new PaginatedResult<Upload[]>();
        let params = new HttpParams();

        if (page != null && itemsPerPage != null) {
            params = params.append('pageNumber', page);
            params = params.append('pageSize', itemsPerPage);
        }

        if (userParams != null) {
            if (userParams.dateUploaded != null) {
                params = params.append('dateUploaded', userParams.dateUploaded.toString());
            }

            if (userParams.fileName != null) {
                params = params.append('fileName', userParams.fileName);
            }

            if (userParams.userId != null) {
                params = params.append('userId', userParams.userId.toString());
            }
        }

        return this.http.get<Upload[]>(this.baseUrl + 'file/getuploadspagination', { observe: 'response', params })
            .map((response) => {
                paginatedResult.result = response.body;

                if (response.headers.get('Pagination') != null) {
                    paginatedResult.pagination = JSON.parse(
                        response.headers.get('Pagination'));
                }
                return paginatedResult;
            });
    }

    deleteUpload(uploadId: number) {
        return this.http
          .delete(this.baseUrl + 'file/upload' + '/' + uploadId);
      }
}
