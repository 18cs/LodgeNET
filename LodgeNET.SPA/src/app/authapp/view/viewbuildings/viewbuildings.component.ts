import { Component, OnInit } from '@angular/core';
import { AlertifyService } from '../../../_services/alertify.service';
import { BuildingService } from '../../../_services/building.service';
import { Building } from '../../../_models/building';
import { BuildingTable } from '../../../_models/buildingTable';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { BuildingsdialogComponent } from '../dialogcomponents/buildingsdialog/buildingsdialog.component';
import { Pagination, PaginatedResult } from '../../../_models/pagination';
import { BuildingCategory } from '../../../_models/buildingCategory';
import { BuildingParams } from '../../../_models/params/buildingParams';

@Component({
  selector: 'app-viewbuildings',
  templateUrl: './viewbuildings.component.html',
  styleUrls: ['./viewbuildings.component.css']
})
export class ViewbuildingsComponent implements OnInit {
  buildingList: Building[];
  buildingTypeList: BuildingCategory[];
  pageSize = 10;
  pageNumber = 1;
  pagination: Pagination;
  showSpinner = false;
  filterParams: BuildingParams;  

  // isLodgingOpen = false;
  // isUnaccompaniedHousingOpen = false;
  // isVacentHousingOpen = false;
  // isEmergencyQuartersOpen = false;

  constructor(
    private buildingService: BuildingService,
    private alertify: AlertifyService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadBuildings();
    this.getAllBuildingTypes();
    this.initFilterParams();
  }

  loadBuildings() {
    this.showSpinner = true;
    if (this.pagination == null) {
      this.buildingService.getBuildings(this.pageNumber, this.pageSize, this.filterParams)
        .subscribe((paginatedResult: PaginatedResult<Building[]>) => {
          this.buildingList = paginatedResult.result;
          this.showSpinner = false;
          this.pagination = paginatedResult.pagination;
        }, error => { 
          this.alertify.error(error); 
          this.showSpinner = false;
        });
    } else {
      this.buildingService.getBuildings(this.pagination.currentPage, this.pagination.itemsPerPage, this.filterParams)
        .subscribe((paginatedResult: PaginatedResult<Building[]>) => {
          this.buildingList = paginatedResult.result;
          this.showSpinner = false;
          this.pagination = paginatedResult.pagination;
        }, error => { 
          this.alertify.error(error); 
          this.showSpinner = false;
        });
    }
  }

  getAllBuildingTypes() {
    this.buildingService.getAllBuildingTypes().subscribe(
        (buildingTypeList: BuildingCategory[]) => {
          this.buildingTypeList = buildingTypeList;
        },
        error => {
          this.alertify.error(error);
        }
      );
  }

  initFilterParams() {
    this.filterParams = { buildingCategoryId: null } as BuildingParams
  }

  onSearch() {
    this.loadBuildings();
  }

  onReset() {
    this.initFilterParams();
    this.loadBuildings();
  }

  // tableCollapseToggle(buildingId: number) {
  //   if (buildingId === 1) {
  //     this.isLodgingOpen = !this.isLodgingOpen;
  //   } else if (buildingId === 2) {
  //     this.isVacentHousingOpen = !this.isVacentHousingOpen;
  //   } else if (buildingId === 3) {
  //     this.isUnaccompaniedHousingOpen = !this.isUnaccompaniedHousingOpen;
  //   } else if (buildingId === 4) {
  //     this.isEmergencyQuartersOpen = !this.isEmergencyQuartersOpen;
  //   }
  // }

  openAddDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      title: 'Add Building',
      buildingTypeList: this.buildingTypeList,
      building: {
        number: null,
        name: '',
        buildingCategoryId: null,
        currentGuests: 0,
        capacity: 0
    } as Building
    };

    const dialogRef = this.dialog.open(BuildingsdialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(data => {
      if (data != null) {
        this.buildingService.addBuilding(data).subscribe(
          success => {
            this.alertify.success(data.name + ' successfully added.');
            this.loadBuildings();
          },
          error => {
            this.alertify.error(error);
          }
        );
      }
    });
  }

  openDialog(bldg) {
    const dialogConfig = new MatDialogConfig();
    
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      title: 'Edit ' + bldg.name,
      building: bldg,
      buildingTypeList: this.buildingTypeList
    };

    const dialogRef = this.dialog.open(BuildingsdialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(data => {
      if (data != null) {
        this.buildingService.saveBuildingEdit(data).subscribe(
          success => {
            this.alertify.success(data.name + ' successfully updated.');
          },
          error => {
            this.alertify.error(error);
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
              let bldgIndex = this.buildingList.indexOf(bldg);

              if (bldgIndex !== -1)
              {
                this.buildingList.splice(bldgIndex, 1);
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

  // OLD CODE
  //
  // getOccupancyRate(currentGuests, capacity) {
  //   return capacity === 0 ? 0 : currentGuests / capacity * 100;
  // }

  // getTotalOccupancyRate() {
  //   let totalCapacity = 0;
  //   let totalCurrentGuest = 0;

  //   this.buildingDashboard.buildingTypeList.forEach(type => {
  //     totalCurrentGuest += type.currentGuests;
  //     totalCapacity += type.capacity;
  //   });

  //   return (totalCurrentGuest / totalCapacity * 100).toFixed(2);
  // }

  // getTotalOccupancy() {
  //   let totalCapacitys = 0;
  //   let totalCurrentGuests = 0;

  //   this.buildingDashboard.buildingTypeList.forEach(cat => {
  //     totalCurrentGuests += cat.currentGuests;
  //     totalCapacitys += cat.capacity;
  //   });

  //   return totalCurrentGuests + ' / ' + totalCapacitys;
  // }

  // showConditionCheck(buildingId: number) {
  //   if (buildingId === 1) {
  //     return this.isLodgingOpen;
  //   } else if (buildingId === 2) {
  //     return this.isVacentHousingOpen;
  //   } else if (buildingId === 3) {
  //     return this.isUnaccompaniedHousingOpen;
  //   } else {
  //     return this.isEmergencyQuartersOpen;
  //   }
  // }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadBuildings();
  }
}
