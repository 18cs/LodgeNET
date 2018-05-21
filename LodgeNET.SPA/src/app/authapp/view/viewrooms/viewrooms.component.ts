import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { RoomsdialogComponent } from '../dialogcomponents/roomsdialog/roomsdialog.component';
import { Room } from '../../../_models/room';
import { Pagination, PaginatedResult } from '../../../_models/pagination';
import { Building } from '../../../_models/building';
import { AlertifyService } from '../../../_services/alertify.service';
import { BuildingService } from '../../../_services/building.service';
import { GueststayService } from '../../../_services/gueststay.service';

@Component({
  selector: 'app-viewrooms',
  templateUrl: './viewrooms.component.html',
  styleUrls: ['./viewrooms.component.css']
})
export class ViewroomsComponent implements OnInit {
  roomList: Room[];
  buildingList: Building[];
  pageSize = 10;
  pageNumber = 1;
  pagination: Pagination;

  constructor(
    private guestStayService: GueststayService,
    private buildingService: BuildingService,
    private alertify: AlertifyService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.loadRooms();
  }

  loadRooms() {
    if (this.pagination == null) {
      this.guestStayService.getRooms(this.pageNumber, this.pageSize)
        .subscribe((paginatedResult: PaginatedResult<Room[]>) => {
          this.roomList = paginatedResult.result;
          console.log(paginatedResult.pagination);
          console.log(this.buildingList);
          this.pagination = paginatedResult.pagination;
        }, error => { this.alertify.error(error); });
    } else {
      this.guestStayService.getRooms(this.pagination.currentPage, this.pagination.itemsPerPage)
        .subscribe((paginatedResult: PaginatedResult<Room[]>) => {
          this.roomList = paginatedResult.result;
          console.log(this.buildingList);
          console.log(this.roomList);
          this.pagination = paginatedResult.pagination;
        }, error => { this.alertify.error(error); });
    }
  }

  getAllBuildings() {
    this.buildingService.getAllBuildings().subscribe(
        (buildingList: Building[]) => {
          this.buildingList = buildingList;
        },
        error => {
          this.alertify.error(error);
        }
      );
  }

  openAddDialog() {
    const dialogConfig = new MatDialogConfig();
    this.getAllBuildings();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      title: 'Add Room',
      buildingList: this.buildingList,
      room: {
        roomNumber: '',
        surgeMultiplier: 0,
        capacity: 0,
        squareFootage: 0,
        floor: 0,
        buildingId: 0,
        roomType: '',
        currentGuestCount: 0
      } as Room
    };

    const dialogRef = this.dialog.open(RoomsdialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(data => {
      if (data != null) {
        this.guestStayService.addRoom(data).subscribe(
          success => {
            this.alertify.success(data.name + ' successfully added.');
            this.loadRooms();
          },
          error => {
            this.alertify.error(error);
          }
        );
      }
    });
  }

  openDialog(room) {
    const dialogConfig = new MatDialogConfig();
    this.getAllBuildings();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      title: 'Edit ' + room.roomNumber,
      room: room,
      buildingList: this.buildingList
    };

    const dialogRef = this.dialog.open(RoomsdialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(data => {
      if (data != null) {
        this.guestStayService.saveRoomEdit(data).subscribe(
          success => {
            this.alertify.success(data.roomNumber + ' successfully updated.');
          },
          error => {
            this.alertify.error(error);
          }
        );
      }
    });
  }

  deleteRoomById(room) {
    console.log(room.id);
    if (room != null) {
      this.alertify.confirm(
        'Are you sure you wish to delete ' + room.roomNumber + '? <br /> <br /> WARNING: All stays of this room will be deleted.',
        () => {
          this.guestStayService.deleteRoomById(room.id).subscribe(
            success => {
              this.alertify.success(room.roomNumber + ' successfully deleted.');
              const rmIndex = this.roomList.indexOf(room);

              if (rmIndex !== -1) {
                this.roomList.splice(rmIndex, 1);
              }
            },
            error => {
              console.log(error);
            }
          );
        }
      );
    }
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadRooms();
  }

}
