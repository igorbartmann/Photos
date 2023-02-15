import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { INewUser } from "./new-user";
import { environment } from "src/environments/environment";

const urlBaseUserEndpoints = `${environment.apiUrl}/api/users`;

@Injectable()
export class SignUpService {
    constructor(private httpClient: HttpClient) { }

    checkUserNameTaken(userName: string) {
        return this.httpClient.get(`${urlBaseUserEndpoints}/isnameinuse?nomeCompleto=${userName}`);
    }

    signup(newUser: INewUser) {
        return this.httpClient.post(`${urlBaseUserEndpoints}/signup`, newUser)
    }
}