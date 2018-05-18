import { Component, OnInit, Inject } from '@angular/core';
import { GuestStayCheckOut } from '../../../../_models/guestStayCheckOut';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-gueststaydialog',
  templateUrl: './gueststaydialog.component.html',
  styleUrls: ['./gueststaydialog.component.css']
})
export class GueststaydialogComponent implements OnInit {
  form: FormGroup;
  guestStay: GuestStayCheckOut;

  constructor(
    private dialogRef: MatDialogRef<GueststaydialogComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) { 
    this.guestStay = data.guestStay;
  }

  ngOnInit() {
    this.formInit();
  }

  formInit() {
    this.form = new FormGroup({
      'checkInDate': new FormControl({ value: this.guestStay.checkInDate, disabled: true}),
      'checkOutDate': new FormControl({ value: this.guestStay.checkOutDate, disabled: true})
    });
  }

  save() {
    this.guestStay.checkInDate = this.form.value['checkInDate'];
    this.guestStay.checkOutDate = this.form.value['checkOutDate'];
console.log(this.guestStay);
    this.dialogRef.close(this.guestStay);
  }

  close() {
    this.dialogRef.close();
  }


}
