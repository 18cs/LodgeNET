import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { environment } from '../../../environments/environment';
import { AlertifyService } from '../../_services/alertify.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-fileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.css']
})
export class FileuploadComponent implements OnInit {
  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;
  type: string;

  constructor(private alertify: AlertifyService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.type = this.route.snapshot.params['type'];
    this.route.params
      .subscribe((params: Params) => {
        this.type = params['type'];
      });

    this.initializeUploader();
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader() {
    if (this.type === 'unaccompanied') {
      this.uploader =  new FileUploader({
        url: this.baseUrl + 'file/unaccompanied',
        authToken: 'Bearer ' + localStorage.getItem('token'),
        isHTML5: true,
        allowedFileType: ['xls'],
        removeAfterUpload: true,
        autoUpload: false,
        maxFileSize: 10 * 1024 * 1024
      }); // maxFileSize = 10MB
  
      this.uploader.onWhenAddingFileFailed = () => {
        this.alertify.warning('Please select a PDF file');
      };
    }
    else {
      this.uploader =  new FileUploader({
        url: this.baseUrl + 'file/lodging',
        authToken: 'Bearer ' + localStorage.getItem('token'),
        isHTML5: true,
        allowedFileType: ['pdf'],
        removeAfterUpload: true,
        autoUpload: false,
        maxFileSize: 10 * 1024 * 1024
      }); // maxFileSize = 10MB
  
      this.uploader.onWhenAddingFileFailed = () => {
        this.alertify.warning('Please select a PDF file');
      };
    }
    
    this.uploader.onSuccessItem = (item, response, status, headers) => {
      this.alertify.success('Upload Successful');
    };

    this.uploader.onErrorItem = (item, response, status, headers) => {
      this.alertify.error('Error occured');
    };
  }

}
