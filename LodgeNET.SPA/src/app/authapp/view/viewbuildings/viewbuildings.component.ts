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
import { AuthService } from '../../../_services/auth.service';
import { BuildingDisplay } from '../../../_models/display/buildingDisplay';
import { FileexportService } from '../../../_services/fileexport.service';

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
  showSpinner = true;
  filterParams: BuildingParams;

  // isLodgingOpen = false;
  // isUnaccompaniedHousingOpen = false;
  // isVacentHousingOpen = false;
  // isEmergencyQuartersOpen = false;

  constructor(
    private buildingService: BuildingService,
    private alertify: AlertifyService,
    private dialog: MatDialog,
    public authService: AuthService,
    private fileExport: FileexportService
  ) {}

  ngOnInit() {
    this.loadBuildings();
    this.getAllBuildingTypes();
    this.initFilterParams();
  }

  loadBuildings() {
    this.showSpinner = true;
    if (this.pagination == null) {
      this.buildingService.getBuildingsPagination(this.pageNumber, this.pageSize, this.filterParams)
        .subscribe((paginatedResult: PaginatedResult<Building[]>) => {
          this.buildingList = paginatedResult.result;
          this.showSpinner = false;
          this.pagination = paginatedResult.pagination;
        }, error => { 
          this.alertify.error(error); 
          this.showSpinner = false;
        });
    } else {
      this.buildingService.getBuildingsPagination(this.pagination.currentPage, this.pagination.itemsPerPage, this.filterParams)
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
    this.buildingService.getBuildingTypes().subscribe(
        (buildingTypeList: BuildingCategory[]) => {
          this.buildingTypeList = buildingTypeList;
        },
        error => {
          this.alertify.error(error);
        }
      );
  }

  initFilterParams() {
    this.filterParams = { buildingCategoryId: null } as BuildingParams;
  }

  onSearch() {
    this.pagination.currentPage = 1;
    this.loadBuildings();
  }

  onReset() {
    this.initFilterParams();
    this.loadBuildings();
  }

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
              this.alertify.error(error);
            }
          );
        }
      );
    }
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadBuildings();
  }

  exportAsXLSX(): void {
    this.buildingService.getBuildingsDisplay (this.filterParams)
      .subscribe((buildings: BuildingDisplay[]) => {
        this.fileExport.exportAsExcelFile(buildings, 'Buildings_Report');
      }, error => { this.alertify.error(error);});
  }
}
