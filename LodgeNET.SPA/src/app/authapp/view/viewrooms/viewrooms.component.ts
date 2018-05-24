import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { RoomsdialogComponent } from '../dialogcomponents/roomsdialog/roomsdialog.component';
import { Room } from '../../../_models/room';
import { Pagination, PaginatedResult } from '../../../_models/pagination';
import { Building } from '../../../_models/building';
import { AlertifyService } from '../../../_services/alertify.service';
import { BuildingService } from '../../../_services/building.service';
import { GueststayService } from '../../../_services/gueststay.service';
import { Observable } from 'rxjs/Observable';
import { map, startWith } from 'rxjs/operators';
import { RoomParams } from '../../../_models/params/roomParams';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Data } from '@angular/router';
import { AuthService } from '../../../_services/auth.service';

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
  filterParams: RoomParams;
  filteredOptions: Observable<Building[]>;
  buildingName = new FormControl();
  selectedBuilding: Building;
  selectedBuildingName: string;
  showSpinner = false;

  constructor(
    private guestStayService: GueststayService,
    private buildingService: BuildingService,
    private alertify: AlertifyService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    public authService: AuthService
  ) { }

  ngOnInit() {
    this.loadRooms();
    // this.getAllBuildings();
    this.route.data.subscribe((data: Data) => {
      this.buildingList = data['buildings'];
    });
    this.initFilterParams();

    this.filteredOptions = this.buildingName.valueChanges
    .pipe(
      startWith(''),
      map(val => this.buildingFilter(val))
    );
  }

  initFilterParams() {
    this.filterParams = { buildingId: null, onlyAvailableRooms: false, roomNumber: null };
  }

  buildingFilter(val: string): Building[] {
    return this.buildingList.filter(building =>
      building.name.toLowerCase().includes(val.toLowerCase()));
  }

  onBuildingSelected(bldg: Building) {
    this.selectedBuilding = bldg;
  }

  onbuildingFocusOut() {
    if(this.selectedBuilding != null ) {
      this.selectedBuildingName = this.selectedBuilding.name;
    }
  }

  loadRooms() {
    this.showSpinner = true;
    if (this.pagination == null) {
      this.guestStayService.getRooms(this.pageNumber, this.pageSize, this.filterParams)
        .subscribe((paginatedResult: PaginatedResult<Room[]>) => {
          this.showSpinner = false;
          this.roomList = paginatedResult.result;
          this.pagination = paginatedResult.pagination;
        }, error => {
          this.alertify.error(error);
          this.showSpinner = false;
        });
    } else {
      this.guestStayService.getRooms(this.pagination.currentPage, this.pagination.itemsPerPage, this.filterParams)
        .subscribe((paginatedResult: PaginatedResult<Room[]>) => {
          this.roomList = paginatedResult.result;
          this.showSpinner = false;
          this.pagination = paginatedResult.pagination;
        }, error => {
          this.alertify.error(error);
          this.showSpinner = false;
        });
    }
  }

  onSearch() {
    if(this.selectedBuilding != null) {
      this.filterParams.buildingId = this.selectedBuilding.id;
    }
    this.pagination.currentPage = 1;
    this.loadRooms();
  }

  onReset() {
    this.initFilterParams();
    this.selectedBuilding = null;
    this.selectedBuildingName = '';
    this.loadRooms();
  }

  openAddDialog() {
    const dialogConfig = new MatDialogConfig();

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
            this.alertify.success(data.roomNumber + ' successfully added.');
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
              this.alertify.error(error);
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
