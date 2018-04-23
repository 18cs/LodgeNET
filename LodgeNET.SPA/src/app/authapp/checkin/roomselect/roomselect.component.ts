import { Component, OnInit } from '@angular/core';
import { BuildingService } from '../../../_services/building.service';
import { BuildingDashboard } from '../../../_models/buildingDashboard';
import { AlertifyService } from '../../../_services/alertify.service';
import { GueststayService } from '../../../_services/gueststay.service';
import { PaginatedResult } from '../../../_models/pagination';
import { Room } from '../../../_models/room';

@Component({
  selector: 'app-roomselect',
  templateUrl: './roomselect.component.html',
  styleUrls: ['./roomselect.component.css']
})
export class RoomselectComponent implements OnInit {

  buildingDashboard: BuildingDashboard;
  buildingTypeIdSelected = 1;

  pageSize = 25;
  pageNumber = 1;

  rooms: Room[];

  constructor(private buildingService: BuildingService, private alertify: AlertifyService, private guestStayService: GueststayService) { }

  yup(){
    console.log('yupyupyup');
    }

  ngOnInit() {
    //TODO put the request into a resolver
    this.loadBuildings();
  }

  loadBuildings() {
    this.buildingService.buildingDashboardData().subscribe((buildingDashboard: BuildingDashboard) => {
      this.buildingDashboard = buildingDashboard;
    }, error => {
      this.alertify.error(error);
    });
  }

  onClickGetRooms(buildingId: number) {
    this.guestStayService.getRooms(this.pageNumber, this.pageSize).subscribe((paginatedResult: PaginatedResult<Room[]>) => {
      this.rooms = paginatedResult.result;
      console.log(this.rooms);
    }, error => {this.alertify.error(error);});
  }

}
