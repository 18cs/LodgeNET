import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import {
  FormGroup,
  Validators,
  FormControl,
  FormBuilder
} from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { Room } from '../../../../_models/room';
import { Building } from '../../../../_models/building';

@Component({
  selector: 'app-roomsdialog',
  templateUrl: './roomsdialog.component.html',
  styleUrls: ['./roomsdialog.component.css']
})
export class RoomsdialogComponent implements OnInit {
  form: FormGroup;
  room: Room;
  title: string;
  buildingList: Building[];
  selectedBuilding?: Building;
  selectedBuildingName: string;
  filteredOptions: Observable<Building[]>;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RoomsdialogComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.title = data.title;
    this.room = data.room;
    this.buildingList = data.buildingList;
  }

  ngOnInit() {
    this.formInit();
    this.filteredOptions = this.form.controls['building'].valueChanges.pipe(
      startWith(''),
      map(val => this.buildingFilter(val))
    );
  }

  buildingFilter(val: string): Building[] {
    return this.buildingList.filter(building =>
      building.name.toLowerCase().includes(val.toLowerCase())
    );
  }


  formInit() {

    if (this.room.building != null) {
      this.selectedBuilding = this.room.building;
      this.selectedBuildingName = this.room.building.name;
    }

    this.form = new FormGroup({
      'number': new FormControl(this.room.roomNumber, Validators.required),
      'building': new FormControl(),
      'floor': new FormControl(this.room.floor, Validators.required),
      'capacity': new FormControl(this.room.capacity, Validators.required),
      'surge': new FormControl(this.room.surgeMultiplier, Validators.required),
      'sqft': new FormControl(this.room.squareFootage, Validators.required)
    });

  }

  save() {
    this.room.roomNumber = this.form.value['number'];
    this.room.buildingId = this.selectedBuilding.id;
    this.room.building = this.selectedBuilding;
    this.room.floor = this.form.value['floor'];
    this.room.capacity = this.form.value['capacity'];
    this.room.surgeMultiplier = this.form.value['surge'];
    this.room.squareFootage = this.form.value['sqft'];
    this.dialogRef.close(this.room);
  }

  close() {
    this.dialogRef.close();
  }

  onBuildingSelected(building: Building) {
    this.selectedBuilding = building;
  }

  buildingFocusOut() {
    if(this.selectedBuilding != null ) {
      this.selectedBuildingName = this.selectedBuilding.name;
    }
  }
}
