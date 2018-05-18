import { Component, OnInit } from '@angular/core';
import { AlertifyService } from '../../../_services/alertify.service';
import { GueststayService } from '../../../_services/gueststay.service';
import { Guest } from '../../../_models/guest';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { GuestStayCheckOut } from '../../../_models/guestStayCheckOut';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Data } from '@angular/router';
import { PaginatedResult, Pagination } from '../../../_models/pagination';
import { FormData } from '../../../_models/formData';
import { Service } from '../../../_models/service';
import { Rank } from '../../../_models/rank';
import { Unit } from '../../../_models/unit';
import { Observable } from 'rxjs/Observable';
import {map, startWith} from 'rxjs/operators';
import { GuestParams } from '../../../_models/params/guestParams';
import { GueststaydialogComponent } from '../dialogcomponents/gueststaydialog/gueststaydialog.component';

@Component({
  selector: 'app-viewguests',
  templateUrl: './viewguests.component.html',
  styleUrls: ['./viewguests.component.css']
})
export class ViewguestsComponent implements OnInit {
  filterGuestForm: FormGroup;
  formData: FormData;
  guestList: Guest[];
  guestStayList: GuestStayCheckOut[];
  selectedGuest: Guest;
  selectedGuestStay: GuestStayCheckOut;
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
    private route: ActivatedRoute
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
      this.guestStayService.getGuests(this.pageNumber, this.pageSize, this.filterParams)
        .subscribe((paginatedResult: PaginatedResult<Guest[]>) => {
          this.showSpinner = false;
          this.guestList = paginatedResult.result;
          this.pagination = paginatedResult.pagination;
        }, error => { this.alertify.error(error); });
    } else {
      this.guestStayService.getGuests(this.pagination.currentPage, this.pagination.itemsPerPage, this.filterParams)
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

  openGuestStayDialog(guestStay: GuestStayCheckOut) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      guestStay: guestStay
    };

    const dialogRef = this.dialog.open(GueststaydialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(data => {
      console.log(data);
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
      })
  }

  loadGuestStays(guestId: number) {
    this.guestStayService.getGuestStays(null, null, null, guestId).subscribe(
      (guestStayList: GuestStayCheckOut[]) => {
        console.log(guestStayList);
        this.guestStayList = guestStayList;
      },
      error => {
        this.alertify.error(error);
      }
    );
  }

}
