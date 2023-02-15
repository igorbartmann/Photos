import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { catchError, map, Observable } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable({ providedIn: 'root'})
export class LoginGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        return this.authService
            .verifyAuthentication()
            ?.pipe(
                map(() => { 
                    // Se entrou aqui, ocorreu sucesso na requisição.
                    // Sucesso => Usuário Autenticado, não deve permitir acessar o login.
                    this.router.navigateByUrl('/photos/list');
                    return false; 
                }),
                catchError(async (erro) => {
                    // Se entrou aqui, ocorreu erro na requisição, como 401 => Unauthorized.
                    // Erro => Usuário Não Autenticado, deve permitir acessar o login.
                    return true; 
                })
            ) ?? true; // Caso não tenha feito a requisição, siginifica que não possui token salvo no front, então deve permitir acessar o login.
    }
}