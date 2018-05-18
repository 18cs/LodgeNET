import { Building } from './building';
import { Room } from './room';
import { Guest } from './guest';

export interface GuestStayCheckOut {
    id: number;
    guestId: number;
    guest: Guest;
    roomId: number;
    room: Room;
    buildingId: number;
    building: Building;
    checkInDate: string;
    checkOutDate?: string;
    checkedIn: boolean;
    checkedOut: boolean;
    dateCreated: string;
}
