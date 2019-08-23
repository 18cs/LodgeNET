import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FileRow } from '../../../../_models/fileRow';
import { Unit } from '../../../../_models/unit';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-lodgingDialog',
  templateUrl: './lodgingDialog.component.html',
  styleUrls: ['./lodgingDialog.component.css']
})
export class LodgingDialogComponent implements OnInit {
  form: FormGroup;
  fileRow: FileRow;
  units: Unit[];
  selectedUnit: Unit;
  filteredOptions: Observable<Unit[]>;
  unitName: string;

  constructor(
    private dialogRef: MatDialogRef<LodgingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) { 
    this.fileRow = data.dataRow;
    this.units = data.units;
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
    this.form = new FormGroup({
      'firstName': new FormControl(this.fileRow.firstName, Validators.required),
      'lastName': new FormControl(this.fileRow.lastName, Validators.required),
      'bldgNum': new FormControl(this.fileRow.buildingNumber, Validators.required),
      'roomNum': new FormControl(this.fileRow.roomNumber, Validators.required),
      'unitName': new FormControl(this.fileRow.unitName),
      'checkInDate': new FormControl(this.fileRow.checkInDate)
    });
  }

  save() {
    this.fileRow.firstName = this.form.value['firstName'];
    this.fileRow.lastName = this.form.value['lastName'];
    this.fileRow.buildingNumber = this.form.value['bldgNum'];
    this.fileRow.roomNumber = this.form.value['roomNum'];
    this.fileRow.checkInDate = this.form.value['checkInDate'];
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
