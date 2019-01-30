import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import {
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { Building } from '../../../../_models/building';
import { Observable } from 'rxjs';
import { BuildingCategory } from '../../../../_models/buildingCategory';

@Component({
  selector: 'app-buildingsdialog',
  templateUrl: './buildingsdialog.component.html',
  styleUrls: ['./buildingsdialog.component.css']
})
export class BuildingsdialogComponent implements OnInit {
  form: FormGroup;
  building: Building;
  title: string;
  // buildingTypeList: BuildingType[];
  filteredOptions: Observable<BuildingCategory[]>;
  buildingCatList: BuildingCategory[];
  selectedBuildingCat: BuildingCategory;
  selectedType: string;
  //selectedBuildingType?: BuildingType;

  constructor(
    private dialogRef: MatDialogRef<BuildingsdialogComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.title = data.title;
    this.building = data.building;
    this.buildingCatList = data.buildingTypeList;
  }

  ngOnInit() {
    this.formInit();
    this.filteredOptions = this.form.controls['buildingType'].valueChanges.pipe(
      startWith(''),
      map(val => this.buildingTypeFilter(val))
    );
  }

  buildingTypeFilter(val: string): BuildingCategory[] {
    return this.buildingCatList.filter(buildingType =>
      buildingType.type.toLowerCase().includes(val.toLowerCase())
    );
  }

  formInit() {

    if (this.building.buildingCategory != null) {
      this.selectedBuildingCat = this.building.buildingCategory;
      this.selectedType = this.selectedBuildingCat.type;
    }

    this.form = new FormGroup({
      'name': new FormControl(this.building.name, Validators.required),
      'number': new FormControl(this.building.number, Validators.required),
      'sector': new FormControl(this.building.sector),
      'buildingType': new FormControl(this.building.buildingCategory, Validators.required)
    });
  }

  save() {
    this.building.name = this.form.value['name'];
    this.building.number = this.form.value['number'];
    this.building.sector = this.form.value['sector'];

    if(this.building.buildingCategoryId != this.selectedBuildingCat.id) {
      this.building.buildingCategory = this.selectedBuildingCat;
      this.building.buildingCategoryId = this.selectedBuildingCat.id;
    }
    this.dialogRef.close(this.building);
  }

  close() {
    this.dialogRef.close();
  }

  onTypeSelected(buildingType: BuildingCategory) {
    this.selectedBuildingCat = buildingType;
  }

  buildingTypeFocusOut() {
    if(this.selectedBuildingCat != null ) {
      this.selectedType = this.selectedBuildingCat.type;
    }
  }
}
