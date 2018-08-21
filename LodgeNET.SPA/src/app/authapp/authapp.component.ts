import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { UPLOADTYPES } from './fileupload/fileupload.component';

@Component({
  selector: 'app-authapp',
  templateUrl: './authapp.component.html',
  styleUrls: ['./authapp.component.css']
})
export class AuthappComponent implements OnInit {
  @ViewChild('uploaddropdown') uploadDropdown: ElementRef;
  @ViewChild('checkinoutdropdown') checkinoutDropDown: ElementRef;
  @ViewChild('viewdropdown') viewDropdown: ElementRef;
  @ViewChild('reportsdropdown') reportsDropdown: ElementRef;
  isUploadDropdownOpen = false;
  isCheckinOutDropdownOpen = false;
  isViewDropdownOpen = false;
  isReportsDropdownOpen = false;
  UPLOADTYPES;

  constructor(public authService: AuthService) { }

  ngOnInit() {
    this.UPLOADTYPES = UPLOADTYPES;
  }

  @HostListener('document:click', ['$event']) documentclicked(eventData: Event) {
    if (this.authService.accountType !== 'Viewer') {
      if (!this.uploadDropdown.nativeElement.contains(eventData.target)) {
      this.isUploadDropdownOpen = false;
      }

      if (!this.reportsDropdown.nativeElement.contains(eventData.target)) {
        this.isReportsDropdownOpen = false;
      }

    if (!this.checkinoutDropDown.nativeElement.contains(eventData.target)) {
      this.isCheckinOutDropdownOpen = false;
    }
  }

    if (!this.viewDropdown.nativeElement.contains(eventData.target)) {
      this.isViewDropdownOpen = false;
    }

  }

}
