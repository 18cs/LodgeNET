import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../../_services/auth.service';
import { AlertifyService } from '../../../_services/alertify.service';
import { Unit } from '../../../_models/unit';
import { Service } from '../../../_models/service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { CheckinService } from '../../../_services/checkin.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GueststayService } from '../../../_services/gueststay.service';
import { GuestStayCheckIn } from '../../../_models/guestStayCheckIn';
import { Rank } from '../../../_models/rank';

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
  selectedUnit: Unit = { id: 0, name: '' };
  selectedService: Service = {  id: 0, serviceName: '' };
  dodIdDisabled = this.checkinService.guestStay.guestId !== 0; //angular disabled att for controls has errors, only ,ethod found that works

  constructor(private authService: AuthService,
    private alertify: AlertifyService,
    private checkinService: CheckinService,
    private guestStaySevice: GueststayService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.getFormData();
    this.initForm();
  }

  ngOnDestroy() {
    if (this.guestInfoForm.value['gender'] != null) {
      this.guestInfoForm.value['gender'] = (this.guestInfoForm.value['gender'] === 0) ? 'Male' : 'Female';
    }
    console.log(this.guestInfoForm);

    this.guestInfoForm.value['guestUnit'] = this.selectedUnit;
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

    if (guestStay.guestUnit) {
      this.onUnitSelected(guestStay.guestUnit);
    }

    if (guestStay.service) {
      this.selectedService = guestStay.service;
    }

    this.guestInfoForm = new FormGroup({
      'dodId': new FormControl(
        guestStay.dodId == null ? null : guestStay.dodId, 
        Validators.required),
      'firstName': new FormControl(guestStay.firstName == null ? null : guestStay.firstName, Validators.required),
      'middleInitial': new FormControl(guestStay.middleInitial == null ? null : guestStay.middleInitial, Validators.maxLength(1)),
      'lastName': new FormControl(guestStay.lastName == null ? null : guestStay.lastName, Validators.required),
      'gender': new FormControl(guestStay.gender == null || guestStay.gender == 'Male' ? 0 : 1),
      'service': new FormControl(null, Validators.required),
      'rank': new FormControl(guestStay.rank == null ? null : guestStay.rank),
      'guestUnit': new FormControl(null, [Validators.required, this.unitConfirming.bind(this)]),
      'guestChalk': new FormControl(guestStay.chalk == null ? null : guestStay.chalk),
      'email': new FormControl(guestStay.email == null ? null : guestStay.email, [Validators.required, Validators.email]),
      'dsnPhone': new FormControl(guestStay.dsnPhone == null ? null : guestStay.dsnPhone),
      'commPhone': new FormControl(guestStay.commPhone == null ? null : guestStay.commPhone),
    });
    
    this.dodIdDisabled =  guestStay.guestId !== 0;
    
    this.guestInfoForm.statusChanges.subscribe(data => {
      console.log(data); this.checkinService.setGuestInfoValid(this.guestInfoForm.valid);} );
  }

  private unitFocus() {
    this.isUnitFocused = this.isUnitFocused ? false : true;
  }

  onUnitSelected(selectedUnit) {
    this.selectedUnit = selectedUnit;
  }

  onCancel() {
    this.checkinService.clearGuestStay();
    this.router.navigate(['/']);
  }

  onNext() {
    this.router.navigate(['../roomselect'], {relativeTo: this.route});
  }

  onDodIdFocusOut(dodId: number) {
    this.guestStaySevice.getExistentGuest(dodId).subscribe((guestStay: GuestStayCheckIn) => {
      if (!guestStay || this.checkinService.guestStay.guestId !== 0) {
        return;
      }

    this.alertify.confirm('We have found this guest in the Database. Do you want to autopopulate?' + 
      '<br /><br />WARNING: Changed information will be updated in database.', () => {
          this.checkinService.saveRetrievedGuestInfo(guestStay);
          console.log(this.checkinService.guestStay);
          this.initForm();
        });
    }, error => {
    this.alertify.error(error);});
  }

  disableDodId() {
    this.guestInfoForm.controls['dodId'].disable();
  }

  unitConfirming(c: FormControl): { [s: string]: boolean } {
    if (this.selectedUnit.id === 0) {
      return { 'invalidUnit': true };
    }
    return null;
  }

  compareService(serviceFromList: Service, selectedService: Service): boolean {
     return serviceFromList && selectedService ? serviceFromList.id === selectedService.id : serviceFromList === selectedService;
  }

  compareRank(rankFromList: Rank, selectedRank: Rank): boolean {
    return rankFromList && selectedRank ? rankFromList.id === selectedRank.id : rankFromList === selectedRank;
 }


}
