import { Component, OnInit } from '@angular/core';
import { AlertifyService } from '../../../_services/alertify.service';
import { GueststayService } from '../../../_services/gueststay.service';
import { Guest } from '../../../_models/guest';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { GuestStayEdit } from '../../../_models/guestStayEdit';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Data } from '@angular/router';
import { PaginatedResult, Pagination } from '../../../_models/pagination';
import { FormData } from '../../../_models/formData';
import { Service } from '../../../_models/service';
import { Rank } from '../../../_models/rank';
import { Unit } from '../../../_models/unit';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { GuestParams } from '../../../_models/params/guestParams';
import { GueststaydialogComponent } from '../dialogcomponents/gueststaydialog/gueststaydialog.component';
import { AuthService } from '../../../_services/auth.service';
import { GuestStayParams } from '../../../_models/params/guestStayParams';
import { GuestDisplay } from '../../../_models/display/guestDisplay';
import { FileexportService } from '../../../_services/fileexport.service';

@Component({
  selector: 'app-viewguests',
  templateUrl: './viewguests.component.html',
  styleUrls: ['./viewguests.component.css']
})
export class ViewguestsComponent implements OnInit {
  filterGuestForm: FormGroup;
  formData: FormData;
  guestList: Guest[];
  guestStayList: GuestStayEdit[];
  selectedGuest: Guest;
  selectedGuestStay: GuestStayEdit;
  // type: string;
  showSpinner = false;
  pageSize = 10;
  pageNumber = 1;
  pagination: Pagination;
  genderList = [{ value: 'Male'}, { value: 'Female'}];
  unitName = new FormControl();
  unitFileValue = '';
  filteredOptions: Observable<Unit[]>;
  filterParams: GuestParams = {lastName: '', serviceId: 0, rankId: 0, gender: '', dodId: 0, unitId: 0};
  // // filter
  selectedService: Service;
  // selectedRank: Rank;
  // lastNameFilter: string;
  // genderFilter: string;
  // dodIdFilter: number;
  selectedUnit: Unit;

  constructor(
    private guestStayService: GueststayService,
    private alertify: AlertifyService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private authService: AuthService,
    private fileExport: FileexportService
  ) {}


  ngOnInit() {
    this.loadGuests();
    this.initFilterParams();
    this.route.data.subscribe((data: Data) => {
      this.formData = data['formData'];
    });

    this.filteredOptions = this.unitName.valueChanges
    .pipe(
      startWith(''),
      map(val => this.unitFilter(val))
    );
  }

  initFilterParams() {
    this.filterParams = {lastName: '', serviceId: 0, rankId: 0, gender: '', dodId: null, unitId: 0};
  }

  onSearch() {
    if(this.selectedUnit != null) {
      this.filterParams.unitId = this.selectedUnit.id;
    }

    if (this.selectedService != null) {
      this.filterParams.serviceId = this.selectedService.id;
    }
    this.pagination.currentPage = 1;
    this.loadGuests();
  }

  onReset() {
    this.initFilterParams();
    this.selectedService = null;
    this.selectedUnit = null;
    this.unitFileValue = '';
    this.loadGuests();
  }

  getGuestStays(guestId: number) {
    this.loadGuestStays(guestId);
  }

  unitFilter(val: string): Unit[] {
    return this.formData.unitList.filter(unit =>
      unit.name.toLowerCase().includes(val.toLowerCase()));
  }

  onUnitSelected(unit: Unit) {
    this.selectedUnit = unit;
  }

  loadGuests() {
    this.showSpinner = true;
    if (this.pagination == null) {
      this.guestStayService.getGuestsPagination(this.pageNumber, this.pageSize, this.filterParams)
        .subscribe((paginatedResult: PaginatedResult<Guest[]>) => {
          this.showSpinner = false;
          this.guestList = paginatedResult.result;
          this.pagination = paginatedResult.pagination;
        }, error => { this.alertify.error(error); });
    } else {
      this.guestStayService.getGuestsPagination(this.pagination.currentPage, this.pagination.itemsPerPage, this.filterParams)
        .subscribe((paginatedResult: PaginatedResult<Guest[]>) => {
          this.showSpinner = false;
          this.guestList = paginatedResult.result;
          this.pagination = paginatedResult.pagination;
        }, error => { this.alertify.error(error); });
    }
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadGuests();
  }

  onGuestSelect(guest: Guest) {
    this.selectedGuest = guest;
  }

  openGuestStayDialog(guestStay: GuestStayEdit) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      guestStay: guestStay
    };

    const dialogRef = this.dialog.open(GueststaydialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(data => {
      if (data != null) {
        this.guestStayService.updateGuestStay(data).subscribe(
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

  onDelete(guest: Guest) {
    this.alertify.confirm(
      'Are you sure you wish to delete ' + guest.firstName + ' ' + guest.lastName +
      '? <br /> <br /> WARNING: All stays of this guest will be deleted.',
      () => {
        this.guestStayService.deleteGuest(guest.id).subscribe(
          () => {
            this.alertify.success( guest.firstName + ' ' + guest.lastName + ' successfully deleted');
            let guestIndex = this.guestList.indexOf(guest);

            if (guestIndex !== -1) {
              this.guestList.splice(guestIndex, 1);
            }
          },
          error => this.alertify.error(error)
        );
      });
  }

  loadGuestStays(guestId: number) {
    this.guestStayService.getGuestStays({guestId: guestId} as GuestStayParams).subscribe(
      (guestStayList: GuestStayEdit[]) => {
        this.guestStayList = guestStayList;
      },
      error => {
        this.alertify.error(error);
      }
    );
  }

  exportAsXLSX(): void {
    this.guestStayService.getGuestsDisplay (this.filterParams)
      .subscribe((guests: GuestDisplay[]) => {
        this.fileExport.exportAsExcelFile(guests, 'Guests_Report');
      }, error => { this.alertify.error(error);});
  }
}
