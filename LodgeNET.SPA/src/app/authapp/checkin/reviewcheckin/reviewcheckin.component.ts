import { Component, OnInit } from '@angular/core';
import { CheckinService } from '../../../_services/checkin.service';
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
              private checkinService: CheckinService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    if (!this.checkinService.isGuestInfoValid || !this.checkinService.isRoomSelected) {
      this.router.navigate(['../guestinfo'], {relativeTo: this.route});
    }
    this.guestStay = this.checkinService.guestStay;
  }

  onCancel() {
    this.checkinService.clearGuestStay();
    this.router.navigate(['/']);
  }

  onSubmit() {
    this.checkinService.checkinGuest().subscribe(() => {
      this.alertify.success('Checkin Successful');
      this.checkinService.clearGuestStay();
      this.router.navigate(['/']);
    }, error => {
      this.alertify.error(error);
    });
  }

}
