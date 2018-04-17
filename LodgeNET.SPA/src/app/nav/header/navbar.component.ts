import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../_services/auth.service';
import { AlertifyService } from '../../_services/alertify.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private authService: AuthService, private alertify: AlertifyService) { }
  isOpen = false;

  ngOnInit() {
  }

  toggleDropDown() {
    console.log('yupyupyup');
    this.isOpen = !this.isOpen;
    return this.isOpen;
  }

  logout() {
    if (this.authService.logout()) {
     this.alertify.success('Logout successful');
    } else {
      this.alertify.error('Logout failed');
    }
    // this.isOpen = false;
  }

}
