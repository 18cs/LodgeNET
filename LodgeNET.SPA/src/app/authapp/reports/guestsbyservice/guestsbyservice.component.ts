import { Component, OnInit } from '@angular/core';
import { Pagination, PaginatedResult } from '../../../_models/pagination';
import { GuestStayParams } from '../../../_models/params/guestStayParams';
import { Observable } from 'rxjs/Observable';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { GuestStayEdit } from '../../../_models/guestStayEdit';
import { AlertifyService } from '../../../_services/alertify.service';
import { BuildingService } from '../../../_services/building.service';
import { GueststayService } from '../../../_services/gueststay.service';
import { AuthService } from '../../../_services/auth.service';
import { ActivatedRoute, Data } from '@angular/router';
import { Service } from '../../../_models/service';

@Component({
  selector: 'app-guestsbyservice',
  templateUrl: './guestsbyservice.component.html',
  styleUrls: ['./guestsbyservice.component.css']
})
export class GuestsbyserviceComponent implements OnInit {
  pageSize = 10;
  pageNumber = 1;
  pagination: Pagination;
  showSpinner = true;
  filterByService = false;
  filterParams: GuestStayParams;
  filteredOptions: Observable<Service[]>;
  serviceName = new FormControl();
  selectedService: Service;
  selectedServiceName: string;
  selectedServiceTitle: string;
  guestStayList: GuestStayEdit[];
  serviceList: Service[];
  formData: FormData;

  constructor(private guestStayService: GueststayService,
    private buildingService: BuildingService,
    private authService: AuthService,
    private alertify: AlertifyService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.loadGuests();
    // this.route.data.subscribe((data: Data) => {
    //   this.buildingList = data['buildings'];
    // });
    console.log('ss');
    this.route.data.subscribe((data: Data) => {
      this.serviceList = data['services'];
    });
    this.initFilterParams();

    this.filteredOptions = this.serviceName.valueChanges
    .pipe(
      startWith(''),
      map(val => this.serviceFilter(val))
    );
  }

  initFilterParams() {
    this.filterParams = { dodId: null, lastName: null, roomNumber: null, guestId: null, currentStaysOnly: true, buildingId: null };
  }

  serviceFilter(val: string): Service[] {
    return this.serviceList.filter(service =>
      service.serviceName.toLowerCase().includes(val.toLowerCase()));
  }

  onServiceSelected(service: Service) {
    this.selectedService = service;
  }

  onServiceFocusOut() {
    if(this.selectedService != null ) {
      this.selectedServiceName = this.selectedService.serviceName
    }
  }

  loadGuests() {
    this.showSpinner = true;
    if (this.pagination == null) {
      this.guestStayService.getGuestStaysPagination(this.pageNumber, this.pageSize, this.filterParams)
        .subscribe((paginatedResult: PaginatedResult<GuestStayEdit[]>) => {
          this.showSpinner = false;
          this.guestStayList = paginatedResult.result;
          this.pagination = paginatedResult.pagination;
        }, error => { this.alertify.error(error); });
    } else {
      this.guestStayService.getGuestStaysPagination(this.pagination.currentPage, this.pagination.itemsPerPage, this.filterParams)
        .subscribe((paginatedResult: PaginatedResult<GuestStayEdit[]>) => {
          this.showSpinner = false;
          this.guestStayList = paginatedResult.result;
          this.pagination = paginatedResult.pagination;
        }, error => { this.alertify.error(error); });
    }
  }

  onSearch() {
    if(this.selectedService != null) {
      this.filterParams.buildingId = this.selectedService.id;
      this.filterByService = true;
      this.pagination.currentPage = 1;
      this.loadGuests();
      this.selectedServiceTitle = this.selectedServiceName;
    }
  }

  onReset() {
    this.initFilterParams();
    this.selectedService = null;
    this.selectedServiceName = '';
    this.filterByService = false;
    this.loadGuests();
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadGuests();
  }

}
