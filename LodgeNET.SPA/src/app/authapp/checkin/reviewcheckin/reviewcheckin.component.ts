import { Component, OnInit } from '@angular/core';
import { GueststayService } from '../../../_services/gueststay.service';
import { AlertifyService } from '../../../_services/alertify.service';
import { GuestStayCheckIn } from '../../../_models/guestStayCheckIn';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reviewcheckin',
  templateUrl: './reviewcheckin.component.html',
  styleUrls: ['./reviewcheckin.component.css']
})
export class ReviewcheckinComponent implements OnInit {
  guestStay: GuestStayCheckIn;


  constructor(private alertify: AlertifyService,
              private gueststayService: GueststayService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    if (!this.gueststayService.isGuestInfoValid || !this.gueststayService.isRoomSelected) {
      this.router.navigate(['../guestinfo'], {relativeTo: this.route});
    }
    this.guestStay = this.gueststayService.guestStay;
  }

  onCancel() {
    this.gueststayService.clearGuestStay();
    this.router.navigate(['/']);
  }

  onSubmit() {
    this.gueststayService.checkinGuest().subscribe(() => {
      this.alertify.success('Check-In Successful');
      this.gueststayService.clearGuestStay();
      this.router.navigate(['/']);
    }, error => {
      this.alertify.error(error);
    });
  }

}
