import { Component, OnInit } from '@angular/core';
import { AlertifyService } from '../../../_services/alertify.service';
import { Pagination, PaginatedResult } from '../../../_models/pagination';
import { AuthService } from '../../../_services/auth.service';
import { User } from '../../../_models/user';

@Component({
  selector: 'app-viewusers',
  templateUrl: './viewusers.component.html',
  styleUrls: ['./viewusers.component.css']
})
export class ViewusersComponent implements OnInit {
  users: User[];
  selectedUser: User;
  pageSize = 10;
  pageNumber = 1;
  pagination: Pagination;
  showSpinner = false;

  constructor(private authService: AuthService,
    private alertify: AlertifyService) { }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.showSpinner = true;
    if (this.pagination == null) {
      this.authService.GetUsers(this.pageNumber, this.pageSize)
        .subscribe((paginatedResult: PaginatedResult<User[]>) => {
          this.showSpinner = false;
          this.users = paginatedResult.result;
          this.pagination = paginatedResult.pagination;
        }, error => { 
          this.alertify.error(error);
          this.showSpinner = false; 
        });
    } else {
      this.authService.GetUsers(this.pagination.currentPage, this.pagination.itemsPerPage)
        .subscribe((paginatedResult: PaginatedResult<User[]>) => {
          this.showSpinner = false;
          this.users = paginatedResult.result;
          this.pagination = paginatedResult.pagination;
        }, error => { 
          this.alertify.error(error);
          this.showSpinner = false; 
        });
    }
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadUsers();
  }

  onUserSelect(user: User) {
    this.selectedUser = user;
  }

  onDelete(user: User) {
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
