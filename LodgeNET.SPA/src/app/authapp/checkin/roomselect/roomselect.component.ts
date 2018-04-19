import { Component, OnInit } from '@angular/core';
import { BuildingService } from '../../../_services/building.service';
import { BuildingDashboard } from '../../../_models/buildingDashboard';
import { AlertifyService } from '../../../_services/alertify.service';

@Component({
  selector: 'app-roomselect',
  templateUrl: './roomselect.component.html',
  styleUrls: ['./roomselect.component.css']
})
export class RoomselectComponent implements OnInit {

  buildingDashboard: BuildingDashboard;

  constructor(private buildingService: BuildingService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.loadBuildings();
  }

  loadBuildings() {
    this.buildingService.buildingDashboardData().subscribe((buildingDashboard: BuildingDashboard) => {
      this.buildingDashboard = buildingDashboard;
    }, error => {
      this.alertify.error(error);
    });
  }

}
