import { Component, OnInit, Inject, HostListener, HostBinding, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import {
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { map, startWith, debounceTime } from 'rxjs/operators';
import { Observable ,  fromEvent ,  Subscription } from 'rxjs';
import { GuestStayCheckIn } from '../../_models/guestStayCheckIn';
import { disableDebugTools } from '@angular/platform-browser';

@Component({
  selector: 'app-pendingscandialog',
  templateUrl: './pendingscandialog.component.html',
  styleUrls: ['./pendingscandialog.component.css']
})
export class PendingscandialogComponent implements OnInit {
  form: FormGroup;
  formSub: Subscription;
  base32Value: string;
  guest: {
    dodId: number,
    firstName: string,
    lastName: string,
    middleInitial: string,
    service: string,
    rank: string };
  title: string
  timerToken: any;
  showSpinner = false;
  isValidCAC = true;
  awaitCacRunning = false;

  // @ViewChild("inputBox") _ib: ElementRef;
  // @ViewChild("closebutton") _cb: ElementRef;

  constructor(
    private dialogRef: MatDialogRef<PendingscandialogComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.title = data.title;
    this.guest = data.guest;
  }


  @HostListener('document: keypress', ['$event']) 
    handleKeyboardEvent(event: KeyboardEvent) { 
    this.base32Value = this.base32Value + event.key;
    
    if (this.timerToken == null)
      this.awaitCac();
  };

  ngOnInit() {
    this.base32Value = '';
    // this.awaitCac();

    // this.form.value['base32ValueInput'].valueChanges
    // .subscribe(newValue => this.base32Value = newValue);
    // console.log(this.form.get('base32ValueInput').value);
  }

  // ngAfterContentInit() {
  //   this.awaitCac();
  // }

  awaitCac() {
    // this.timerToken = setInterval(this.validateCac.bind(this), 1000);
    // this.timerToken = setInterval(() => { this.validateCac(); }, 250);
    
    this.awaitCacRunning = true;
    this.timerToken = setTimeout(() => this.validateCac(), 1000);
  }

  // changeFocus() {
  //   this._cb.nativeElement.focus();
  //   this._ib.nativeElement.focus();
  // }

  validateCac() {
    // if (this.form != null) {
    //   this.base32Value = this.form.value['base32ValueInput'];
    //   console.log(this.base32Value);
    //   if (this.base32Value.length == 89 || this.base32Value.length == 88) {
    //     this.readBase32String(this.base32Value);
    //     clearInterval(this.timerToken);
    //     this.dialogRef.close(this.guest);
    //   }
    // }
    
// NFCAT7IS1BPM36HAlexander           Nestle                    B1URAF00SSGT  ME05BB65BC8CNM
    // if (this.base32Value != '') {
      if (this.base32Value.length == 89 || this.base32Value.length == 88) {
        this.guest.dodId = parseInt(this.base32Value.substring(8, 15).trim(), 32);
        this.guest.firstName = this.base32Value.substring(15, 35).trim();
        this.guest.lastName = this.base32Value.substring(35, 61).trim();
        this.guest.middleInitial = this.base32Value.substring(88, 89).trim();
        this.guest.service = this.getService(this.base32Value.substring(66, 67));
        this.guest.rank = this.base32Value.substring(69,75).toUpperCase().trim();
        // clearTimeout(this.timerToken);
        // clearInterval(this.timerToken);
        this.dialogRef.close(this.guest);
      } else {
        this.isValidCAC = false;
        this.base32Value = ''; 
      }

      clearTimeout(this.timerToken);
      this.timerToken = undefined;

    // }
  }

  getService(service: string){
    switch (service)
    {
      case 'A': {
        return 'Army';
      }
      case 'C': {
        return 'Coast Guard';
      }
      case 'D': {
        return 'Civilian';
      }
      case 'F': {
        return 'Air Force';
      }
      case 'H': {
        return 'Public Health Services';
      }
      case 'M': {
        return 'USMC';
      }
      case 'N': {
        return 'Navy';
      }
      case '0': {
        return 'National Oceanic and Atmospheric Administration';
      }
      case '1': {
        return 'Foreign Army';
      }
      case '2': {
        return 'Foreign Navy';
      }
      case '3': {
        return 'Foreign Marine Corps';
      }
      case '4': {
        return 'Foreign Air Force';
      }
      case 'X': {
        return 'Other';
      }
    }
  }

  close() {
    clearTimeout(this.timerToken);
    this.dialogRef.close();
  }

}
