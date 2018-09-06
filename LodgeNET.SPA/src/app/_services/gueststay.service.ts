import { Injectable } from '@angular/core';
import { PaginatedResult } from '../_models/pagination';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Room } from '../_models/room';
import { GuestStayCheckIn } from '../_models/guestStayCheckIn';
import { GuestStayEdit } from '../_models/guestStayEdit';
import { FormGroup } from '@angular/forms';
import { GuestStayDto } from '../_models/guestStayDto';
import { Guest } from '../_models/guest';
import { GuestParams } from '../_models/params/guestParams';
import { RoomParams } from '../_models/params/roomParams';
import { GuestStayParams } from '../_models/params/guestStayParams';
import { GuestStayDisplay } from '../_models/display/guestStayDisplay';
import { RoomDisplay } from '../_models/display/roomDisplay';
import { GuestDisplay } from '../_models/display/guestDisplay';

@Injectable()
export class GueststayService {
    baseUrl = environment.apiUrl;
    guestStay: GuestStayCheckIn = { guestId: 0 };

    isGuestInfoValid = false;
    isRoomSelected = false;

    constructor(private http: HttpClient) { }

    getGuestsPagination(page?, itemsPerPage?, userParams?: GuestParams) {
        const paginatedResult: PaginatedResult<Guest[]> = new PaginatedResult<Guest[]>();
        let params = new HttpParams();

        if (userParams != null) {
            params = this.processGuestParams(userParams);
        }

        if (page != null && itemsPerPage != null) {
            params = params.append('pageNumber', page);
            params = params.append('pageSize', itemsPerPage);
        }

        return this.http.
            get<Guest[]>(this.baseUrl + 'gueststay/getguestspagination', { observe: 'response', params })
            .pipe(map((response) => {
                paginatedResult.result = response.body;

                if (response.headers.get('Pagination') != null) {
                    paginatedResult.pagination = JSON.parse(
                        response.headers.get('Pagination'));
                }
                return paginatedResult;
            }));
    }

    getGuestsDisplay(userParams?: GuestParams) {
        let params = new HttpParams();
        if (userParams != null) {
            params = this.processGuestParams(userParams);
        }
        return this.http.get<GuestDisplay[]>(this.baseUrl + 'gueststay/getguestsdisplay', { params });
    }

    private processGuestParams(userParams: GuestParams): HttpParams {
        let params = new HttpParams();
        params = params.append('lastName', userParams.lastName);
        params = params.append('serviceId', userParams.serviceId.toString());
        params = params.append('rankId', userParams.rankId.toString());
        params = params.append('gender', userParams.gender);
        params = params.append('unitId', userParams.unitId.toString());
        if (userParams.dodId != null) {
            params = params.append('dodId', userParams.dodId.toString());
        }
        return params;
    }

    updateGuest(model: any) {
        return this.http.post(this.baseUrl + 'gueststay/updateguest', model, {
            headers: new HttpHeaders()
                .set('Content-Type', 'application/json')
        });
    }

    deleteGuest(id: number) {
        return this.http.delete(this.baseUrl + 'gueststay/deleteguest/' + id);
    }

    //TODO look to remove and use getRoomsPagination with params
    getAvaliableRooms(page?, itemsPerPage?, buildingId?, onlyAvailableRooms?): Observable<PaginatedResult<Room[]>> {
        const paginatedResult: PaginatedResult<Room[]> = new PaginatedResult<Room[]>();
        let params = new HttpParams();

        if (page != null && itemsPerPage != null) {
            params = params.append('pageNumber', page);
            params = params.append('pageSize', itemsPerPage);
        }

        if (buildingId != null) {
            params = params.append('buildingId', buildingId);
        }

        if (onlyAvailableRooms != null) {
            params = params.append('onlyAvailableRooms', onlyAvailableRooms);
        }

        return this.http.
            get<Room[]>(this.baseUrl + 'gueststay/availableRooms', { observe: 'response', params })
            .pipe(map((response) => {
                paginatedResult.result = response.body;

                if (response.headers.get('Pagination') != null) {
                    paginatedResult.pagination = JSON.parse(
                        response.headers.get('Pagination'));
                }
                return paginatedResult;
            }));
    }

