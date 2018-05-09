import { Component, OnInit } from '@angular/core';
import { AlertifyService } from '../../../_services/alertify.service';
import { BuildingService } from '../../../_services/building.service';
import { Building } from '../../../_models/building';
import { BuildingTable } from '../../../_models/buildingTable';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { BuildingsdialogComponent } from '../dialogcomponents/buildingsdialog/buildingsdialog.component';

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
    private alertify: AlertifyService,
    private dialog: MatDialog
  ) {}

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

  editBuilding(buildingId) {}

  openDialog(bldg) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      building: bldg
    };

    console.log(dialogConfig.data);

    const dialogRef = this.dialog.open(BuildingsdialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(data => {
      console.log(data);
      if (data != null) {
        this.buildingService.saveBuildingEdit(data).subscribe(
          success => {
            console.log(data);
            this.alertify.success(data.name + ' successfully updated.');
            console.log(success);
          },
          error => {
            console.log(error);
          }
        );
      }
    });
  }

  deleteBuildingById(bldg) {
    console.log(bldg.id);
    if (bldg != null) {
      this.alertify.confirm(
        'Are you sure you wish to delete ' + bldg.name + '? <br /> <br /> WARNING: All rooms and stays of this building will be deleted.',
        () => {
          this.buildingService.deleteBuildingById(bldg.id).subscribe(
            success => {
              this.alertify.success(bldg.name + ' successfully deleted.');
              let bldgIndex = this.buildingDashboard.buildingList.indexOf(bldg);

              if (bldgIndex != -1)
              {
                this.buildingDashboard.buildingList.splice(bldgIndex, 1);
              }
            },
            error => {
              console.log(error);
            }
          );
        }
      );
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
