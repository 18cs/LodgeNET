import { Component, OnInit } from '@angular/core';
import { AlertifyService } from '../../../_services/alertify.service';
import { GueststayService } from '../../../_services/gueststay.service';
import { Guest } from '../../../_models/guest';
import { GuestTable } from '../../../_models/guestTable';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { GuestsdialogComponent } from '../dialogcomponents/guestsdialog/guestsdialog.component';

@Component({
  selector: 'app-viewguests',
  templateUrl: './viewguests.component.html',
  styleUrls: ['./viewguests.component.css']
})
export class ViewguestsComponent implements OnInit {
  guestTable: GuestTable;
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

  loadGuests() {
    this.guestStayService.getGuests().subscribe(
      (guestTable: GuestTable) => {
        console.log(guestTable);
        this.guestTable = guestTable;
      },
      error => {
        this.alertify.error(error);
      }
    );
  }

}
