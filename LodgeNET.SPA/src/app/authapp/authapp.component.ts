import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-authapp',
  templateUrl: './authapp.component.html',
  styleUrls: ['./authapp.component.css']
})
export class AuthappComponent implements OnInit {
  @ViewChild('uploaddropdown') uploadDropdown: ElementRef;
  isUploadDropdownOpen = false;

  constructor() { }

  ngOnInit() {
  }

  @HostListener('document:click', ['$event']) documentclicked(eventData: Event) {
    if (!this.uploadDropdown.nativeElement.contains(eventData.target)) {
      this.isUploadDropdownOpen = false;
    }
  }

}
