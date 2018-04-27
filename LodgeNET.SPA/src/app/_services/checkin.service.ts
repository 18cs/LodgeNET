import { Injectable } from '@angular/core';
import { GuestStay } from '../_models/guestStay';
import { Room } from '../_models/room';
import { FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CheckinService {
    guestStay: GuestStay = {};
    baseUrl = environment.apiUrl;

    isGuestInfoValid = false;
    isRoomSelected = false;

    constructor(private http: HttpClient) { }

    saveGuestInfo(guestInfo: FormGroup) {
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
            email: (guestInfo['email'] == null) ? null : guestInfo['email'],
            dsnPhone: (guestInfo['dsnPhone'] == null) ? null : guestInfo['dsnPhone'],
            commPhone: (guestInfo['commPhone'] == null) ? null : guestInfo['commPhone'],
        };
    }

    saveRoomSelection(room: Room) {
        this.guestStay.room = room;
    }

    checkinGuest() {
        //guest members are populated at different points, reason for nullable members
        if (this.guestStay.dodId == null || this.guestStay.room == null) {
            return null;
        }

        return this.http.post(this.baseUrl + 'guestStay/checkin', this.guestStay, {headers: new HttpHeaders()
            .set('Content-Type', 'application/json')}).catch(this.handleError);
    }

    setGuestInfoValid(formValid: boolean) {
        this.isGuestInfoValid = formValid;
    }

    setIsRoomSelected(isRoomSelected: boolean) {
        this.isRoomSelected = isRoomSelected;
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

