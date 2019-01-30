import { Component, OnInit, OnDestroy } from '@angular/core';
import { BuildingService } from '../../../_services/building.service';
import { BuildingTable } from '../../../_models/buildingTable';
import { AlertifyService } from '../../../_services/alertify.service';
import { GueststayService } from '../../../_services/gueststay.service';
import { PaginatedResult, Pagination } from '../../../_models/pagination';
import { Room } from '../../../_models/room';
import { ActivatedRoute, Router } from '@angular/router';
import { GuestStayEdit } from '../../../_models/guestStayEdit';
import { Building } from '../../../_models/building';

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
              private gueststayService: GueststayService,
              private router: Router,
              private route: ActivatedRoute
            ) { }

  ngOnInit() {
    // TODO put the request into a resolver
    if (!this.gueststayService.isGuestInfoValid) {
      this.router.navigate(['../'], { relativeTo: this.route });
    }
    this.loadBuildings();

    if (this.gueststayService.guestStay.room != null) {
      this.onRoomSelected(this.gueststayService.guestStay.room);
    }
  }

  ngOnDestroy() {
    this.gueststayService.saveRoomSelection(this.selectedRoom);
  }

  loadBuildings() {
    this.buildingService.buildingDashboardData().subscribe((buildingDashboard: BuildingTable) => {
      this.buildingDashboard = buildingDashboard;
    }, error => {
      this.alertify.error(error);
    });
  }

  onClickBuilding(building: Building) {
    this.gueststayService.guestStay.building = building;
    this.buildingSelectedId = building.id;
    this.loadRooms();
  }

  loadRooms() {
    if (this.pagination == null) {
      this.gueststayService.getAvaliableRooms(this.pageNumber, this.pageSize, this.buildingSelectedId, true)
      .subscribe((paginatedResult: PaginatedResult<Room[]>) => {
        this.rooms = paginatedResult.result;
        this.pagination = paginatedResult.pagination;
      }, error => {this.alertify.error(error); });
    } else {
      this.gueststayService.getAvaliableRooms(this.pagination.currentPage, this.pagination.itemsPerPage, this.buildingSelectedId, true)
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
    this.gueststayService.getGuestStays({roomId: room.id, currentStaysOnly: true }).subscribe(
      (guestStays: GuestStayEdit[]) =>  {
        if (guestStays.filter(g => g.guest.gender != this.gueststayService.guestStay.gender).length > 0) {
          this.alertify.error('Room has guest of opposite gender');
          this.gueststayService.hasGenderConfliction = true;
        }
      }
    );     
      this.selectedRoom = room;
      this.gueststayService.setIsRoomSelected(true);
    }
  }

  onRoomRemoved(room: Room) {
    this.selectedRoom = null;
    this.gueststayService.setIsRoomSelected(false);
  }

}
