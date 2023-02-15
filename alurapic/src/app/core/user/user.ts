export interface IUser {
    id: number;
    name: string;
    email: string;
    role: string;
}

export class User implements IUser {
    id: number;
    name: string;
    email: string;
    role: string;

    constructor (id: number, name: string, email: string, role: string) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
    }
}