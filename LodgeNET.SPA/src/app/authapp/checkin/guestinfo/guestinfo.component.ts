import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../../_services/auth.service';
import { AlertifyService } from '../../../_services/alertify.service';
import { Unit } from '../../../_models/unit';
import { Service } from '../../../_models/service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { GueststayService } from '../../../_services/gueststay.service';
import { GuestStayCheckIn } from '../../../_models/guestStayCheckIn';
import { Rank } from '../../../_models/rank';
import { FormData } from '../../../_models/formData';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { PendingscandialogComponent } from '../../../_utilities/pendingscandialog/pendingscandialog.component';

@Component({
  selector: 'app-guestinfo',
  templateUrl: './guestinfo.component.html',
  styleUrls: ['./guestinfo.component.css']
})
export class GuestinfoComponent implements OnInit, OnDestroy {
  formData: FormData;
  guestInfoForm: FormGroup;
  isUnitFocused = false;
  // idScanCheckin = false;
  selectedUnit: Unit = { id: 0, name: '' };
  selectedService: Service = {  id: 0, serviceName: '' };
  filterStatus = '';
  cacServiceList: Service[];
  cacRankList: Rank[];

  // angular disabled att for controls has errors, only method found that works
  dodIdDisabled = this.gueststayService.guestStay.guestId !== 0;

  constructor(private authService: AuthService,
    private alertify: AlertifyService,
    private gueststayService: GueststayService,
    private guestStaySevice: GueststayService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.getFormData();
    this.initForm();
  }

  ngOnDestroy() {
    if (this.guestInfoForm.value['gender'] != null) {
      this.guestInfoForm.value['gender'] = (this.guestInfoForm.value['gender'] === 0) ? 'Male' : 'Female';
    }

    this.guestInfoForm.value['guestUnit'] = this.selectedUnit;
    this.gueststayService.saveGuestInfo(this.guestInfoForm.value);
  }

  getFormData() {
    this.authService.formData().subscribe((formData: FormData) => {
      this.formData = formData;
    }, error => {
      this.alertify.error(error);
    });
  }

  private initForm() {
    let guestStay = this.gueststayService.guestStay;

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
      'email': new FormControl(guestStay.email == null ? null : guestStay.email),
      'dsnPhone': new FormControl(guestStay.dsnPhone == null ? null : guestStay.dsnPhone),
      'commPhone': new FormControl(guestStay.commPhone == null ? null : guestStay.commPhone),
    });

    this.dodIdDisabled =  guestStay.guestId !== 0;

    this.guestInfoForm.statusChanges.subscribe(data => {
      this.gueststayService.setGuestInfoValid(this.guestInfoForm.valid);
    });
  }

  pendingScan() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      title: 'Awaiting CAC Scan',
      guest: {
        dodId: null,
        firstName: '',
        lastName: '',
        middleInitial: '',
        service: '',
        rank: ''} 
    };

    const dialogRef = this.dialog.open(PendingscandialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(data => {
      if (data != null) {
      
        this.guestInfoForm.controls['dodId'].patchValue(data.dodId);
        this.guestInfoForm.controls['firstName'].patchValue(data.firstName);
        this.guestInfoForm.controls['lastName'].patchValue(data.lastName);
        this.guestInfoForm.controls['middleInitial'].patchValue(data.middleInitial);
        let yup = data.rank;     
        this.cacServiceList = this.formData.serviceList.filter(s => s.serviceName == data.service);
        if (this.cacServiceList !== null) {
          this.selectedService = this.cacServiceList[0];
          // this.guestInfoForm.controls['service'].patchValue(this.selectedService);
          
          // console.log(this.selectedService.ranks.filter(r => {
          //   console.log(r.rankName.toUpperCase());
          //   (r.rankName.toUpperCase().trim()) == (yup.toUpperCase())}));
          // this.guestInfoForm.value['rank'] = this.selectedService.ranks.filter(r => r.rankName.toUpperCase() == data.rank)[0];
          // this.guestInfoForm.controls['rank'].patchValue(this.selectedService.ranks.filter(r => r.rankName.toUpperCase() == data.rank)[0]);
        }

        if (this.selectedService !== null) {
          this.cacRankList = this.selectedService.ranks.filter(r => r.rankName.toUpperCase() == data.rank)
          this.guestInfoForm.controls['rank'].patchValue(this.cacRankList[0]);
        }
        
     }
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
    this.gueststayService.clearGuestStay();
    this.guestInfoForm.reset();
    this.router.navigate(['/']);
  }

  onNext() {
    this.router.navigate(['../roomselect'], {relativeTo: this.route});
  }

  onDodIdFocusOut(dodId: number) {
    this.guestStaySevice.getExistentGuest(dodId).subscribe((guestStay: GuestStayCheckIn) => {
      if (!guestStay || this.gueststayService.guestStay.guestId !== 0) {
        return;
      }

    this.alertify.confirm('We have found this guest in the Database. Do you want to autopopulate?' + 
      '<br /><br />WARNING: Changed information will be updated in database.', () => {
          this.gueststayService.saveRetrievedGuestInfo(guestStay);
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
