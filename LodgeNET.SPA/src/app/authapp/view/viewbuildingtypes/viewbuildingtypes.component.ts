import { Component, OnInit } from '@angular/core';
import { AlertifyService } from '../../../_services/alertify.service';
import { BuildingService } from '../../../_services/building.service';
import { BuildingType } from '../../../_models/buildingType';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { BuildingtypesdialogComponent } from '../dialogcomponents/buildingtypesdialog/buildingtypesdialog.component';
import { Pagination, PaginatedResult } from '../../../_models/pagination';

@Component({
  selector: 'app-viewbuildingtypes',
  templateUrl: './viewbuildingtypes.component.html',
  styleUrls: ['./viewbuildingtypes.component.css']
})
export class ViewbuildingtypesComponent implements OnInit {
  buildingTypeList: BuildingType[];
  selectedBuildingType: BuildingType;
  pageSize = 10;
  pageNumber = 1;
  pagination: Pagination;

  constructor(
    private buildingService: BuildingService,
    private alertify: AlertifyService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadBuildingTypes();
  }

  loadBuildingTypes() {
    if (this.pagination == null) {
      this.buildingService.getBuildingTypes(this.pageNumber, this.pageSize)
        .subscribe((paginatedResult: PaginatedResult<BuildingType[]>) => {
          this.buildingTypeList = paginatedResult.result;
          console.log(paginatedResult.pagination);
          this.pagination = paginatedResult.pagination;
        }, error => { this.alertify.error(error); });
    } else {
      this.buildingService.getBuildingTypes(this.pagination.currentPage, this.pagination.itemsPerPage)
        .subscribe((paginatedResult: PaginatedResult<BuildingType[]>) => {
          this.buildingTypeList = paginatedResult.result;
          console.log(this.buildingTypeList);
          this.pagination = paginatedResult.pagination;
        }, error => { this.alertify.error(error); });
    }

    // OLD CODE
    //
    // this.buildingService.getBuildingTypes().subscribe(
    //   (buildingTypeList: BuildingType[]) => {
    //     this.buildingTypeList = buildingTypeList;
    //   },buildingTypeList
    //   error => {
    //     this.alertify.error(error);
    //   }
    // );
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadBuildingTypes();
  }

  onBuildingTypeSelect(buildingType: BuildingType) {
    this.selectedBuildingType = buildingType;
  }

  openDialog(buildingType) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      title: 'Edit ' + buildingType.type,
      buildingType: buildingType
    };

    console.log(dialogConfig.data);

    const dialogRef = this.dialog.open(BuildingtypesdialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(data => {
      console.log(data);
      if (data != null) {
        this.buildingService.saveBuildingTypeEdit(data).subscribe(
          success => {
            console.log(data);
            this.alertify.success(data.type + ' successfully updated.');
            console.log(success);
          },
          error => {
            console.log(error);
          }
        );
      }
    });
  }

  openAddDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      title: 'Add Building Type',
      buildingType: {
        type: ''
    } as BuildingType
    };

    console.log(dialogConfig.data);

    const dialogRef = this.dialog.open(BuildingtypesdialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(data => {
      console.log('Adding' + data);
      if (data != null) {
        this.buildingService.addBuildingType(data).subscribe(
          success => {
            console.log(data);
            this.alertify.success(data.type + ' successfully added.');
            this.loadBuildingTypes();
            console.log(success);
          },
          error => {
            console.log(error);
          }
        );
      }
    });
  }

  deleteBuildingType(buildingType) {
    if (buildingType != null) {
      console.log(buildingType);
      this.alertify.confirm(
        'Are you sure you wish to delete ' + buildingType.type + '? <br /> <br /> WARNING: All buildings and rooms of this building type will be deleted.',
        () => {
          this.buildingService.deleteBuildingTypeById(buildingType.id).subscribe(
            success => {
              this.alertify.success(buildingType.type + ' successfully deleted.');
              let bldgTypeIndex = this.buildingTypeList.indexOf(buildingType);

              if (bldgTypeIndex !== -1)
              {
                this.buildingTypeList.splice(bldgTypeIndex, 1);
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

}
