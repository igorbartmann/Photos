import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { ApiToken } from "./api-token";

const localStorageToken = 'authToken';
const localStorageRefreshToken = 'authRefreshToken';

@Injectable({ providedIn: 'root' })
export class TokenService
{
    private changeTokenSubject = new Subject<null>();

    getToken() : string | null {
        return window.localStorage.getItem(localStorageToken);
    }

    getRefreshToken(): string | null {
        return window.localStorage.getItem(localStorageRefreshToken);
    }

    setToken(apiToken: ApiToken) : void {
        window.localStorage.setItem(localStorageToken, apiToken.token);
        window.localStorage.setItem(localStorageRefreshToken, apiToken.refreshToken);
        this.changedToken();
    }

    hasToken() : boolean {
        return !!this.getToken();
    }

    hasRefreshToken() : boolean {
        return !!this.getRefreshToken();
    }

    removeToken() {
        //window.localStorage.clear();
        window.localStorage.removeItem(localStorageToken)
        window.localStorage.removeItem(localStorageRefreshToken)
        this.changedToken();
    }

    notifyWhenChangeToken() {
        return this.changeTokenSubject.asObservable();
    }

    private changedToken() {
        this.changeTokenSubject.next(null);
    }
}