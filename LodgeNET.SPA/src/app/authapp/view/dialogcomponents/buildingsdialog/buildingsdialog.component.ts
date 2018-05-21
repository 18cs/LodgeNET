import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import {
  FormGroup,
  Validators,
  FormControl,
  FormBuilder
} from '@angular/forms';
import { Building } from '../../../../_models/building';
import { BuildingType } from '../../../../_models/buildingType';

@Component({
  selector: 'app-buildingsdialog',
  templateUrl: './buildingsdialog.component.html',
  styleUrls: ['./buildingsdialog.component.css']
})
export class BuildingsdialogComponent implements OnInit {
  form: FormGroup;
  building: Building;
  title: string;
  buildingTypeList: BuildingType[];
  selectedBuildingType?: BuildingType;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<BuildingsdialogComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.title = data.title;
    this.building = data.building;
    this.buildingTypeList = data.buildingTypeList;
  }

  ngOnInit() {
    this.formInit();
  }

  formInit() {
    if (this.title !== 'Add Building') {
      const selectedBldgList = this.buildingTypeList.filter(
        type => type.id === this.building.buildingCategoryId
      );
      this.selectedBuildingType = selectedBldgList[0];
      console.log(this.selectedBuildingType);
    } else {
      this.selectedBuildingType = this.buildingTypeList[0];
    }

    // this.buildingTypeList.forEach(type => {
    //   if (this.building.buildingCategoryId === type.id) {
    //     this.selectedBuildingType = type;
    //   }
    // });

    this.form = new FormGroup({
      name: new FormControl(this.building.name, Validators.required),
      number: new FormControl(this.building.number, Validators.required),
      buildingType: new FormControl()
    });
  }

  save() {
    this.building.name = this.form.value['name'];
    this.building.number = this.form.value['number'];
    this.building.buildingCategoryId = this.selectedBuildingType.id;
    console.log(this.building);
    this.dialogRef.close(this.building);
  }

  close() {
    this.dialogRef.close();
  }

  onTypeSelected(buildingType: BuildingType) {
    this.selectedBuildingType = buildingType;
    console.log(this.selectedBuildingType.id);
  }
}
