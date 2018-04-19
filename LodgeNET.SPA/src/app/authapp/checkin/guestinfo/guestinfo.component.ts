import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../../_services/auth.service';
import { AlertifyService } from '../../../_services/alertify.service';
import { Unit } from '../../../_models/unit';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { CheckinService } from '../../../_services/checkin.service';

@Component({
  selector: 'app-guestinfo',
  templateUrl: './guestinfo.component.html',
  styleUrls: ['./guestinfo.component.css']
})
export class GuestinfoComponent implements OnInit, OnDestroy {
  formData: FormData;
  guestInfoForm: FormGroup;
  isUnitFocused = false;
  idScanCheckin = false;
  selectedUnit: Unit;
  selectedService: any;
  filterStatus = '';

  constructor(private authService: AuthService, 
              private alertify: AlertifyService,
              private checkinService: CheckinService) { }

  ngOnInit() {
    this.getFormData();
    this.initForm();
  }

  ngOnDestroy() {
  //  console.log(this.guestInfoForm.value);
    this.checkinService.saveGuestInfo(this.guestInfoForm.value); 
  }

  getFormData() {
    this.authService.formData().subscribe((formData: FormData) => {
      this.formData = formData;
    }, error => {
      this.alertify.error(error);
    });
  }

  private initForm() {
     let guestStay = this.checkinService.guestStay;

    if (guestStay) {
      console.log(guestStay);
      this.guestInfoForm = new FormGroup({
        'dodId': new FormControl(guestStay.formData['dodId'], Validators.required),
        'firstName': new FormControl(guestStay.formData['firstName'], Validators.required),
        'middleInitial': new FormControl(guestStay.formData['middleInitial']),
        'lastName': new FormControl(guestStay.formData['lastName'], Validators.required),
        'service': new FormControl(guestStay.formData['service'].name, Validators.required),
        'rankId': new FormControl(guestStay.formData['rankId']),
        'userUnit': new FormControl(guestStay.formData['userUnit'], [Validators.required, this.unitConfirming.bind(this)]),
        'email': new FormControl(guestStay.formData['email'], [Validators.required, Validators.email]),
        'dsnPhone': new FormControl(guestStay.formData['dsnPhone']),
        'commPhone': new FormControl(guestStay.formData['commPhone'], Validators.required),
      });
      console.log(guestStay);
    } else {
      console.log('fdsafdsafd');
      this.guestInfoForm = new FormGroup({
        'dodId': new FormControl(null, Validators.required),
        'firstName': new FormControl(null, Validators.required),
        'middleInitial': new FormControl(),
        'lastName': new FormControl(null, Validators.required),
        'service': new FormControl(null, Validators.required),
        'rankId': new FormControl(null),
        'userUnit': new FormControl(null, [Validators.required, this.unitConfirming.bind(this)]),
        'email': new FormControl(null, [Validators.required, Validators.email]),
        'dsnPhone': new FormControl(),
        'commPhone': new FormControl(null, Validators.required),
      });
    }
  }

  private unitFocus() {
    this.isUnitFocused = this.isUnitFocused ? false : true;
  }

  onUnitSelected(selectedUnit) {
    this.selectedUnit = selectedUnit;
     this.filterStatus = this.selectedUnit.name;

  }

  unitConfirming(c: FormControl): {[s: string]: boolean} {
    if (this.filterStatus === '') {
      return {'invalidUnit': true};
    }
    return null;
  }
}
