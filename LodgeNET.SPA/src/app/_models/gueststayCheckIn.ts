import { FormGroup } from '@angular/forms';
import { Service } from './service';
import { Rank } from './rank';
import { Unit } from './unit';
import { Room } from './room';
import { Building } from './building';

export interface GuestStayCheckIn {
    dodId?: number;
    firstName?: string;
    middleInitial?: string;
    lastName?: string;
    gender?: string;
    service?: Service;
    rank?: Rank;
    guestUnit?: Unit; 
    chalk?: number;
    email?: string;
    dsnPhone?: number;
    commPhone?: number;
    building?: Building;
    room?: Room;
    guestId?: number;
}
