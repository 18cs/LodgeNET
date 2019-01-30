import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Guest } from '../../../../_models/guest';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Unit } from '../../../../_models/unit';
import { Service } from '../../../../_models/service';
import { AlertifyService } from '../../../../_services/alertify.service';
import { FormData } from '../../../../_models/formData';
import { GueststayService } from '../../../../_services/gueststay.service';

@Component({
  selector: 'app-editguest',
  templateUrl: './editguest.component.html',
  styleUrls: ['./editguest.component.css']
})
export class EditguestComponent implements OnInit {
  @Input() guest: Guest;
  @Input() formData: FormData;
  @Output() complete = new EventEmitter();
  editGuestForm: FormGroup;
  isUnitFocused = false;
  filterStatus = '';
  selectedUnit: Unit = { id: 0, name: '' };
  selectedService: Service = { id: 0, serviceName: ''};  // rank display depends on selectedService

  constructor(private alertify: AlertifyService, private gueststayService: GueststayService) { }

  ngOnInit() {
    if (this.guest.serviceId) {
      this.selectedService = this.formData. serviceList.find(s => s.id === this.guest.serviceId);
    }
    if (this.guest.unitId) {
      this.selectedUnit = this.formData.unitList.find(u => u.id === this.guest.unitId);
      this.filterStatus = this.selectedUnit.name;
    }

    this.initForm();
  }

  onSubmit() {
    this.editGuestForm.addControl('id', new FormControl(this.guest.id));

    // saves network traffic cost
    if (this.selectedUnit.id != 0)
      this.editGuestForm.value['unitId'] = this.selectedUnit.id;
    this.editGuestForm.value['service'] = this.selectedService.id;

    if (this.editGuestForm.value['gender'] != null) {
      this.editGuestForm.value['gender'] = (this.editGuestForm.value['gender'] === 0) ? 'Male' : 'Female';
    }
 
    this.mapguestUpdates();

    this.gueststayService.updateGuest(this.editGuestForm.value).subscribe(() => {
      this.alertify.success('Guest Successfully Updated');
      this.complete.emit(null);
    }, error => {
      this.alertify.error(error);
    });

  }

  private initForm() {
    this.editGuestForm = new FormGroup({
      'chalk': new FormControl(this.guest.chalk),
      'dodId': new FormControl(this.guest.dodId),
      'firstName': new FormControl(this.guest.firstName, Validators.required),
      'middleInitial': new FormControl(this.guest.middleInitial),
      'lastName': new FormControl(this.guest.lastName, Validators.required),
      'service': new FormControl(this.selectedService),
      'rankId': new FormControl(this.guest.rankId),
      'gender': new FormControl(this.guest.gender == 'Male' ? 0 : 1 , Validators.required),
      'unitId': new FormControl(this.filterStatus), // this.unitConfirming.bind(this)
      'email': new FormControl(this.guest.email, Validators.email),
      'dsnPhone': new FormControl(this.guest.dsnPhone),
      'commPhone': new FormControl(this.guest.commPhone),
    });
  }

  unitFocusIn() {
    this.isUnitFocused = true;
  }

  unitFocusOut() {
    this.isUnitFocused = false;
    this.filterStatus = this.selectedUnit.name;
  }

  onUnitSelected(selectedUnit) {
    this.selectedUnit = selectedUnit;
    this.filterStatus = this.selectedUnit.name;
  }

  onCancel() {
    this.complete.emit(null);
    // this.router.navigate(['/']);
  }

  unitConfirming(c: FormControl): { [s: string]: boolean } {
    if (this.selectedUnit.id === 0) {
      return { 'invalidUnit': true };
    }
    return null;
  }

    // maps updates to object to display in table to avoid DB query
    mapguestUpdates() {
      this.guest.dodId = this.editGuestForm.value['dodId'];
      this.guest.firstName = this.editGuestForm.value['firstName'];
      this.guest.lastName = this.editGuestForm.value['lastName'];
      this.guest.email = this.editGuestForm.value['email'];
      this.guest.dsnPhone = this.editGuestForm.value['dsnPhone'];
      this.guest.commPhone = this.editGuestForm.value['commPhone'];
      this.guest.serviceId = this.editGuestForm.value['service'];
      this.guest.rankId = this.editGuestForm.value['rankId'];
      this.guest.unitId = this.editGuestForm.value['unitId'];
      this.guest.gender = (this.editGuestForm.value['gender'] === 0) ? 'Male' : 'Female';
    }

  compareService(serviceFromList: Service, selectedService: Service): boolean {
    return serviceFromList && selectedService ? serviceFromList.id === selectedService.id : serviceFromList === selectedService;
  }

  compareRank(rankFromListId, selectedRankId): boolean {
    return rankFromListId === selectedRankId;
  }

}
