import { Component, OnInit } from '@angular/core';
import { Pagination, PaginatedResult } from '../../../_models/pagination';
import { AuthService } from '../../../_services/auth.service';
import { AlertifyService } from '../../../_services/alertify.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Upload } from '../../../_models/upload';
import { FileuploadService } from '../../../_services/fileupload.service';
import { UploadParams } from '../../../_models/params/uploadParams';
import { Observable } from 'rxjs';
import { GueststayService } from '../../../_services/gueststay.service';

@Component({
  selector: 'app-manageuploads',
  templateUrl: './manageuploads.component.html',
  styleUrls: ['./manageuploads.component.css']
})
export class ManageuploadsComponent implements OnInit {
  pageSize = 10;
  pageNumber = 1;
  pagination: Pagination;
  showSpinner = false;
  filterParams: UploadParams;
  filteredOptions: Observable<Upload[]>;
  uploads: Upload[];

  constructor(
    private authService: AuthService,
    private alertify: AlertifyService,
    private route: ActivatedRoute,
    private router: Router,
    private uploadService: FileuploadService,
    private guestStayService: GueststayService
  ) { }

  ngOnInit() {
    this.loadUploads();
    this.guestStayService.loadByUploadId = 0;
  }

  loadUploads() {
    this.showSpinner = true;
    if (this.pagination == null) {
      this.uploadService.getUploadsPagination(this.pageNumber, this.pageSize, this.filterParams)
        .subscribe((paginatedResult: PaginatedResult<Upload[]>) => {
          this.showSpinner = false;
          this.uploads = paginatedResult.result;
          this.pagination = paginatedResult.pagination;
        }, error => { 
          this.alertify.error(error);
          this.showSpinner = false; 
        });
    } else {
      this.uploadService.getUploadsPagination(this.pagination.currentPage, this.pagination.itemsPerPage, this.filterParams)
        .subscribe((paginatedResult: PaginatedResult<Upload[]>) => {
          this.showSpinner = false;
          this.uploads = paginatedResult.result;
          this.pagination = paginatedResult.pagination;
        }, error => { 
          this.alertify.error(error);
          this.showSpinner = false;
        });
    }
  }

  onReset() {
    this.loadUploads();
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadUploads();
  }

  onDelete(upload: Upload) {
    this.alertify.confirm(
      'Are you sure you wish to delete ' + upload.fileName + '?',
      () => {
        this.uploadService.deleteUpload(upload.id).subscribe(
          () => {
            this.alertify.success(upload.fileName + ' successfully deleted');
            let uploadIndex = this.uploads.indexOf(upload);

            if (uploadIndex !== -1) {
              this.uploads.splice(uploadIndex, 1);
            }
          },
          error => this.alertify.error(error)
        );
      })
  }

  loadGuestsByUpload(uploadId: number) {
    this.guestStayService.loadByUploadId = uploadId;
    this.router.navigateByUrl('/view/guests');
  }

  // getUploadCount(uploadId: number) {
  //   this.guestStayService.getUploadCount(uploadId).subscribe(
  //     (uploadCount: number) => {
  //       console.log(uploadCount);
  //     });
  // }

}
