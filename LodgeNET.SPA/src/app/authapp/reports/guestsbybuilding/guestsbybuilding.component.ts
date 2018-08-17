import { Component, OnInit } from '@angular/core';
import { Pagination } from '../../../_models/pagination';

@Component({
  selector: 'app-guestsbybuilding',
  templateUrl: './guestsbybuilding.component.html',
  styleUrls: ['./guestsbybuilding.component.css']
})
export class GuestsbybuildingComponent implements OnInit {
  pageSize = 10;
  pageNumber = 1;
  pagination: Pagination;
  showSpinner = true;

  constructor() { }

  ngOnInit() {
  }

}
