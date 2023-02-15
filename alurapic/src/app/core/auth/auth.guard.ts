import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { catchError, map, Observable } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
        return this.authService
            .verifyAuthentication()
            ?.pipe(
                map(() => {
                    // Se entrou aqui, está autenticado.
                    return true;
                }), 
                catchError(async () => {
                    // Se entrou aqui, não está autenticado.
                    this.router.navigate(['/home'], { queryParams: { redirectTo: state.url }});
                    return false;
                })
            ) ?? false;
    } 
}