import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { GueststayService } from '../../_services/gueststay.service';
import { AlertifyService } from '../../_services/alertify.service';
import { GuestStay } from '../../_models/guestStay';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  retrieveGuestStayForm: FormGroup;
  dodId: number;
  lastName: string;
  roomNumber: number;

  guestStayList: GuestStay[];
  guestStay: GuestStay;

  constructor(private guestStayService: GueststayService,
              private alertify: AlertifyService) { }

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
    if (this.dodId == null && this.lastName == null && this.roomNumber == null) {
      this.alertify.message('Please enter search value');
      return;
    }

    this.guestStayService.getGuestStays(this.dodId, this.lastName, this.roomNumber).subscribe((guestStays: GuestStay[]) => {
      console.log(guestStays);
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
  }

}
