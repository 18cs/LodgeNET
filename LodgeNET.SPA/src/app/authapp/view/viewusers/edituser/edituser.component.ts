import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../../../_services/auth.service';
import { Unit } from '../../../../_models/unit';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertifyService } from '../../../../_services/alertify.service';
import { Service } from '../../../../_models/service';
import { UnitsService } from '../../../../_services/units.service';
import { User } from '../../../../_models/user';
import { FormData } from '../../../../_models/formData';
import { AccountType } from '../../../../_models/accountType';

@Component({
  selector: 'app-edituser',
  templateUrl: './edituser.component.html',
  styleUrls: ['./edituser.component.css']
})
export class EdituserComponent implements OnInit {

  @Input() user: User;
  @Output() complete = new EventEmitter();
  edituserForm: FormGroup;
  isUnitFocused = false;
  filterStatus = '';
  selectedUnit: Unit = { id: 0, name: '' };
  selectedService: Service;  // rank display depends on selectedService
  formData: FormData;

  constructor(private authService: AuthService,
    private alertify: AlertifyService,
    private unitsService: UnitsService) { }

  ngOnInit() {
    this.getFormData();
    this.initForm();
  }

  onSubmit() {
    this.edituserForm.addControl('id', new FormControl(this.user.id));

    // saves network traffic cost
    this.edituserForm.value['unitId'] = this.selectedUnit.id;
    this.edituserForm.value['service'] = this.selectedService.id;
 
    this.mapUserUpdates();

    this.authService.updateUser(this.edituserForm.value).subscribe(() => {
      this.alertify.success('User Successfully Updated');
      this.complete.emit(null);
    }, error => {
      this.alertify.error(error);
    });
  }

  private initForm() {
    this.edituserForm = new FormGroup({
      'username': new FormControl(this.user.userName, [Validators.required, Validators.max(20)]),
      'approved': new FormControl((this.user.approved == true) ? 1 : 0 , Validators.required),
      'accountTypeId': new FormControl(this.user.accountTypeId, Validators.required),
      'dodId': new FormControl(this.user.dodId, Validators.required),
      'firstName': new FormControl(this.user.firstName, Validators.required),
      'middleInitial': new FormControl(this.user.middleInitial),
      'lastName': new FormControl(this.user.lastName, Validators.required),
      'service': new FormControl(this.selectedService, Validators.required),
      'rankId': new FormControl(this.user.rankId, Validators.required),
      'unitId': new FormControl(this.filterStatus, [Validators.required, this.unitConfirming.bind(this)]),
      'email': new FormControl(this.user.email, [Validators.required, Validators.email]),
      'dsnPhone': new FormControl(this.user.dsnPhone),
      'commPhone': new FormControl(this.user.commPhone),
    });
  }

  getFormData() {
    this.authService.formData().subscribe((formData: FormData) => {
      this.formData = formData;
      this.selectedService = this.formData.serviceList.find(s => s.id === this.user.serviceId);
      this.selectedUnit = this.formData.unitList.find(u => u.id === this.user.unitId);
      this.filterStatus = this.selectedUnit.name;
    }, error => {
      this.alertify.error(error);
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
  mapUserUpdates() {
    this.user.userName = this.edituserForm.value['username'];
    this.user.approved = this.edituserForm.value['approved'] === 0 ? false : true;
    this.user.accountType = this.formData.accountTypeList.find( a => a.id === this.edituserForm.value['accountTypeId']);
    this.user.accountTypeId = this.edituserForm.value['accountTypeId'];
    this.user.dodId = this.edituserForm.value['dodId'];
    this.user.firstName = this.edituserForm.value['firstName'];
    this.user.lastName = this.edituserForm.value['lastName'];
    this.user.email = this.edituserForm.value['email'];
    this.user.dsnPhone = this.edituserForm.value['dsnPhone'];
    this.user.commPhone = this.edituserForm.value['commPhone'];
    this.user.serviceId = this.edituserForm.value['service'];
    this.user.rankId = this.edituserForm.value['rankId'];
    this.user.unitId = this.edituserForm.value['unitId'];
  }

  compareAccount(accountFromList: AccountType, selectedAccount: AccountType): boolean {
    return accountFromList === selectedAccount;
  }

  compareService(serviceFromList: Service, selectedService: Service): boolean {
    return serviceFromList && selectedService ? serviceFromList.id === selectedService.id : serviceFromList === selectedService;
  }

  compareRank(rankFromListId, selectedRankId): boolean {
    return rankFromListId === selectedRankId;
  }

}
