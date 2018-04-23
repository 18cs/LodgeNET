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

  isLodgingOpen = false;
  isUnaccompaniedHousingOpen = false;
  isVacentHousingOpen = false;
  isEmergencyQuartersOpen = false;

   totalCapcity;
   totalCurrentGuest;

  constructor(private buildingService: BuildingService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.loadBuildings();
  }

  loadBuildings() {
    this.buildingService.buildingDashboardData().subscribe((buildingDashboard: BuildingDashboard) => {
      console.log(buildingDashboard);
      this.buildingDashboard = buildingDashboard;
    }, error => {
      this.alertify.error(error);
    });
  }

  tableCollapseToggle(buildingId: number) {
    console.log(buildingId);
    if (buildingId === 1) {
      this.isLodgingOpen = !this.isLodgingOpen;
    } else if (buildingId === 2) {
      this.isVacentHousingOpen = !this.isVacentHousingOpen;
    } else if (buildingId === 3) {
      this.isUnaccompaniedHousingOpen = !this.isUnaccompaniedHousingOpen;
    } else if (buildingId === 4) {
      this.isEmergencyQuartersOpen = !this.isEmergencyQuartersOpen;
    }



    // isLodgingOpen = false;
    // isUnaccompaniedHousingOpen = false;
    // isVacentHousing = false;
    // isEmergencyQuartersOpen = false;

  }

  getOccupancyRate(currentGuests, capacity) {
    return (capacity === 0) ? 0 : (currentGuests / capacity) * 100;
  }

  getTotalOccupancyRate() {
    this.buildingDashboard.buildingTypeList.forEach(type => {
      this.totalCurrentGuest = this.totalCurrentGuest + type.currentGuests;
      this.totalCapcity = this.totalCapcity + type.capacity;
    });

    return this.totalCurrentGuest /  this.totalCapcity;
  }


  showConditionCheck(buildingId: number) {
    if (buildingId === 1) {
      return this.isLodgingOpen;
    } else if (buildingId === 2) {
      return this.isVacentHousingOpen;
    } else if (buildingId === 3) {
      return this.isUnaccompaniedHousingOpen;
    } else {
      return this.isEmergencyQuartersOpen;
    }
  }
}
