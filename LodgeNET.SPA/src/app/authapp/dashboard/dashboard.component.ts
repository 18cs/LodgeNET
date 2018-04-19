import { Component, OnInit } from '@angular/core';
import { AlertifyService } from '../../_services/alertify.service';
import { BuildingService } from '../../_services/building.service';
import { Building } from '../../_models/building';
import { BuildingDashboard } from '../../_models/buildingDashboard';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
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
