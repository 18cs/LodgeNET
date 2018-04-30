import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-authapp',
  templateUrl: './authapp.component.html',
  styleUrls: ['./authapp.component.css']
})
export class AuthappComponent implements OnInit {
  @ViewChild('uploaddropdown') uploadDropdown: ElementRef;
  @ViewChild('checkinoutdropdown') checkinoutDropDown: ElementRef;
  @ViewChild('viewdropdown') viewDropdown: ElementRef;
  isUploadDropdownOpen = false;
  isCheckinOutDropdownOpen = false;
  isViewDropdownOpen = false;

  constructor() { }

  ngOnInit() {
  }

  @HostListener('document:click', ['$event']) documentclicked(eventData: Event) {
    if (!this.uploadDropdown.nativeElement.contains(eventData.target)) {
      this.isUploadDropdownOpen = false;
    }

    if (!this.checkinoutDropDown.nativeElement.contains(eventData.target)) {
      this.isCheckinOutDropdownOpen = false;
    }

    if (!this.viewDropdown.nativeElement.contains(eventData.target)) {
      this.isViewDropdownOpen = false;
    }

  }

}
