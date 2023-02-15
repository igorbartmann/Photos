import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { tap } from "rxjs";
import { TokenService } from "../token/token.service";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";
import { ApiToken } from "../token/api-token";

const urlBaseUserEndpoints = `${environment.apiUrl}/api/users`;

@Injectable({ providedIn: 'root'})
export class AuthService {
    constructor(
        private httpClient: HttpClient,
        private router: Router,
        private tokenService: TokenService) {}

    login(userName: string, password: string) {
        return this.httpClient
            .post(
                `${urlBaseUserEndpoints}/login`, 
                { email: userName, senha: password }, 
                { observe: 'response'}
            )
            .pipe(tap(response => {
                if (response.status == 200 && response.body) {
                    var responseBody = response.body as ApiToken;
                    const token = responseBody.token;
                    const refreshToken = responseBody.refreshToken;

                    this.tokenService.setToken(new ApiToken(token, refreshToken));
                }
                else {
                    var messageError = "Ocorreu um erro ao realizar a autenticação!";
                    
                    console.error(messageError);
                    throw new Error(messageError);
                }
            }));
    }

    refreshToken() {
        return this.httpClient
            .post(
                `${urlBaseUserEndpoints}/refreshToken`,
                null,
                { observe: 'response'}
            )
            .pipe(tap(response => {
                const authToken: string | null = response.headers.get('');
                
                if (authToken) {
                    this.tokenService.setToken(new ApiToken("token", "refreshToken"));
                }
                else {
                    var messageError = "Ocorreu um erro ao realizar a autenticação!";
                    
                    console.error(messageError);
                    throw new Error(messageError);
                }
            }));
    }

    verifyAuthentication() {
        if (!this.tokenService.hasToken()) {
            return;
        }
        
        return this.httpClient.get(`${urlBaseUserEndpoints}/isauthenticated`);
    }

    logout() {
        this.tokenService.removeToken();
        this.router.navigateByUrl('');
    }
}