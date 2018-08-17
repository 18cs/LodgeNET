import { Component, OnInit } from '@angular/core';
import { Pagination, PaginatedResult } from '../../../_models/pagination';
import { AuthService } from '../../../_services/auth.service';
import { AlertifyService } from '../../../_services/alertify.service';
import { ActivatedRoute, Data } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { map, startWith } from 'rxjs/operators';
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
  filterByBldg = false;
  filterParams: RoomParams;
  filteredOptions: Observable<Building[]>;
  buildingName = new FormControl();
  selectedBuilding: Building;
  selectedBuildingName: string;
  selectedBuildingTitle: string;
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
    this.filterParams = { buildingId: null, onlyAvailableRooms: true, roomNumber: null };
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

  onSearch() {
    if(this.selectedBuilding != null) {
      this.filterParams.buildingId = this.selectedBuilding.id;
      this.filterByBldg = true;
      this.loadVacantRooms();
      this.selectedBuildingTitle = this.selectedBuildingName;
    }
  }

  onReset() {
    this.initFilterParams();
    this.selectedBuilding = null;
    this.selectedBuildingName = '';
    this.filterByBldg = false;
    this.loadVacantRooms();
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadVacantRooms();
  }

}
