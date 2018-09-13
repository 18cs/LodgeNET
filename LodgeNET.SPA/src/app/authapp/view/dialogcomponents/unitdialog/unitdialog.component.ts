import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Unit } from '../../../../_models/unit';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-unitdialog',
  templateUrl: './unitdialog.component.html',
  styleUrls: ['./unitdialog.component.css']
})
export class UnitdialogComponent implements OnInit {
  form: FormGroup;
  unit: Unit;
  title: string;
  units: Unit[];
  selectedParentUnit: Unit;
  filteredOptions: Observable<Unit[]>;
  parentUnitName: string;
  unitAbbreviation: string;

  constructor(
    private dialogRef: MatDialogRef<UnitdialogComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.title = data.title;
    this.unit = data.unit;
    this.units = data.units;
  }

  ngOnInit() {
    this.formInit();
    this.filteredOptions = this.form.controls['parentUnit'].valueChanges.pipe(
      startWith(''),
      map(val => this.unitFilter(val))
    );
  }

  formInit() {
    if (this.unit.parentUnit != null) {
      this.parentUnitName = this.unit.parentUnit.name;
      this.selectedParentUnit = this.unit.parentUnit;
    }

    this.unitAbbreviation = this.unit.unitAbbreviation;

    this.form = new FormGroup({
      'unitName': new FormControl(this.unit.name, Validators.required),
      'unitAbbreviation': new FormControl(this.unit.unitAbbreviation),
      'parentUnit': new FormControl()
    });
  }

  save() {
    this.unit.name = this.form.value['unitName'];
    this.unit.unitAbbreviation = this.form.value['unitAbbreviation'];

    if (this.selectedParentUnit != null)
    {
      if (this.unit.parentUnitId != this.selectedParentUnit.id) {
        this.unit.parentUnit = this.selectedParentUnit;
        this.unit.parentUnitId = this.selectedParentUnit.id;
      }
    }
    this.dialogRef.close(this.unit);
  }

  close() {
    this.dialogRef.close();
  }

  unitFilter(val: string): Unit[] {
    return this.units.filter(unit =>
      unit.name.toLowerCase().includes(val.toLowerCase())
    );
  }

  onUnitSelected(unit: Unit) {
    this.selectedParentUnit = unit;
  }

  unitFocusOut() {
    if(this.selectedParentUnit != null ) {
      this.parentUnitName = this.selectedParentUnit.name;
    }
  }
}
