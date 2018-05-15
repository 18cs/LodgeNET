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

  constructor(private authService: AuthService,
    private alertify: AlertifyService) { }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    if (this.pagination == null) {
      this.authService.GetUsers(this.pageNumber, this.pageSize)
        .subscribe((paginatedResult: PaginatedResult<User[]>) => {
          this.users = paginatedResult.result;
          console.log(this.users);
          this.pagination = paginatedResult.pagination;
        }, error => { this.alertify.error(error); });
    } else {
      this.authService.GetUsers(this.pagination.currentPage, this.pagination.itemsPerPage)
        .subscribe((paginatedResult: PaginatedResult<User[]>) => {
          this.users = paginatedResult.result;
          console.log(this.users);
          this.pagination = paginatedResult.pagination;
        }, error => { this.alertify.error(error); });
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
      'Are you sure you wish to delete ' + user.userName +
      '? <br /> <br /> WARNING: All rooms and stays of this building will be deleted.',
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
