import { Component, OnInit } from '@angular/core';
import { AlertifyService } from '../../../_services/alertify.service';
import { GueststayService } from '../../../_services/gueststay.service';
import { Guest } from '../../../_models/guest';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { GuestsdialogComponent } from '../dialogcomponents/guestsdialog/guestsdialog.component';
import { GuestStayCheckOut } from '../../../_models/guestStayCheckOut';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Data } from '@angular/router';
import { PaginatedResult, Pagination } from '../../../_models/pagination';

@Component({
  selector: 'app-viewguests',
  templateUrl: './viewguests.component.html',
  styleUrls: ['./viewguests.component.css']
})
export class ViewguestsComponent implements OnInit {
  filterGuestForm: FormGroup;
  formData: FormData;
  guestList: Guest[];
  guestStayList: GuestStayCheckOut[];
  type: string;
  currentPage: number;
  itemsPerPage = 10;
  showSpinner = false;
  pageSize = 10;
  pageNumber = 1;
  pagination: Pagination;

  constructor(
    private guestStayService: GueststayService,
    private alertify: AlertifyService,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {}


  ngOnInit() {
    this.loadGuests();
    this.initFilterForm();
    this.route.data.subscribe((data: Data) => {
      this.formData = data['formData'];
      console.log(this.formData);
    });
  }

  initFilterForm() {
    this.filterGuestForm = new FormGroup({

    });
    // 'dodId': new FormControl(),
    // 'lastName': new FormControl(),
    // 'gender': new FormControl(),
    // 'service': new FormControl(),
    // 'rank': new FormControl()
  }

  onSearch() {

  }

  getGuestStays(guestId: number) {
    this.loadGuestStays(guestId);
  }

  loadGuests() {
    // this.guestStayService.getGuests().subscribe(
    //   (guestList: Guest[]) => {
    //     console.log(guestList);
    //     this.guestList = guestList;
    //   },
    //   error => {
    //     this.alertify.error(error);
    //   }
    // );

    if (this.pagination == null) {
      this.guestStayService.getGuests(this.pageNumber, this.pageSize)
        .subscribe((paginatedResult: PaginatedResult<Guest[]>) => {
          console.log(paginatedResult);
          this.guestList = paginatedResult.result;
          this.pagination = paginatedResult.pagination;
        }, error => { this.alertify.error(error); });
    } else {
      this.guestStayService.getGuests(this.pagination.currentPage, this.pagination.itemsPerPage)
        .subscribe((paginatedResult: PaginatedResult<Guest[]>) => {
          this.guestList = paginatedResult.result;
          this.pagination = paginatedResult.pagination;
        }, error => { this.alertify.error(error); });
    }


  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadGuests();
  }

  loadGuestStays(guestId: number) {
    this.guestStayService.getGuestStays(null, null, null, guestId).subscribe(
      (guestStayList: GuestStayCheckOut[]) => {
        console.log(guestStayList);
        this.guestStayList = guestStayList;
      },
      error => {
        this.alertify.error(error);
      }
    )
  }

}
