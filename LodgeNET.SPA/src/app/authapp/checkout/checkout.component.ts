import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { GueststayService } from '../../_services/gueststay.service';
import { AlertifyService } from '../../_services/alertify.service';
import { GuestStayEdit } from '../../_models/guestStayEdit';
import { Router } from '@angular/router';
import { GuestStayParams } from '../../_models/params/guestStayParams';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  retrieveGuestStayForm: FormGroup;
  dodId: number;
  lastName: string;
  roomNumber: string;

  guestStayList: GuestStayEdit[];
  guestStay: GuestStayEdit;

  constructor(private guestStayService: GueststayService,
              private alertify: AlertifyService,
              private router: Router) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.retrieveGuestStayForm = new FormGroup({
      'dodId': new FormControl(),
      'lastName': new FormControl(),
      'roomNumber': new FormControl()
    });
  }

  onSearch() {
    this.guestStay = null;
    this.guestStayList = null;

    if (this.dodId == null && this.lastName == null && this.roomNumber == null) {
      this.alertify.message('Please enter search value');
      return;
    }

    this.guestStayService.getGuestStays({dodId : this.dodId, lastName : this.lastName, roomNumber : this.roomNumber, guestId : null, currentStaysOnly : true} as GuestStayParams)
      .subscribe((guestStays: GuestStayEdit[]) => {
        if (guestStays.length > 1) {
          this.guestStayList = guestStays;
        } else if (guestStays.length === 1) {
          this.guestStay = guestStays[0];
        } else {
          this.alertify.warning('Guest not found');
        }
      }, error => {
        this.alertify.error(error);
      });

    this.dodId = null;
    this.lastName = null;
    this.roomNumber = null;
  }

  onSelectedGuestStay(selectedGuestStay: GuestStayEdit) {
    if (selectedGuestStay != null) {
      this.guestStay = selectedGuestStay;
    }
  }

  onSubmit() {
    this.guestStayService.checkOutGuest(this.guestStay).subscribe(() => {
      this.alertify.success('Guest Checked Out');
      this.router.navigate(['/']);
    }, error => {
      this.alertify.error(error);
    });
  }

  onCancel() {
    this.router.navigate(['/']);
  }

}
