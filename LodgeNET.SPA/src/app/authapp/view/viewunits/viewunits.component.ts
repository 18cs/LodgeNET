import { Component, OnInit } from '@angular/core';
import { AlertifyService } from '../../../_services/alertify.service';
import { PaginatedResult, Pagination } from '../../../_models/pagination';
import { Unit } from '../../../_models/unit';
import { UnitsService } from '../../../_services/units.service';
import { ActivatedRoute, Data } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { UnitdialogComponent } from '../dialogcomponents/unitdialog/unitdialog.component';

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

  constructor(
    private unitsService: UnitsService, 
    private alertify: AlertifyService,
    private route: ActivatedRoute,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.loadUnits()
    this.route.data.subscribe((data: Data) => {
      this.filterUnits = data['units'];
    });

    console.log(this.filterUnits);
  }

  loadUnits() {
    if (this.pagination == null) {
      this.unitsService.getUnitsPag(this.pageNumber, this.pageSize)
        .subscribe((paginatedResult: PaginatedResult<Unit[]>) => {
          this.units = paginatedResult.result;
          console.log(this.units);
          this.pagination = paginatedResult.pagination;
        }, error => { this.alertify.error(error); });
    } else {
      this.unitsService.getUnitsPag(this.pagination.currentPage, this.pagination.itemsPerPage)
        .subscribe((paginatedResult: PaginatedResult<Unit[]>) => {
          this.units = paginatedResult.result;
          console.log(this.units);
          this.pagination = paginatedResult.pagination;
        }, error => { this.alertify.error(error); });
    }
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadUnits();
  }

  onDelete(unit: Unit) {

  }

  openUnitDialog(unit: Unit) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      unit: unit,
      units: this.filterUnits
    };

    const dialogRef = this.dialog.open(UnitdialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(data => {
      console.log(data);
      if (data != null) {
        this.unitsService.updateUnit(data).subscribe(
          success => {
            this.alertify.success('stay successfully updated.');
          },
          error => {
            this.alertify.error(error);
          }
        );
      }
    });
  }

}
