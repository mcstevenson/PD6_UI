export class User {
    id?: string;
    username?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    token?: string;
    role?:string;
}

export class Jobs {
    jobId?: string;
    clientId?: string;
    clientFirstName?: string;
    clientLastName?: string;
    clientDob?:string;
    postCode?: string;
    timeSlot?: string;
    notes?: string;
    address?: string;
    rating?: string;
}