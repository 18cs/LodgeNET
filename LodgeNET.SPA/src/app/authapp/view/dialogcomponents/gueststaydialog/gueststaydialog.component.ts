import { Component, OnInit, Inject } from '@angular/core';
import { GuestStayEdit } from '../../../../_models/guestStayEdit';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BuildingService } from '../../../../_services/building.service';
import { GueststayService } from '../../../../_services/gueststay.service';
import { Building } from '../../../../_models/building';
import { Room } from '../../../../_models/room';

@Component({
  selector: 'app-gueststaydialog',
  templateUrl: './gueststaydialog.component.html',
  styleUrls: ['./gueststaydialog.component.css']
})
export class GueststaydialogComponent implements OnInit {
  form: FormGroup;
  guestStay: GuestStayEdit;
  buildingList: Building[];
  availableRooms: Room[];
  selectedBuildingName: string;
  selectedBuilding?: Building;
  selectedRoomNumber: string;
  selectedRoom?: Room;

  constructor(
    private buildingService: BuildingService,
    private gueststayService: GueststayService,
    private dialogRef: MatDialogRef<GueststaydialogComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) { 
    this.guestStay = data.guestStay;
    this.buildingList = data.buildingList;
  }

  ngOnInit() {
    this.formInit();
    this.loadRooms();
  }

  formInit() {
    if (this.guestStay.room.building != null) {
      this.selectedBuilding = this.guestStay.room.building;
      this.selectedBuildingName = this.guestStay.room.building.name;
      this.selectedRoom = this.guestStay.room;
      this.selectedRoomNumber = this.guestStay.room.roomNumber;
    }
    this.form = new FormGroup({
      'building': new FormControl(this.guestStay.room.building.name, Validators.required),
      'room': new FormControl(this.guestStay.room.roomNumber, Validators.required),
      'checkInDate': new FormControl({ value: this.guestStay.checkInDate, disabled: true}),
      'checkOutDate': new FormControl({ value: this.guestStay.checkOutDate, disabled: true})
    });
  }

  onBuildingSelected(building: Building) {
    this.selectedBuilding = building;
    this.selectedRoom = null;
    this.selectedRoomNumber = "";
    this.loadRooms();
  }

  onRoomSelected(room: Room) {
    this.selectedRoom = room;
    this.selectedRoomNumber = room.roomNumber;
  }

  loadRooms() {
  this.gueststayService.getRooms({buildingId: this.selectedBuilding.id, onlyAvailableRooms: true} )
      .subscribe((availableRooms: Room[]) => {
        this.availableRooms = availableRooms;
      }, error => { var i = ""; });
  }

  save() {
    this.guestStay.checkInDate = this.form.get('checkInDate').value;
    this.guestStay.checkOutDate = this.form.get('checkOutDate').value;
    
    if (this.selectedRoom != null && this.selectedBuilding != null) {
      this.guestStay.room = this.selectedRoom;
      this.guestStay.roomId = this.selectedRoom.id;

      this.guestStay.building = this.selectedBuilding;
      this.guestStay.buildingId = this.selectedBuilding.id;
    }
    this.dialogRef.close(this.guestStay);
  }

  close() {
    this.dialogRef.close();
  }

  buildingFocusOut() {
    if(this.selectedBuilding != null ) {
      this.selectedBuildingName = this.selectedBuilding.name;
    }
  }

  roomFocusOut() {
    if(this.selectedRoom != null ) {
      this.selectedRoomNumber = this.selectedRoom.roomNumber
    }
  }


}
