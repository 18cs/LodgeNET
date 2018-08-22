import { Component, OnInit } from '@angular/core';
import { Pagination, PaginatedResult } from '../../../_models/pagination';
import { GuestParams } from '../../../_models/params/guestParams';
import { AuthService } from '../../../_services/auth.service';
import { GueststayService } from '../../../_services/gueststay.service';
import { GuestStayEdit } from '../../../_models/guestStayEdit';
import { AlertifyService } from '../../../_services/alertify.service';
import { ActivatedRoute, Data } from '@angular/router';
import { GuestStayParams } from '../../../_models/params/guestStayParams';
import { FileexportService } from '../../../_services/fileexport.service';
import { GuestStayDisplay } from '../../../_models/display/guestStayDisplay';

@Component({
  selector: 'app-inhouse',
  templateUrl: './inhouse.component.html',
  styleUrls: ['./inhouse.component.css']
})
export class InhouseComponent implements OnInit {
  guestStayList: GuestStayEdit[];
  pageSize = 10;
  pageNumber = 1;
  pagination: Pagination;
  showSpinner = true;
  filterParams: GuestStayParams = { dodId: null, lastName: null, roomNumber: null, guestId: null, currentStaysOnly: true };

  constructor(
    private guestStayService: GueststayService,
    private authService: AuthService,
    private alertify: AlertifyService,
    private route: ActivatedRoute,
    private fileExport: FileexportService
  ) { }

  ngOnInit(): void {
    this.loadCurrentGuests();
  }

  loadCurrentGuests() {
    this.showSpinner = true;
    console.log(this.pagination);
    if (this.pagination == null) {
      this.guestStayService.getGuestStaysPagination(this.pageNumber, this.pageSize, this.filterParams)
        .subscribe((paginatedResult: PaginatedResult<GuestStayEdit[]>) => {
          this.showSpinner = false;
          this.guestStayList = paginatedResult.result;
          this.pagination = paginatedResult.pagination;
        }, error => { this.alertify.error(error); });
    } else {
      this.guestStayService.getGuestStaysPagination(this.pagination.currentPage, this.pagination.itemsPerPage, this.filterParams)
        .subscribe((paginatedResult: PaginatedResult<GuestStayEdit[]>) => {
          this.showSpinner = false;
          this.guestStayList = paginatedResult.result;
          this.pagination = paginatedResult.pagination;
        }, error => { this.alertify.error(error); });
    }
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadCurrentGuests();
  }

  exportAsXLSX(): void {
    this.guestStayService.getGuestStaysDisplay(this.filterParams)
      .subscribe((guestStays: GuestStayDisplay[]) => {
        this.fileExport.exportAsExcelFile(guestStays, 'InHouseReport');
      }, error => { this.alertify.error(error);});
  }

}
