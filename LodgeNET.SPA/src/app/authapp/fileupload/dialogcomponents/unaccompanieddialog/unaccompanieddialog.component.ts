import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FileRow } from '../../../../_models/FileRow';
import { Unit } from '../../../../_models/unit';
import { Observable } from 'rxjs/Observable';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-unaccompanieddialog',
  templateUrl: './unaccompanieddialog.component.html',
  styleUrls: ['./unaccompanieddialog.component.css']
})
export class UnaccompanieddialogComponent implements OnInit {
  form: FormGroup;
  fileRow: FileRow;
  units: Unit[];
  filteredOptions: Observable<Unit[]>;
  unitName: string;

  constructor(
      private dialogRef: MatDialogRef<UnaccompanieddialogComponent>,
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

  formInit() {
    this.form = new FormGroup({
      'firstName': new FormControl(this.fileRow.firstName, Validators.required),
      'lastName': new FormControl(this.fileRow.lastName, Validators.required),
      'bldgNum': new FormControl(this.fileRow.buildingNumber, Validators.required),
      'roomNum': new FormControl(this.fileRow.roomNumber, Validators.required),
      'unitName': new FormControl(this.fileRow.unitName, [Validators.required, this.unitConfirm.bind(this)])
    });
  }

  unitFilter(val: string): Unit[] {
    return this.units.filter(unit =>
      unit.name.toLowerCase().includes(val.toLowerCase()));
  }

  onUnitSelected(unit: Unit) {
    this.fileRow.unitId = unit.id;
    this.fileRow.unitName = unit.name;
  }

  unitFocusOut() {
    this.unitName = this.fileRow.unitName;
  }

  unitConfirm(c: FormControl): {[s: string]: boolean} {
    
    if (this.fileRow.unitId === 0) {
      return {'invalidUnit': true};
    }
    return null;
  }

  

  save() {
    // this.building.name = this.form.value['name'];
    // console.log(this.building.name);
    // this.dialogRef.close(this.building);
    this.fileRow = this.form.value;
    this.dialogRef.close(this.fileRow);
  }

  close() {
    this.dialogRef.close();
  }

}
