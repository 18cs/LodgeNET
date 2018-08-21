import {
  Component,
  OnInit,
  HostListener,
  ElementRef,
  ViewChild
} from '@angular/core';
import { AuthService } from '../../_services/auth.service';
import { AlertifyService } from '../../_services/alertify.service';
import { UPLOADTYPES } from '../../authapp/fileupload/fileupload.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @ViewChild('userdropdown') userDropdown: ElementRef;
  @ViewChild('uploaddropdown') uploadDropdown: ElementRef;

  pendingAcctCount: number;
  UPLOADTYPES;

  constructor(
    public authService: AuthService,
    private alertify: AlertifyService
  ) {
    this.UPLOADTYPES = UPLOADTYPES;
  }
  isUserDropdownOpen = false;
  isUploadDropdownOpen = false;
  isNavbarOpen = false;

  ngOnInit() {}

  toggleUserDropDown() {
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
    return this.isUserDropdownOpen;
  }

  logout() {
    if (this.authService.logout()) {
      this.alertify.success('Logout successful');
    } else {
      this.alertify.error('Logout failed');
    }
  }

  @HostListener('document:click', ['$event'])
  documentclicked(eventData: Event) {
    if (this.authService.loggedIn()) {
      if (!this.userDropdown.nativeElement.contains(eventData.target)) {
        this.isUserDropdownOpen = false;
      }

      if (this.authService.accountType !== 'Viewer') {
        if (!this.uploadDropdown.nativeElement.contains(eventData.target)) {
          this.isUploadDropdownOpen = false;
        }
      }
    }
  }
}
