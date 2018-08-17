import { Component, OnInit } from '@angular/core';
import { Pagination, PaginatedResult } from '../../../_models/pagination';
import { GuestStayParams } from '../../../_models/params/guestStayParams';
import { Observable } from 'rxjs/Observable';
import { map, startWith } from 'rxjs/operators';
import { Building } from '../../../_models/building';
import { FormControl } from '@angular/forms';
import { GuestStayEdit } from '../../../_models/guestStayEdit';
import { GueststayService } from '../../../_services/gueststay.service';
import { BuildingService } from '../../../_services/building.service';
import { AuthService } from '../../../_services/auth.service';
import { AlertifyService } from '../../../_services/alertify.service';
import { ActivatedRoute, Data } from '@angular/router';

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
  filterByBldg = false;
  filterParams: GuestStayParams;
  filteredOptions: Observable<Building[]>;
  buildingName = new FormControl();
  selectedBuilding: Building;
  selectedBuildingName: string;
  selectedBuildingTitle: string;
  guestStayList: GuestStayEdit[];
  buildingList: Building[];

  constructor(private guestStayService: GueststayService,
    private buildingService: BuildingService,
    private authService: AuthService,
    private alertify: AlertifyService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.loadGuests();
    this.route.data.subscribe((data: Data) => {
      this.buildingList = data['buildings'];
    });
    this.initFilterParams();

    this.filteredOptions = this.buildingName.valueChanges
    .pipe(
      startWith(''),
      map(val => this.buildingFilter(val))
    );
  }

  initFilterParams() {
    this.filterParams = { dodId: null, lastName: null, roomNumber: null, guestId: null, currentStaysOnly: true, buildingId: null };
  }

  buildingFilter(val: string): Building[] {
    return this.buildingList.filter(building =>
      building.name.toLowerCase().includes(val.toLowerCase()));
  }

  onBuildingSelected(bldg: Building) {
    this.selectedBuilding = bldg;
  }

  onbuildingFocusOut() {
    if(this.selectedBuilding != null ) {
      this.selectedBuildingName = this.selectedBuilding.name;
    }
  }

  loadGuests() {
    this.showSpinner = true;
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

  onSearch() {
    if(this.selectedBuilding != null) {
      this.filterParams.buildingId = this.selectedBuilding.id;
      this.filterByBldg = true;
      this.pagination.currentPage = 1;
      this.loadGuests();
      this.selectedBuildingTitle = this.selectedBuildingName;
    }
  }

  onReset() {
    this.initFilterParams();
    this.selectedBuilding = null;
    this.selectedBuildingName = '';
    this.filterByBldg = false;
    this.loadGuests();
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadGuests();
  }

}
