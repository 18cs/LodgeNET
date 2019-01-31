import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FileRow } from '../../../../_models/FileRow';
import { Unit } from '../../../../_models/unit';
import { Observable } from 'rxjs/Observable';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-exmanifestDialog',
  templateUrl: './exmanifestDialog.component.html',
  styleUrls: ['./exmanifestDialog.component.css']
})
export class ExmanifestDialogComponent implements OnInit {
  form: FormGroup;
  fileRow: FileRow;
  units: Unit[];
  selectedUnit: Unit;
  filteredOptions: Observable<Unit[]>;
  unitName: string;

  constructor(
    private dialogRef: MatDialogRef<ExmanifestDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) { 
    this.fileRow = data.dataRow;
    console.log(this.fileRow);
    this.units = data.units;
    
    console.log(this.selectedUnit);
  }

  ngOnInit() {
    this.formInit();
    this.filteredOptions = this.form.controls['unitName'].valueChanges
      .pipe(
        startWith(''),
        map(val => this.unitFilter(val))
      );
  }

  unitFilter(val: string): Unit[] {
    if (val == null ) {
      return this.units;
    }

    return this.units.filter(unit =>
      unit.name.toLowerCase().includes(val.toLowerCase()));
  }

  onUnitSelected(unit: Unit) {
    this.selectedUnit = unit;
  }

  unitFocusOut() {
    this.unitName = this.selectedUnit.name;
  }

  unitConfirm(c: FormControl): {[s: string]: boolean} {
    if (this.selectedUnit == null) {
      return {'invalidUnit': true};
    }
    return null;
  }

  formInit() {
    console.log(this.fileRow);
    this.selectedUnit = this.unitFilter(this.fileRow.unitName)[0];
    if (this.selectedUnit != null)
    {
      this.unitName = this.selectedUnit.name;
    }
    this.form = new FormGroup({
      'firstName': new FormControl(this.fileRow.firstName, Validators.required),
      'lastName': new FormControl(this.fileRow.lastName, Validators.required),
      'gender': new FormControl(this.fileRow.gender, Validators.required),
      'unitName': new FormControl(null, Validators.required)
    });
  }

  save() {
    this.fileRow.firstName = this.form.value['firstName'];
    this.fileRow.lastName = this.form.value['lastName'];
    this.fileRow.gender = this.form.value['gender'];
    if (this.selectedUnit != null) {
      this.fileRow.unitId = this.selectedUnit.id;
      this.fileRow.unitName = this.selectedUnit.name;
    }

    this.dialogRef.close(this.fileRow);
  }

  close() {
    this.dialogRef.close();
  }

}
