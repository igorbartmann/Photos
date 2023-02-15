import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { TokenService } from "../token/token.service";
import { IUser, User } from "./user";
import jwt_decode from 'jwt-decode';

const userDefault: IUser = new User(0, "", "", "");

@Injectable({ providedIn: 'root' })
export class UserService {
    private userSubject = new BehaviorSubject<IUser>(userDefault);

    constructor(private tokenService: TokenService) {
        if (this.tokenService.hasToken()) {
            this.decodeAndNotify();
        } 

        tokenService
            .notifyWhenChangeToken()
            .subscribe(() => this.decodeAndNotify());
    }

    getUser() {
        return this.userSubject.asObservable();
    }

    private decodeAndNotify() {
        const token = this.tokenService.getToken(); // Para garantir que está no LocalStorage.
        if (!token) {
            this.setUserDefault();
            return;
        }

        const user = jwt_decode(token) as any;
        this.userSubject.next(new User(user.id, user.name, user.email, user.role));
    }

    private setUserDefault() {
        this.userSubject.next(userDefault);
    }
}