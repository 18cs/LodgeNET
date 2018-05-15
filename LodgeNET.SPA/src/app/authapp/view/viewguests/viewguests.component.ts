import { Component, OnInit } from '@angular/core';
import { AlertifyService } from '../../../_services/alertify.service';
import { GueststayService } from '../../../_services/gueststay.service';
import { Guest } from '../../../_models/guest';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { GuestsdialogComponent } from '../dialogcomponents/guestsdialog/guestsdialog.component';
import { GuestStayCheckOut } from '../../../_models/guestStayCheckOut';

@Component({
  selector: 'app-viewguests',
  templateUrl: './viewguests.component.html',
  styleUrls: ['./viewguests.component.css']
})
export class ViewguestsComponent implements OnInit {
  guestList: Guest[];
  guestStayList: GuestStayCheckOut[];
  type: string;
  currentPage: number;
  itemsPerPage = 10;
  showSpinner = false;

  constructor(
    private guestStayService: GueststayService,
    private alertify: AlertifyService,
    private dialog: MatDialog
  ) {}
  ngOnInit() {
    this.loadGuests();
  }

  getGuestStays(guestId: number) {
    this.loadGuestStays(guestId);
  }

  loadGuests() {
    this.guestStayService.getGuests().subscribe(
      (guestList: Guest[]) => {
        console.log(guestList);
        this.guestList = guestList;
      },
      error => {
        this.alertify.error(error);
      }
    );
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
