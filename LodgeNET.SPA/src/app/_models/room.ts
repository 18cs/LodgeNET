export interface Room {
    id: number;
    roomNumber: string;
    surgeMultiplier: number;
    capacity: number;
    squareFootage: number;
    floor: number;
    buildingId: number;
    roomType: string;
    currentGuestCount: number;
}