    getRoomsPagination(page?, itemsPerPage?, userParams?: RoomParams): Observable<PaginatedResult<Room[]>> {
        const paginatedResult: PaginatedResult<Room[]> = new PaginatedResult<Room[]>();
        let params = new HttpParams();

        if (userParams != null) {
            params = this.processRoomUserParams(userParams);
        }

        if (page != null && itemsPerPage != null) {
            params = params.append('pageNumber', page);
            params = params.append('pageSize', itemsPerPage);
        }

        return this.http.
            get<Room[]>(this.baseUrl + 'gueststay/getroomspagination', { observe: 'response', params })
            .pipe(map((response) => {
                paginatedResult.result = response.body;
                if (response.headers.get('Pagination') != null) {
                    paginatedResult.pagination = JSON.parse(
                        response.headers.get('Pagination'));
                }
                return paginatedResult;
            }));
    }

    getRooms(userParams?: RoomParams): Observable<Room[]> {
        let params = new HttpParams();

        if (userParams != null) {
            params = this.processRoomUserParams(userParams);
        }

        return this.http.get<Room[]>(this.baseUrl + 'gueststay/getrooms', { params });
    }

    getRoomsDisplay(userParams?: RoomParams): Observable<RoomDisplay[]> {
        let params = new HttpParams();

        if (userParams != null) {
            params = this.processRoomUserParams(userParams);
        }

        return this.http.get<RoomDisplay[]>(this.baseUrl + 'gueststay/getroomsdisplay', { params });
    }

    private processRoomUserParams(userParams: RoomParams): HttpParams {
        let params = new HttpParams();

        if (userParams.buildingId != null) {
            params = params.append('buildingId', userParams.buildingId.toString());
        }

        if (userParams.onlyAvailableRooms != null) {
            params = params.append('onlyAvailableRooms', userParams.onlyAvailableRooms.toString());
        }

        if (userParams.roomNumber != null) {
            params = params.append('roomNumber', userParams.roomNumber);
        }
        return params;
    }

    saveRoomEdit(model: Room) {
        return this.http.post(this.baseUrl + 'gueststay/editroom', model, {
            headers: new HttpHeaders()
                .set('Content-Type', 'application/json')
        });
    }

    addRoom(model: Room) {

        return this.http.post(this.baseUrl + 'gueststay/addroom', model, {
            headers: new HttpHeaders()
                .set('Content-Type', 'application/json')
        });
    }

    deleteRoomById(roomId: number) {
        return this.http.delete(this.baseUrl + 'gueststay/room/' + roomId);
    }

    getExistentGuest(dodId) {
        let params = new HttpParams();
        params = params.append('dodId', dodId);
        return this.http.get<GuestStayCheckIn>(this.baseUrl + 'gueststay/existentguest', { params });
    }

    getGuestStays(guestStayParams: GuestStayParams) {
        let params = this.processGuestStaysParams(guestStayParams);
        return this.http.get<GuestStayEdit[]>(this.baseUrl + 'gueststay/getgueststays', { params });
    }

    getGuestStaysPagination(page?, itemsPerPage?, userParams?: GuestStayParams): Observable<PaginatedResult<GuestStayEdit[]>> {
        const paginatedResult: PaginatedResult<GuestStayEdit[]> = new PaginatedResult<GuestStayEdit[]>();
        let params = new HttpParams();

        if (userParams != null) {
            params = this.processGuestStaysParams(userParams);
        }

        if (page != null && itemsPerPage != null) {
            params = params.append('pageNumber', page);
            params = params.append('pageSize', itemsPerPage);
        }

        return this.http.
            get<GuestStayEdit[]>(this.baseUrl + 'gueststay/getgueststayspagination', { observe: 'response', params })
            .pipe(map((response) => {
                paginatedResult.result = response.body;
                if (response.headers.get('Pagination') != null) {
                    paginatedResult.pagination = JSON.parse(
                        response.headers.get('Pagination'));
                }
                return paginatedResult;
            }));
    }

    getGuestStaysDisplay(guestStayParams: GuestStayParams) {
        let params = this.processGuestStaysParams(guestStayParams);
        return this.http.get<GuestStayDisplay[]>(this.baseUrl + 'gueststay/getgueststaysdisplay', { params });
    }

