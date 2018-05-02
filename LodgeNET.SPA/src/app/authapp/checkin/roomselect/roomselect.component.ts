import { Component, OnInit, OnDestroy } from '@angular/core';
import { BuildingService } from '../../../_services/building.service';
import { BuildingTable } from '../../../_models/buildingTable';
import { AlertifyService } from '../../../_services/alertify.service';
import { GueststayService } from '../../../_services/gueststay.service';
import { PaginatedResult, Pagination } from '../../../_models/pagination';
import { Room } from '../../../_models/room';
import { CheckinService } from '../../../_services/checkin.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-roomselect',
  templateUrl: './roomselect.component.html',
  styleUrls: ['./roomselect.component.css']
})
export class RoomselectComponent implements OnInit, OnDestroy {

  buildingDashboard: BuildingTable;
  buildingTypeIdSelected = 1;
  buildingSelectedId: number;

  pageSize = 10;
  pageNumber = 1;

  rooms: Room[];
  pagination: Pagination;

  selectedRoom: Room;

  constructor(private buildingService: BuildingService,
              private alertify: AlertifyService,
              private guestStayService: GueststayService,
              private checkinService: CheckinService,
              private router: Router,
              private route: ActivatedRoute) { }



  ngOnInit() {
    // TODO put the request into a resolver
    if (!this.checkinService.isGuestInfoValid) {
      this.router.navigate(['../'], { relativeTo: this.route });
    }
    this.loadBuildings();

    if (this.checkinService.guestStay.room != null) {
      this.onRoomSelected(this.checkinService.guestStay.room);
    }
  }

  ngOnDestroy() {
    this.checkinService.saveRoomSelection(this.selectedRoom);
  }

  loadBuildings() {
    this.buildingService.buildingDashboardData().subscribe((buildingDashboard: BuildingTable) => {
      this.buildingDashboard = buildingDashboard;
    }, error => {
      this.alertify.error(error);
    });
  }

  onClickBuilding(buildingId: number) {
    this.buildingSelectedId = buildingId;
    this.loadRooms();
  }

  loadRooms() {
    if (this.pagination == null) {
      this.guestStayService.getAvaliableRooms(this.pageNumber, this.pageSize, this.buildingSelectedId, true)
      .subscribe((paginatedResult: PaginatedResult<Room[]>) => {
        this.rooms = paginatedResult.result;
        this.pagination = paginatedResult.pagination;
      }, error => {this.alertify.error(error); });
    } else {
      this.guestStayService.getAvaliableRooms(this.pagination.currentPage, this.pagination.itemsPerPage, this.buildingSelectedId, true)
      .subscribe((paginatedResult: PaginatedResult<Room[]>) => {
        this.rooms = paginatedResult.result;
        this.pagination = paginatedResult.pagination;
      }, error => {this.alertify.error(error); });
    }

  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadRooms();
  }

  onRoomSelected(room: Room) {
    if (this.selectedRoom != null) {
      this.alertify.warning('Guest can only have one room');
    } else {
      this.selectedRoom = room;
      this.checkinService.setIsRoomSelected(true);
    }
  }

  onRoomRemoved(room: Room) {
    this.selectedRoom = null;
    this.checkinService.setIsRoomSelected(false);
  }

}
