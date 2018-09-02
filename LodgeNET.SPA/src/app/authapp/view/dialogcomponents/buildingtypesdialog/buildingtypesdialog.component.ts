import { Component, OnInit, Inject } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import {
  FormGroup,
  Validators,
  FormControl,
  FormBuilder
} from '@angular/forms';
import { BuildingType } from '../../../../_models/buildingType';

@Component({
  selector: 'app-buildingtypesdialog',
  templateUrl: './buildingtypesdialog.component.html',
  styleUrls: ['./buildingtypesdialog.component.css']
})
export class BuildingtypesdialogComponent implements OnInit {
  form: FormGroup;
  buildingType: BuildingType;
  title: string;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<BuildingtypesdialogComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.title = data.title;
    this.buildingType = data.buildingType;
  }

  ngOnInit() {
    this.formInit();
  }

  formInit() {
    this.form = new FormGroup({
      'type': new FormControl(this.buildingType.type, Validators.required),
      'inSurge': new FormControl(this.buildingType.inSurge)
    });
  }

  save() {
    this.buildingType.type = this.form.value['type'];
    this.buildingType.inSurge = this.form.value['surgeToggle'];
    this.dialogRef.close(this.buildingType);
  }

  close() {
    this.dialogRef.close();
  }
}
