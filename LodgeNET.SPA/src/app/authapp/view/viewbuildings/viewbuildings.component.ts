import { Component, OnInit } from '@angular/core';
import { AlertifyService } from '../../../_services/alertify.service';
import { BuildingService } from '../../../_services/building.service';
import { Building } from '../../../_models/building';
import { BuildingTable } from '../../../_models/buildingTable';


@Component({
  selector: 'app-viewbuildings',
  templateUrl: './viewbuildings.component.html',
  styleUrls: ['./viewbuildings.component.css']
})
export class ViewbuildingsComponent implements OnInit {
  buildingDashboard: BuildingTable;

  isLodgingOpen = false;
  isUnaccompaniedHousingOpen = false;
  isVacentHousingOpen = false;
  isEmergencyQuartersOpen = false;

  constructor(
    private buildingService: BuildingService,
    private alertify: AlertifyService
  ) { }

  ngOnInit() {
    this.loadBuildings();
  }

  loadBuildings() {
    this.buildingService.buildingDashboardData().subscribe(
      (buildingDashboard: BuildingTable) => {
        // console.log(buildingDashboard);
        this.buildingDashboard = buildingDashboard;
      },
      error => {
        this.alertify.error(error);
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
  }

  getOccupancyRate(currentGuests, capacity) {
    return capacity === 0 ? 0 : currentGuests / capacity * 100;
  }

  getTotalOccupancyRate() {
    let totalCapacity = 0;
    let totalCurrentGuest = 0;

    this.buildingDashboard.buildingTypeList.forEach(type => {
      totalCurrentGuest += type.currentGuests;
      totalCapacity += type.capacity;
    });

    return (totalCurrentGuest / totalCapacity * 100).toFixed(2);
  }

  getTotalOccupancy() {
    let totalCapacitys = 0;
    let totalCurrentGuests = 0;

    this.buildingDashboard.buildingTypeList.forEach(cat => {
      totalCurrentGuests += cat.currentGuests;
      totalCapacitys += cat.capacity;
    });

    return totalCurrentGuests + ' / ' + totalCapacitys;
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