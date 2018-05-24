import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { AuthService } from '../../_services/auth.service';
import { AlertifyService } from '../../_services/alertify.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private authService: AuthService,
              private alertify: AlertifyService) { }

  ngOnInit() {
    this.initForm();
  }

  onSubmit() {
    this.authService.login(this.loginForm.value).subscribe(data => {
      this.alertify.success('Login Successful');
      this.router.navigate(['/']);
    }, error => {
      this.alertify.error(error);
    });
  }

  onCancel() {
    this.router.navigate(['/']);
  }
  // , {relativeTo: this.route}
private initForm() {
  this.loginForm = new FormGroup({
    'username': new FormControl(null, [Validators.required, Validators.max(20)]),
    'password': new FormControl(null, [Validators.required, Validators.max(25)])
  });
}

}
