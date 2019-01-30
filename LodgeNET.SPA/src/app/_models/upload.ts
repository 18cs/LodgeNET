import { User } from "./user";

export class Upload {
    id: number;
    userId: number;
    user: User;
    fileName: string;
    dateUploaded: Date;
    guestsAdded: number;
}
