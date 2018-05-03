import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import {
  FormGroup,
  Validators,
  FormControl,
  FormBuilder
} from '@angular/forms';
import { Building } from '../../../../_models/building';

@Component({
  selector: 'app-buildingsdialog',
  templateUrl: './buildingsdialog.component.html',
  styleUrls: ['./buildingsdialog.component.css']
})
export class BuildingsdialogComponent implements OnInit {
  form: FormGroup;
  building: Building;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<BuildingsdialogComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.building = data.building;
  }

  ngOnInit() {
    this.formInit();
  }

  formInit() {
    this.form = new FormGroup({
      'name': new FormControl(this.building.name, Validators.required),
    });
  }

  save() {
    console.log(this.building.name);
    this.dialogRef.close(this.form.value);
  }

  close() {
    this.dialogRef.close();
  }
}
