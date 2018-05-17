import { Injectable } from '@angular/core';
import { PaginatedResult } from '../_models/pagination';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { Room } from '../_models/room';
import { GuestStayCheckIn } from '../_models/guestStayCheckIn';
import { GuestStayCheckOut } from '../_models/guestStayCheckOut';
import { FormGroup } from '@angular/forms';
import { GuestStayDto } from '../_models/guestStayDto';
import { Guest } from '../_models/guest';
import { GuestParams } from '../_models/params/guestParams';

@Injectable()
export class GueststayService {
    baseUrl = environment.apiUrl;
    guestStay: GuestStayCheckIn = { guestId: 0};

    isGuestInfoValid = false;
    isRoomSelected = false;

    constructor(private http: HttpClient) { }

    getGuests(page?, itemsPerPage?, userParams?: GuestParams) {
        const paginatedResult: PaginatedResult<Guest[]> = new PaginatedResult<Guest[]>();
        let params = new HttpParams();

        if (page != null && itemsPerPage != null) {
            params = params.append('pageNumber', page);
            params = params.append('pageSize', itemsPerPage);
        }

        if (userParams != null) {
            params = params.append('lastName', userParams.lastName);
            params = params.append('serviceId', userParams.serviceId.toString());
            params = params.append('rankId', userParams.rankId.toString());
            params = params.append('gender', userParams.gender);
            params = params.append('unitId', userParams.unitId.toString());
            if (userParams.dodId != null) {
                params = params.append('dodId', userParams.dodId.toString());
            }
        }

        return this.http.
        get<Guest[]>(this.baseUrl + 'gueststay/getguests', { observe: 'response', params })
        .map((response) => {
            paginatedResult.result = response.body;

            if (response.headers.get('Pagination') != null) {
                paginatedResult.pagination = JSON.parse(
                    response.headers.get('Pagination'));
            }
            return paginatedResult;
        })
        .catch(this.handleError);
    }

    updateGuest(model: any) {
        return this.http.post(this.baseUrl + 'gueststay/updateguest', model, {
            headers: new HttpHeaders()
                .set('Content-Type', 'application/json')
        }).catch(this.handleError);
    }

    deleteGuest(id: number) {
        return this.http.delete(this.baseUrl + 'gueststay/deleteguest/' + id).catch(this.handleError);
    }

    getAvaliableRooms(page?, itemsPerPage?, buildingId?, onlyAvailableRooms?): Observable< PaginatedResult<Room[]>> {
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
            .map((response) => {
                paginatedResult.result = response.body;

                if (response.headers.get('Pagination') != null) {
                    paginatedResult.pagination = JSON.parse(
                        response.headers.get('Pagination'));
                }
                return paginatedResult;
            })
            .catch(this.handleError);
    }

    getExistentGuest(dodId) {
        let params = new HttpParams();
        params = params.append('dodId', dodId);
        return this.http.get<GuestStayCheckIn>(this.baseUrl + 'gueststay/existentguest', {params}).catch(this.handleError);
    }

    getGuestStays(dodId?, lastName?, roomNumber?, guestId?) {
        let params = new HttpParams();

        if (dodId != null) {
            params = params.append('dodId', dodId);
        }

        if (lastName != null) {
            params = params.append('lastName', lastName);
        }

        if (roomNumber != null) {
            params = params.append('roomNumber', roomNumber);
        }

        if (guestId != null) {
            params = params.append('guestId', guestId);
        }

        return this.http.get<GuestStayCheckOut[]>(this.baseUrl + 'gueststay/getgueststays', {params}).catch(this.handleError);
    }

    checkOutGuest(guestStay: GuestStayCheckOut) {
        return this.http.post(this.baseUrl + 'gueststay/checkout', guestStay).catch(this.handleError);
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
        console.log(this.guestStay);
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

        return this.http.post(this.baseUrl + 'guestStay/checkin', guestStayDto, {headers: new HttpHeaders()
            .set('Content-Type', 'application/json')}).catch(this.handleError);
    }

    setGuestInfoValid(formValid: boolean) {
        this.isGuestInfoValid = formValid;
    }

    setIsRoomSelected(isRoomSelected: boolean) {
        this.isRoomSelected = isRoomSelected;
    }

    clearGuestStay() {
        this.guestStay = { guestId: 0};
    }

    private handleError(error: any) {
        const applicationError = error.headers.get('Application-Error');
        if (applicationError) {
            return Observable.throw(applicationError);
        }
        const serverError = error['error'];
        let modelStateErrors = '';
        if (serverError) {
            for (const key in serverError) {
                if (serverError[key]) {
                    modelStateErrors += serverError[key] + '\n';
                }
            }
        }
        return Observable.throw(
            modelStateErrors || 'Server Error'
        );

    }
}
