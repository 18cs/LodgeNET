import { Injectable } from '@angular/core';
import { GuestStay } from '../_models/guestStay';
import { FormGroup } from '@angular/forms';

@Injectable()
export class CheckinService {
guestStay: GuestStay;

constructor() {}

saveGuestInfo(guestInfo: FormGroup) {
    this.guestStay = {formData: guestInfo};
}

}
