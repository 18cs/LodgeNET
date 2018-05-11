import { Component, OnInit } from '@angular/core';
import { GueststayService } from '../../_services/gueststay.service';

@Component({
  selector: 'app-checkin',
  templateUrl: './checkin.component.html',
  styleUrls: ['./checkin.component.css']
})
export class CheckinComponent implements OnInit {

  constructor(private gueststayService: GueststayService) { }

  ngOnInit() {
  }

}
