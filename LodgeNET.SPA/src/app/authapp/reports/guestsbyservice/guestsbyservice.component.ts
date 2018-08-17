import { Component, OnInit } from '@angular/core';
import { Pagination } from '../../../_models/pagination';

@Component({
  selector: 'app-guestsbyservice',
  templateUrl: './guestsbyservice.component.html',
  styleUrls: ['./guestsbyservice.component.css']
})
export class GuestsbyserviceComponent implements OnInit {
  pageSize = 10;
  pageNumber = 1;
  pagination: Pagination;
  showSpinner = true;

  constructor() { }

  ngOnInit() {
  }

  // initFilterParams() {
  //   this.filterParams = { dodId: null, lastName: null, roomNumber: null, guestId: null, currentStaysOnly: true };
  // }

  // loadCurrentGuests() {
  //   this.showSpinner = true;
  //   if (this.pagination == null) {
  //     this.guestStayService.getGuestStaysPagination(this.pageNumber, this.pageSize, this.filterParams)
  //       .subscribe((paginatedResult: PaginatedResult<GuestStayEdit[]>) => {
  //         this.showSpinner = false;
  //         this.guestStayList = paginatedResult.result;
  //         this.pagination = paginatedResult.pagination;
  //       }, error => { this.alertify.error(error); });
  //   } else {
  //     this.guestStayService.getGuestStaysPagination(this.pagination.currentPage, this.pagination.itemsPerPage, this.filterParams)
  //       .subscribe((paginatedResult: PaginatedResult<GuestStayEdit[]>) => {
  //         this.showSpinner = false;
  //         this.guestStayList = paginatedResult.result;
  //         this.pagination = paginatedResult.pagination;
  //       }, error => { this.alertify.error(error); });
  //   }
    
  // }

  // pageChanged(event: any): void {
  //   this.pagination.currentPage = event.page;
  //   this.loadCurrentGuests();
  // }

}