    private processGuestStaysParams(guestStayParams: GuestStayParams): HttpParams {
        let params = new HttpParams();

        if (guestStayParams.dodId != null) {
            params = params.append('dodId', guestStayParams.dodId.toString());
        }

        if (guestStayParams.lastName != null) {
            params = params.append('lastName', guestStayParams.lastName);
        }

        if (guestStayParams.roomNumber != null) {
            params = params.append('roomNumber', guestStayParams.roomNumber);
        }

        if (guestStayParams.guestId != null) {
            params = params.append('guestId', guestStayParams.guestId.toString());
        }

        if (guestStayParams.currentStaysOnly != null) {
            params = params.append('currentStaysOnly', guestStayParams.currentStaysOnly.toString());
        }

        if (guestStayParams.buildingId != null) {
            params = params.append('buildingId', guestStayParams.buildingId.toString());
        }

        if (guestStayParams.serviceId != null) {
            params = params.append('serviceId', guestStayParams.serviceId.toString());
        }
        
        return params;
    }

    updateGuestStay(model: any) {
        return this.http.post(this.baseUrl + 'gueststay/updategueststay', model, {
            headers: new HttpHeaders()
                .set('Content-Type', 'application/json')
        });
    }

    checkOutGuest(guestStay: GuestStayEdit) {
        return this.http.post(this.baseUrl + 'gueststay/checkout', guestStay);
    }

    saveRetrievedGuestInfo(guestInfo: GuestStayCheckIn) {
        if (guestInfo.guestId !== 0 && guestInfo.guestId != null) {
            this.guestStay = guestInfo;
            this.guestStay.room = null;
            this.isRoomSelected = false;
        }
    }

    saveGuestInfo(guestInfo: FormGroup) {
        let guestId = this.guestStay.guestId;
        // let guestInfo = guestForm.value;

        // this.isRoomSelectionEnabled = !guestForm.invalid;

        this.guestStay = {
            dodId: (guestInfo['dodId'] == null) ? null : guestInfo['dodId'],
            firstName: (guestInfo['firstName'] == null) ? null : guestInfo['firstName'],
            middleInitial: (guestInfo['middleInital']) ? null : guestInfo['middleInitial'],
            lastName: (guestInfo['lastName'] == null) ? null : guestInfo['lastName'],
            gender: (guestInfo['gender'] == null) ? null : guestInfo['gender'],
            service: (guestInfo['service'] == null) ? null : guestInfo['service'],
            rank: (guestInfo['rank'] == null) ? null : guestInfo['rank'],
            guestUnit: (guestInfo['guestUnit'] == null) ? null : guestInfo['guestUnit'],
            chalk: (guestInfo['guestChalk'] == null) ? null : guestInfo['guestChalk'],
            email: (guestInfo['email'] == null) ? null : guestInfo['email'],
            dsnPhone: (guestInfo['dsnPhone'] == null) ? null : guestInfo['dsnPhone'],
            commPhone: (guestInfo['commPhone'] == null) ? null : guestInfo['commPhone'],
            guestId: (guestId == null) ? 0 : guestId
        };
    }

    saveRoomSelection(room: Room) {
        this.guestStay.room = room;
    }

    checkinGuest() {
        // guest members are populated at different points, reason for nullable members
        if (this.guestStay.dodId == null || this.guestStay.room == null) {
            return null;
        }

        // guestStayDto is more lightwieght, less network traffic
        let guestStayDto: GuestStayDto = {
            dodId: this.guestStay.dodId,
            firstName: this.guestStay.firstName,
            middleInitial: (this.guestStay.middleInitial == null) ? null : this.guestStay.middleInitial,
            lastName: this.guestStay.lastName,
            gender: this.guestStay.gender,
            serviceId: this.guestStay.service.id,
            rankId: this.guestStay.rank.id,
            unitId: this.guestStay.guestUnit.id,
            chalk: this.guestStay.chalk,
            email: this.guestStay.email,
            dsnPhone: this.guestStay.dsnPhone == null ? null : this.guestStay.dsnPhone,
            commPhone: (this.guestStay.commPhone == null) ? null : this.guestStay.commPhone,
            roomId: this.guestStay.room.id,
            guestId: this.guestStay.guestId
        };

        return this.http.post(this.baseUrl + 'guestStay/checkin', guestStayDto, {
            headers: new HttpHeaders()
                .set('Content-Type', 'application/json')
        });
    }

    setGuestInfoValid(formValid: boolean) {
        this.isGuestInfoValid = formValid;
    }

    setIsRoomSelected(isRoomSelected: boolean) {
        this.isRoomSelected = isRoomSelected;
    }

    clearGuestStay() {
        this.guestStay = { guestId: 0 };
    }
}
