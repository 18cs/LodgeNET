import { Component, OnInit } from '@angular/core';
import { AlertifyService } from '../../../_services/alertify.service';
import { Pagination, PaginatedResult } from '../../../_models/pagination';
import { AuthService } from '../../../_services/auth.service';
import { User } from '../../../_models/user';
import { UserParams } from '../../../_models/params/userParams';
import { AccountType } from '../../../_models/accountType';
import { ActivatedRoute, Params } from '@angular/router';
import { FileexportService } from '../../../_services/fileexport.service';
import { UserDisplay } from '../../../_models/display/userDisplay';

@Component({
  selector: 'app-viewusers',
  templateUrl: './viewusers.component.html',
  styleUrls: ['./viewusers.component.css']
})
export class ViewusersComponent implements OnInit {
  users: User[];
  accountTypes: AccountType[];
  selectedUser: User;
  pageSize = 10;
  pageNumber = 1;
  pagination: Pagination;
  showSpinner = false;
  filterParams: UserParams;
  approvedList = [{ value: true, display: 'True'}, { value: false, display: 'False'}];

  constructor(
    private authService: AuthService,
    private alertify: AlertifyService,
    private route: ActivatedRoute,
    private fileExport: FileexportService
  ) { }

  ngOnInit() {
    this.initFilterParams();    
    this.route.params.subscribe((params: Params) => {
      let approved = params['approved'];
      if (approved === 'false') {
        this.filterParams.approved = false;
      }
    });

    this.loadUsers();
    this.loadAccountTypes();
  }

  loadUsers() {
    this.showSpinner = true;
    if (this.pagination == null) {
      this.authService.GetUsersPagination(this.pageNumber, this.pageSize, this.filterParams)
        .subscribe((paginatedResult: PaginatedResult<User[]>) => {
          this.showSpinner = false;
          this.users = paginatedResult.result;
          this.pagination = paginatedResult.pagination;
        }, error => { 
          this.alertify.error(error);
          this.showSpinner = false; 
        });
    } else {
      this.authService.GetUsersPagination(this.pagination.currentPage, this.pagination.itemsPerPage, this.filterParams)
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

  loadAccountTypes() {
    this.authService.getAccountTypes()
      .subscribe((accountTypes: AccountType[]) => {
        this.accountTypes = accountTypes;
      }, error => {
        this.alertify.error(error);
      })
  }

  initFilterParams() {
    this.filterParams = { userName: null, accountTypeId: null, approved: null } as UserParams;
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

  exportAsXLSX(): void {
    this.authService.getUsersDisplay(this.filterParams)
      .subscribe((users: UserDisplay[]) => {
        this.fileExport.exportAsExcelFile(users, 'Users_Report');
      }, error => { this.alertify.error(error);});
  }
}
