import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { environment } from '../../../environments/environment';
import { AlertifyService } from '../../_services/alertify.service';

@Component({
  selector: 'app-lodgingfileupload',
  templateUrl: './lodgingfileupload.component.html',
  styleUrls: ['./lodgingfileupload.component.css']
})
export class LodgingfileuploadComponent implements OnInit {
  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;

  constructor(private alertify: AlertifyService) { }

  ngOnInit() {
    this.initializeUploader();
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader() {
    console.log('yupyupyup');
    //this.uploader = new FileUploader({});
    this.uploader =  new FileUploader({
      url: this.baseUrl + 'file/lodging',
      authToken: 'Bearer' + localStorage.getItem('token'),
      isHTML5: true,
      allowedFileType: ['pdf'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    }); //maxFileSize = 10MB

    this.uploader.onWhenAddingFileFailed = () => {
      this.alertify.warning('Please select a PDF file');
    };

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      this.alertify.success('Upload Successful');
    };

    this.uploader.onErrorItem = (item, response, status, headers) => {
      this.alertify.error('Error occured');
    };
  }

}
