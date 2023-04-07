import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, finalize, Observable, switchMap, tap, throwError } from "rxjs";
import { TokenService } from "../token/token.service";
import { AuthService } from "./auth.service";
import { AlertService } from "src/app/shared/components/alert/alert.service";

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
    constructor(private tokenService: TokenService, private authService: AuthService, private router: Router, private alertService: AlertService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const isRefreshingToken = req.url.includes('/refreshToken');
        req = this.setHeaderAuthorization(req, isRefreshingToken);

        return next
            .handle(req)
            .pipe(
                catchError(error => {
                    if (error instanceof HttpErrorResponse && error.status === 401) {
                        if (isRefreshingToken) {
                            this.alertService.warning('Sua sessão expirou, faça login novamente!');
                            this.authService.logout();

                            return throwError(error);
                        } else if (this.tokenService.hasRefreshToken()) {
                            return this.handle401Error(req, next);   
                        }
                    }

                    return throwError(error);
                })
            );
    }

    private handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.authService.refreshToken()
            .pipe(
                switchMap(() => {
                    req = this.setHeaderAuthorization(req);
                    return next.handle(req);
                })
            );
    }

    private setHeaderAuthorization(req: HttpRequest<any>, isRefreshing: boolean = false) : HttpRequest<any> {
        const token = this.getToken(isRefreshing);

        if (token) {
            req = req.clone({ setHeaders: { 'Authorization': `Bearer ${token}` }});
        }

        return req;
    }

    private getToken(isRefreshing: boolean): string | null {
        let token: string | null = null;

        if (isRefreshing && this.tokenService.hasRefreshToken()) {
            token = this.tokenService.getRefreshToken();
        }
        else if (!isRefreshing && this.tokenService.hasToken()) {
            token = this.tokenService.getToken();
        }

        return token;
    }
}