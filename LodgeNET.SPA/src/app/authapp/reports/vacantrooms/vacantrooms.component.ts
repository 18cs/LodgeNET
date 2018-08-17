import { Component, OnInit } from '@angular/core';
import { Pagination, PaginatedResult } from '../../../_models/pagination';
import { AuthService } from '../../../_services/auth.service';
import { AlertifyService } from '../../../_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Building } from '../../../_models/building';
import { FormControl } from '@angular/forms';
import { RoomParams } from '../../../_models/params/roomParams';
import { GueststayService } from '../../../_services/gueststay.service';
import { BuildingService } from '../../../_services/building.service';
import { Room } from '../../../_models/room';

@Component({
  selector: 'app-vacantrooms',
  templateUrl: './vacantrooms.component.html',
  styleUrls: ['./vacantrooms.component.css']
})
export class VacantroomsComponent implements OnInit {
  pageSize = 10;
  pageNumber = 1;
  pagination: Pagination;
  showSpinner = false;
  filterParams: RoomParams;
  filteredOptions: Observable<Building[]>;
  buildingName = new FormControl();
  selectedBuilding: Building;
  selectedBuildingName: string;
  roomList: Room[];
  buildingList: Building[];

  constructor(
    private guestStayService: GueststayService,
    private buildingService: BuildingService,
    private authService: AuthService,
    private alertify: AlertifyService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.loadVacantRooms();
    this.initFilterParams();
  }

  initFilterParams() {
    this.filterParams = { buildingId: null, onlyAvailableRooms: false, roomNumber: null };
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

  loadVacantRooms() {
    this.showSpinner = true;
    if (this.pagination == null) {
      this.guestStayService.getRooms(this.pageNumber, this.pageSize, this.filterParams)
        .subscribe((paginatedResult: PaginatedResult<Room[]>) => {
          this.showSpinner = false;
          this.roomList = paginatedResult.result;
          this.pagination = paginatedResult.pagination;
        }, error => {
          this.alertify.error(error);
          this.showSpinner = false;
        });
    } else {
      this.guestStayService.getRooms(this.pagination.currentPage, this.pagination.itemsPerPage, this.filterParams)
        .subscribe((paginatedResult: PaginatedResult<Room[]>) => {
          this.roomList = paginatedResult.result;
          this.showSpinner = false;
          this.pagination = paginatedResult.pagination;
        }, error => {
          this.alertify.error(error);
          this.showSpinner = false;
        });
    }

  }

}
