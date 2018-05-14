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
  @Output() cancel = new EventEmitter();
  edituserForm: FormGroup;
  isUnitFocused = false;
  selectedUnit: Unit = { id: 0, name: '' };
  selectedService: Service;  // rank display depends on selectedService
  formData: FormData;


  // private route: ActivatedRoute,
  // private router: Router
  constructor(private authService: AuthService,
    private alertify: AlertifyService,
    private unitsService: UnitsService) { }

  ngOnInit() {
    this.getFormData();
    this.initForm();
  }

  onSubmit() {
    this.edituserForm.value['userUnit'] = this.selectedUnit.id;

    this.authService.register(this.edituserForm.value).subscribe(() => {
      this.alertify.success('Registration Successful Please Wait for Approval');
      // this.router.navigate(['/']);
    }, error => {
      this.alertify.error('An error occured');
    });
  }

  private initForm() {
    this.edituserForm = new FormGroup({
      'username': new FormControl(this.user.userName, [Validators.required, Validators.max(20)]),
      'accountTypeId': new FormControl(this.user.accountTypeId, Validators.required),
      'dodId': new FormControl(this.user.dodId, Validators.required),
      'firstName': new FormControl(this.user.firstName, Validators.required),
      'middleInitial': new FormControl(this.user.middleInitial),
      'lastName': new FormControl(this.user.lastName, Validators.required),
      'service': new FormControl(this.selectedService, Validators.required),
      'rankId': new FormControl(this.user.rankId, Validators.required),
      'userUnit': new FormControl(null, [Validators.required, this.unitConfirming.bind(this)]),
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
    }, error => {
      this.alertify.error(error);
    });
  }

  private unitFocus() {
    this.isUnitFocused = this.isUnitFocused ? false : true;
  }

  onUnitSelected(selectedUnit) {
    this.selectedUnit = selectedUnit;
    //  this.filterStatus = this.selectedUnit.name;

  }

  onCancel() {
    this.cancel.emit(null);
    // this.router.navigate(['/']);
  }

  unitConfirming(c: FormControl): { [s: string]: boolean } {
    if (this.selectedUnit.id === 0) {
      return { 'invalidUnit': true };
    }
    return null;
  }

  compareAccount(accountFromList: AccountType, selectedAccount: AccountType): boolean {
    return accountFromList === selectedAccount;
    // return accountFromList && selectedAccount ? accountFromList.id === selectedAccount.id : accountFromList === selectedAccount;
  }

  compareService(serviceFromList: Service, selectedService: Service): boolean {
    return serviceFromList && selectedService ? serviceFromList.id === selectedService.id : serviceFromList === selectedService;
  }

  compareRank(rankFromListId, selectedRankId): boolean {
    return rankFromListId === selectedRankId;
  }

}
