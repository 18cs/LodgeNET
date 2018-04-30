import { Component, OnInit } from '@angular/core';
import { AlertifyService } from '../../../_services/alertify.service';
import { BuildingService } from '../../../_services/building.service';
import { Building } from '../../../_models/building';
import { BuildingDashboard } from '../../../_models/buildingDashboard';


@Component({
  selector: 'app-viewbuildings',
  templateUrl: './viewbuildings.component.html',
  styleUrls: ['./viewbuildings.component.css']
})
export class ViewbuildingsComponent implements OnInit {
  buildingDashboard: BuildingDashboard;

  constructor(
    private buildingService: BuildingService,
    private alertify: AlertifyService
  ) { }

  ngOnInit() {
    this.loadBuildings();
  }

  loadBuildings() {
    this.buildingService.buildingDashboardData().subscribe(
      (buildingDashboard: BuildingDashboard) => {
        // console.log(buildingDashboard);
        this.buildingDashboard = buildingDashboard;
      },
      error => {
        this.alertify.error(error);
      }
    );
  }

}
