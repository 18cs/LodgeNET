import { Component, OnInit } from '@angular/core';
import { AlertifyService } from '../../_services/alertify.service';
import { BuildingService } from '../../_services/building.service';
import { Building } from '../../_models/building';
import { BuildingTable } from '../../_models/buildingTable';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  buildingDashboard: BuildingTable;

  isLodgingOpen = false;
  isUnaccompaniedHousingOpen = false;
  isVacentHousingOpen = false;
  isEmergencyQuartersOpen = false;
  showSpinner = true;

  constructor(
    private buildingService: BuildingService,
    private alertify: AlertifyService
  ) {}

  ngOnInit() {
    this.loadBuildings();
  }

  loadBuildings() {
    this.buildingService.buildingDashboardData().subscribe(
      (buildingDashboard: BuildingTable) => {
        this.buildingDashboard = buildingDashboard;
        this.showSpinner = false;
      },
      error => {
        this.alertify.error(error);
        this.showSpinner = false;
      }
    );
  }

  tableCollapseToggle(buildingId: number) {
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
    return capacity === 0 ? 0 : currentGuests / capacity * 100;
  }

  getTotalOccupancyRate() {
    let totalCapacity = 0;
    let totalCurrentGuest = 0;

    this.buildingDashboard.buildingTypeList.forEach(type => {
      totalCurrentGuest += type.currentGuests;

      //Check surge TODO
      totalCapacity += type.capacity;
    });

    return (totalCurrentGuest / totalCapacity * 100).toFixed(2);
  }

  getTotalOccupancyInHouse() {//TODO CHANGE THESE 3 METHODS
    let totalCurrentGuests = 0;

    this.buildingDashboard.buildingTypeList.forEach(cat => {
      totalCurrentGuests += cat.currentGuests;
    });

    return totalCurrentGuests;
  }

  getTotalOccupancyCapacity() {//TODO CHANGE THESE 3 METHODS
    let totalCapacitys = 0;

    this.buildingDashboard.buildingTypeList.forEach(cat => {
      totalCapacitys += cat.capacity;
    });

    return totalCapacitys;
  }

  getTotalOccupancySurgeCapacity() {//TODO CHANGE THESE 3 METHODS
    let totalSurgeCapacitys = 0;

    this.buildingDashboard.buildingTypeList.forEach(cat => {
      totalSurgeCapacitys += cat.surgeCapacity;
    });

    return totalSurgeCapacitys;
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
