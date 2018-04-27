import { FormGroup } from '@angular/forms';
import { Service } from './service';
import { Rank } from './rank';
import { Unit } from './unit';
import { Room } from './room';

export interface GuestStay {
    //formData: FormGroup;
    dodId?: number;
    firstName?: string;
    middleInitial?: string;
    lastName?: string;
    gender?: string;
    service?: Service;
    rank?: Rank;
    guestUnit?: Unit;
    email?: string;
    dsnPhone?: number;
    commPhone?: number;
    room?: Room;
}
