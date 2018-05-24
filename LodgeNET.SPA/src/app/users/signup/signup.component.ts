import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from '../../_services/auth.service';
import { AlertifyService } from '../../_services/alertify.service';
import { UnitsService } from '../../_services/units.service';
import { FormData } from '../../_models/formData';
import { Unit } from '../../_models/unit';
import { Service } from '../../_models/service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup;
  isUnitFocused = false;
  selectedUnit: Unit = { id: 0, name: '' };
  selectedService: any;
  filterStatus = '';
  registerForm: FormData;

  constructor(private authService: AuthService,
              private alertify: AlertifyService,
              private route: ActivatedRoute,
              private router: Router,
              private unitsService: UnitsService) { }

  ngOnInit() {
    this.initForm();
    this.getFormData();
  }

  onSubmit() {
    this.signupForm.value['userUnit'] = this.selectedUnit.id;

    this.authService.register(this.signupForm.value).subscribe(() => {
      this.alertify.success('Registration Successful Please Wait for Approval');
      this.router.navigate(['/']);
    }, error => {
      this.alertify.error(error);
    });
  }

  private initForm() {
    this.signupForm = new FormGroup({
      'username': new FormControl(null, [Validators.required, Validators.max(20)]),
      'password': new FormControl(null, [Validators.required]),
      'confirmPassword': new FormControl(null, [Validators.required, this.passwordConfirming]),
      'accountTypeId': new FormControl(null, Validators.required),
      'dodId': new FormControl(null, Validators.required),
      'firstName': new FormControl(null, Validators.required),
      'middleInitial': new FormControl(),
      'lastName': new FormControl(null, Validators.required),
      'service': new FormControl(null, Validators.required),
      'rankId': new FormControl(null),
      'userUnit': new FormControl(null, [Validators.required, this.unitConfirming.bind(this)]),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'dsnPhone': new FormControl(),
      'commPhone': new FormControl(null),
    });
  }

  getFormData() {
    this.authService.formData().subscribe((registerForm: FormData) => {
      this.registerForm = registerForm;
    }, error => {
      this.alertify.error(error);
    });
  }

  onUnitFocusIn() {
    this.isUnitFocused = true;
  }

  onUnitFocusOut() {
    this.isUnitFocused = false;
    this.filterStatus = this.selectedUnit.name;
  }

  onUnitSelected(selectedUnit) {
    this.selectedUnit = selectedUnit;
    this.filterStatus = this.selectedUnit.name;
  }

  onCancel() {
    this.router.navigate(['/']);
  }

 passwordConfirming(c: AbstractControl): any {
  if (!c.parent || !c)  {
      return;
    }
    const pwd = c.parent.get('password');
    const cpwd = c.parent.get('confirmPassword');

    if (!pwd || !cpwd) {
      return ;
    }
    if (pwd.value !== cpwd.value) {
        return { invalid: true };

  }
}

unitConfirming(c: FormControl): {[s: string]: boolean} {
  if (this.selectedUnit.id === 0) {
    return {'invalidUnit': true};
  }
  return null;
}

}
