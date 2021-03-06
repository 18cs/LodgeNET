import { Component, OnInit } from '@angular/core';
import { AlertifyService } from '../../../_services/alertify.service';
import { PaginatedResult, Pagination } from '../../../_models/pagination';
import { Unit } from '../../../_models/unit';
import { UnitsService } from '../../../_services/units.service';
import { ActivatedRoute, Data } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { UnitdialogComponent } from '../dialogcomponents/unitdialog/unitdialog.component';
import { UnitParams } from '../../../_models/params/unitParams';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { AuthService } from '../../../_services/auth.service';
import { FileexportService } from '../../../_services/fileexport.service';
import { UnitDisplay } from '../../../_models/display/unitDisplay';

@Component({
  selector: 'app-viewunits',
  templateUrl: './viewunits.component.html',
  styleUrls: ['./viewunits.component.css']
})
export class ViewunitsComponent implements OnInit {
  units: Unit[];
  pageSize = 10;
  pageNumber = 1;
  pagination: Pagination;

  filterUnits: Unit[];
  showSpinner = false;
  filterParams: UnitParams;
  filteredOptions: Observable<Unit[]>;
  parentUnitName = new FormControl();
  parentUnitValue = '';
  selectedParentUnit: Unit;

  constructor(
    private unitsService: UnitsService,
    private alertify: AlertifyService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    public authService: AuthService,
    private fileExport: FileexportService
  ) { }

  ngOnInit() {
    this.initFilterParams();
    this.loadUnits();
    this.route.data.subscribe((data: Data) => {
      this.filterUnits = data['units'];
    });

    this.filteredOptions = this.parentUnitName.valueChanges
    .pipe(
      startWith(''),
      map(val => this.unitFilter(val))
    );
  }

  initFilterParams() {
    this.filterParams = { includeParentUnit: true,  };
  }

  loadUnits() {
    this.showSpinner = true;
    if (this.pagination == null) {
      this.unitsService.getUnitsPagination(this.pageNumber, this.pageSize, this.filterParams)
        .subscribe((paginatedResult: PaginatedResult<Unit[]>) => {
          this.units = paginatedResult.result;
          this.showSpinner = false;
          this.pagination = paginatedResult.pagination;
        }, error => {
          this.alertify.error(error);
          this.showSpinner = false;
        });
    } else {
      this.unitsService.getUnitsPagination(this.pagination.currentPage, this.pagination.itemsPerPage, this.filterParams)
        .subscribe((paginatedResult: PaginatedResult<Unit[]>) => {
          this.units = paginatedResult.result;
          this.showSpinner = false;
          this.pagination = paginatedResult.pagination;
        }, error => {
          this.alertify.error(error);
          this.showSpinner = false;
        });
    }

    this.showSpinner = true;
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadUnits();
  }

  onDelete(unit: Unit) {
    if (unit != null) {
      this.alertify.confirm(
        'Are you sure you wish to delete ' + unit.name + '? <br /> <br /> WARNING: All units and guests under this unit will be deleted.',
        () => {
          this.unitsService.deleteUnit(unit.id).subscribe(
            success => {
              this.alertify.success(unit.name + ' successfully deleted.');
              let unitIndex = this.units.indexOf(unit);

              if (unitIndex !== -1)
              {
                this.units.splice(unitIndex, 1);
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

  onSearch() {
    if (this.selectedParentUnit != null) {
      this.filterParams.parentUnitId = this.selectedParentUnit.id;
    }
    this.pagination.currentPage = 1;
    this.loadUnits();
  }

  onReset() {
    // this.initFilterParams();
    this.selectedParentUnit = null;
    this.parentUnitValue = '';
    this.initFilterParams();
    this.loadUnits();
  }

  unitFilter(val: string): Unit[] {
    return this.filterUnits.filter(unit =>
      (unit.name.toLowerCase().includes(val.toLowerCase()) || unit.unitAbbreviation.toLowerCase().includes(val.toLowerCase()))); //ABBREVIATION SEARCH
  }

  onUnitSelected(unit: Unit) {
    this.selectedParentUnit = unit;
  }

  openUnitDialog(unit: Unit) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      title: 'Edit ' + unit.name,
      unit: unit,
      units: this.filterUnits
    };

    const dialogRef = this.dialog.open(UnitdialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(data => {
      if (data != null) {
        this.unitsService.updateUnit(data).subscribe(
          success => {
            this.alertify.success(unit.name + ' successfully updated.');
          },
          error => {
            this.alertify.error(error);
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
      title: 'Add Unit',
      unit: {
        name: '',
        parentUnit: null,
        parentUnitId: null,
        unitAbbreviation: ''
        } as Unit,
        units: this.filterUnits
    };

    const dialogRef = this.dialog.open(UnitdialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(data => {
      if (data != null) {
        this.unitsService.addUnit(data).subscribe(
          success => {
            this.alertify.success(data.name + ' successfully added.');
            this.loadUnits();
          },
          error => {
            this.alertify.error(error);
          }
        );
      }
    });
  }

  exportAsXLSX(): void {
    this.unitsService.getUnitsDisplay(this.filterParams)
      .subscribe((units: UnitDisplay[]) => {
        this.fileExport.exportAsExcelFile(units, 'Units_Report');
      }, error => { this.alertify.error(error);});
  }

}
