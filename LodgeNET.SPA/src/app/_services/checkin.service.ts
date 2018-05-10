import { Injectable } from '@angular/core';
import { GuestStayCheckIn } from '../_models/guestStayCheckIn';
import { Room } from '../_models/room';
import { FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { GuestStayDto } from '../_models/guestStayDto';

@Injectable()
export class CheckinService {
    // guestStay: GuestStayCheckIn = { guestId: 0};
    // baseUrl = environment.apiUrl;

    // isGuestInfoValid = false;
    // isRoomSelected = false;

    // constructor(private http: HttpClient) { }

    // saveRetrievedGuestInfo(guestInfo: GuestStayCheckIn) {
    //     if (guestInfo.guestId !== 0 && guestInfo.guestId != null) {
    //         this.guestStay = guestInfo;
    //         this.guestStay.room = null;
    //         this.isRoomSelected = false;
    //     }
    // }

    // saveGuestInfo(guestInfo: FormGroup) {
    //     let guestId = this.guestStay.guestId;
    //     // let guestInfo = guestForm.value;

    //     // this.isRoomSelectionEnabled = !guestForm.invalid;

    //     this.guestStay = {
    //         dodId: (guestInfo['dodId'] == null) ? null : guestInfo['dodId'],
    //         firstName: (guestInfo['firstName'] == null) ? null : guestInfo['firstName'],
    //         middleInitial: (guestInfo['middleInital']) ? null : guestInfo['middleInitial'],
    //         lastName: (guestInfo['lastName'] == null) ? null : guestInfo['lastName'],
    //         gender: (guestInfo['gender'] == null) ? null : guestInfo['gender'],
    //         service: (guestInfo['service'] == null) ? null : guestInfo['service'],
    //         rank: (guestInfo['rank'] == null) ? null : guestInfo['rank'],
    //         guestUnit: (guestInfo['guestUnit'] == null) ? null : guestInfo['guestUnit'],
    //         chalk: (guestInfo['guestChalk'] == null) ? null : guestInfo['guestChalk'],
    //         email: (guestInfo['email'] == null) ? null : guestInfo['email'],
    //         dsnPhone: (guestInfo['dsnPhone'] == null) ? null : guestInfo['dsnPhone'],
    //         commPhone: (guestInfo['commPhone'] == null) ? null : guestInfo['commPhone'],
    //         guestId: (guestId == null) ? 0 : guestId
    //     };
    // }

    // saveRoomSelection(room: Room) {
    //     this.guestStay.room = room;
    // }

    // checkinGuest() {
    //     // guest members are populated at different points, reason for nullable members
    //     if (this.guestStay.dodId == null || this.guestStay.room == null) {
    //         return null;
    //     }

    //     let guestStayDto: GuestStayDto = {
    //         dodId: this.guestStay.dodId,
    //         firstName: this.guestStay.firstName,
    //         middleInitial: (this.guestStay.middleInitial == null) ? null : this.guestStay.middleInitial,
    //         lastName: this.guestStay.lastName,
    //         gender: this.guestStay.gender,
    //         serviceId: this.guestStay.service.id,
    //         rankId: this.guestStay.rank.id,
    //         unitId: this.guestStay.guestUnit.id,
    //         chalk: this.guestStay.chalk,
    //         email: this.guestStay.email,
    //         dsnPhone: this.guestStay.dsnPhone == null ? null : this.guestStay.dsnPhone,
    //         commPhone: (this.guestStay.commPhone == null) ? null : this.guestStay.commPhone,
    //         roomId: this.guestStay.room.id,
    //         guestId: this.guestStay.guestId
    //     };

    //     console.log(guestStayDto);

    //     return this.http.post(this.baseUrl + 'guestStay/checkin', guestStayDto, {headers: new HttpHeaders()
    //         .set('Content-Type', 'application/json')}).catch(this.handleError);
    // }

    // setGuestInfoValid(formValid: boolean) {
    //     this.isGuestInfoValid = formValid;
    // }

    // setIsRoomSelected(isRoomSelected: boolean) {
    //     this.isRoomSelected = isRoomSelected;
    // }

    // clearGuestStay() {
    //     this.guestStay = { guestId: 0};
    // }

    // private handleError(error: any) {
    //     const applicationError = error.headers.get('Application-Error');
    //     if (applicationError) {
    //         return Observable.throw(applicationError);
    //     }
    //     const serverError = error['error'];
    //     let modelStateErrors = '';
    //     if (serverError) {
    //         for (const key in serverError) {
    //             if (serverError[key]) {
    //                 modelStateErrors += serverError[key] + '\n';
    //             }
    //         }
    //     }
    //     return Observable.throw(
    //         modelStateErrors || 'Server Error'
    //     );
    // }
}

