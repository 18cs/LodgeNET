import { Building } from "./building";

export interface Room {
    id: number;
    roomNumber: string;
    surgeCapacity: number;
    capacity: number;
    squareFootage: number;
    floor: number;
    buildingId: number;
    building?: Building;
    roomType?: string;
    currentGuestCount?: number;
}
