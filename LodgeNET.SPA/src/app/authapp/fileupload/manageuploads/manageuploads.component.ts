import { Component, OnInit } from '@angular/core';
import { Pagination } from '../../../_models/pagination';
import { AuthService } from '../../../_services/auth.service';
import { AlertifyService } from '../../../_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { Upload } from '../../../_models/upload';

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

  constructor(
    private authService: AuthService,
    private alertify: AlertifyService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
  }

  loadUploads() {
    this.showSpinner = true;
    // if (this.pagination == null) {
    //   this.authService.GetUsers(this.pageNumber, this.pageSize, this.filterParams)
    //     .subscribe((paginatedResult: PaginatedResult<User[]>) => {
    //       this.showSpinner = false;
    //       this.users = paginatedResult.result;
    //       this.pagination = paginatedResult.pagination;
    //     }, error => { 
    //       this.alertify.error(error);
    //       this.showSpinner = false; 
    //     });
    // } else {
    //   this.authService.GetUsers(this.pagination.currentPage, this.pagination.itemsPerPage, this.filterParams)
    //     .subscribe((paginatedResult: PaginatedResult<User[]>) => {
    //       this.showSpinner = false;
    //       this.users = paginatedResult.result;
    //       this.pagination = paginatedResult.pagination;
    //     }, error => { 
    //       this.alertify.error(error);
    //       this.showSpinner = false; 
    //     });
    // }
  }

  onSearch() {
    this.pagination.currentPage = 1;
    this.loadUsers();
  }

  onReset() {
    //this.initFilterParams();
    this.initFilterParams();
    this.loadUsers();
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadUploads();
  }

  onUserSelect(upload: Upload) {
    this.selectedUser = user;
  }

  onDelete(upload: Upload) {
    this.alertify.confirm(
      'Are you sure you wish to delete ' + user.userName + '?',
      () => {
        this.authService.deleteUser(user.id).subscribe(
          () => {
            this.alertify.success(user.userName + ' successfully deleted');
            let userIndex = this.users.indexOf(user);

            if (userIndex !== -1) {
              this.users.splice(userIndex, 1);
            }
          },
          error => this.alertify.error(error)
        );
      })
  }

}
