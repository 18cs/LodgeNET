import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { environment } from '../../../environments/environment';
import { AlertifyService } from '../../_services/alertify.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FileRow } from '../../_models/fileRow';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { UnaccompanieddialogComponent } from './dialogcomponents/unaccompanieddialog/unaccompanieddialog.component';
import { UnitsService } from '../../_services/units.service';
import { Unit } from '../../_models/unit';
import { FileuploadService } from '../../_services/fileupload.service';
import { LodgingDialogComponent } from './dialogcomponents/lodgingDialog/lodgingDialog.component';
import { UploadParams } from '../../_models/params/uploadParams';
import { ExmanifestDialogComponent } from './dialogcomponents/exmanifestDialog/exmanifestDialog.component';

export const UPLOADTYPES = {
  unaccompanied: 'unaccompanied',
  lodging: 'lodging',
  exmanifest: 'exmanifest'
}

@Component({
  selector: 'app-fileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.css']
})
export class FileuploadComponent implements OnInit {
  fileRows: FileRow[]; // contains a sliced list of rows for pagination
  totalFileRows: FileRow[]; // contains the entire list of returned rows
  units: Unit[];
  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;
  type: string;
  currentPage: number;
  itemsPerPage = 10;
  showSpinner = false;
  userParams: UploadParams = {userId: 0, fileName: '', dateUploaded: null, uploadId: 0};

  uploadTypeData = {
    warningMessage: '',
    acceptedFileTypes: [],
    url: '',
    title: ''
  }

  constructor(
    private alertify: AlertifyService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private unitsService: UnitsService,
    private fileuploadService: FileuploadService
  ) { }

  ngOnInit() {
    this.type = this.route.snapshot.params['type'];
    this.totalFileRows = []; // uploader.queue has error when fileRows isn't init
    this.fileRows = [];
    this.route.params.subscribe((params: Params) => {
      // this.type = params['type'];
      this.setUpLoadType(params['type']);
      this.initializeUploader();
    });

    this.initializeUploader();
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  setUpLoadType(uploadType: string) {
    if (uploadType == UPLOADTYPES.unaccompanied) {
      this.uploadTypeData.acceptedFileTypes = ['xls'];
      this.uploadTypeData.url = this.baseUrl + 'file/unaccompaniedFile';
      this.uploadTypeData.warningMessage = 'Please select a XLSX file';
      this.uploadTypeData.title = 'Upload Unaccompanied File';
    } else if (uploadType == UPLOADTYPES.lodging) {
      this.uploadTypeData.acceptedFileTypes = ['pdf'];
      this.uploadTypeData.url = this.baseUrl + 'file/lodgingFile';
      this.uploadTypeData.warningMessage = 'Please select a PDF file';
      this.uploadTypeData.title = 'Upload Lodging File';
    } else if (uploadType == UPLOADTYPES.exmanifest) {
      this.uploadTypeData.acceptedFileTypes = ['xls'];
      this.uploadTypeData.url = this.baseUrl + 'file/exmanifestfile'
      this.uploadTypeData.warningMessage = 'Please select a XLS file';
      this.uploadTypeData.title = 'Upload Exercise Manifest File';
    }
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.uploadTypeData.url,
      authToken: 'Bearer ' + localStorage.getItem('token'),
      isHTML5: true,
      allowedFileType: this.uploadTypeData.acceptedFileTypes,
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    }); // maxFileSize = 10MB

    this.uploader.onWhenAddingFileFailed = () => {
      this.alertify.warning(this.uploadTypeData.warningMessage);
    };
    this.uploader.onSuccessItem = (item, response, status, headers) => {
      let json = JSON.parse(response);
      this.showHideSpinner();
      this.totalFileRows = json;
      if (this.totalFileRows.length > 0) {
        this.alertify.warning('Problem with some records');
        this.changePaginationDisplay();
        this.currentPage = 1;
        this.unitsService.getUnits().subscribe(
          (units: Unit[]) => {
            this.units = units;
          },
          error => {
            this.alertify.error(error);
          }
        );
      } else {
        this.alertify.success('Upload Successful');
      }
    };
    this.uploader.onErrorItem = (item, response, status, headers) => {
      this.alertify.error('File Upload Failed');
      this.showHideSpinner();
    };
  }

  showHideSpinner() {
    this.showSpinner = !this.showSpinner;
  }

  pageChanged(event: any): void {
    this.currentPage = event.page;
    this.changePaginationDisplay();
  }

  changePaginationDisplay() {
    if (this.totalFileRows.length < this.itemsPerPage) {
      this.fileRows = this.totalFileRows;
      return;
    }

    if (this.currentPage == null) {
      this.currentPage = 1;
    }

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.fileRows = this.totalFileRows.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
    this.currentPage++;
  }

  openDialog(fileRow) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      dataRow: fileRow,
      units: this.units
    };

    if (this.type === UPLOADTYPES.unaccompanied) {
      const dialogRef = this.dialog.open(
        UnaccompanieddialogComponent,
        dialogConfig
      );
    } else if (this.type === UPLOADTYPES.lodging) {
      const dialogRef = this.dialog.open(LodgingDialogComponent, dialogConfig);
    } else if (this.type === UPLOADTYPES.exmanifest) {
      const dialogRef = this.dialog.open(ExmanifestDialogComponent, dialogConfig)
    }
  }

  OnSubmitClick() {
    this.showHideSpinner();
    if(this.type === UPLOADTYPES.exmanifest) {
      this.fileuploadService.uploadExmanifestDataRows(this.totalFileRows, this.userParams).subscribe(
        (fileRows: FileRow[]) => {
          this.showHideSpinner();
          this.totalFileRows = fileRows;
          if (this.totalFileRows.length > 0) {
            this.changePaginationDisplay();
            this.alertify.warning('Problem with some records');
          } else {
            this.alertify.success('Upload Successful');
            this.router.navigate(['/']);
          }
        },
        error => {
          this.showHideSpinner();
          this.alertify.error(error);
        }
      );
    } else {
    this.fileuploadService.uploadUnaccomData(this.totalFileRows, this.userParams).subscribe(
      (fileRows: FileRow[]) => {
        this.showHideSpinner();
        this.totalFileRows = fileRows;
        if (this.totalFileRows.length > 0) {
          this.changePaginationDisplay();
          this.alertify.warning('Problem with some records');
        } else {
          this.alertify.success('Upload Successful');
          this.router.navigate(['/']);
        }
      },
      error => {
        this.showHideSpinner();
        this.alertify.error(error);
      }
    );
  }
}

  OnDiscard() {
    this.totalFileRows = [];
    this.fileRows = [];
    this.uploader.queue = [];
  }
}
