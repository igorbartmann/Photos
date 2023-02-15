import { Directive, ElementRef, OnInit, Renderer2 } from "@angular/core";
import { AuthService } from "src/app/core/auth/auth.service";
import { TokenService } from "src/app/core/token/token.service";

@Directive({
    selector: '[showIfLogged]'
})
export class ShowIfLoggedDirective implements OnInit {
    defaultDisplayValue!: string;

    constructor(
        private element: ElementRef<any>, 
        private render: Renderer2, 
        private authService: AuthService,
        private tokenService: TokenService) {}

    ngOnInit(): void {
        // Obtém o display do elemento (antes de aplicar a diretiva)!
        this.defaultDisplayValue = getComputedStyle(this.element.nativeElement).display;

        this.tokenService
            .notifyWhenChangeToken()
            .subscribe(() => {
                this.controlDisplay();
            });

        if (this.tokenService.hasToken()) {
            // Se já tiver token quando inicializar, então executa a diretiva!
            this.controlDisplay();
        }
        else {
            this.setDisplayNone();
        }
    }

    private controlDisplay() {
        this.authService
            .verifyAuthentication()
            ?.subscribe(
                () => {
                    // Se ocorreu sucesso, deixa exibir o elemento!
                    this.setDefaultDisplay();
                },
                error => {
                    // Se ocorreu erro então significa que o usuário não está autenticado,
                    // portanto, oculta o elemento.
                    this.setDisplayNone();
                }
            ) ?? this.setDisplayNone(); // Se não possui token, então o usuário não está logado => oculta o elemento.
    }

    private setDefaultDisplay() {
        this.render.setStyle(this.element.nativeElement, 'display', this.defaultDisplayValue);
    }

    private setDisplayNone() {
        this.render.setStyle(this.element.nativeElement, 'display', 'none');
    }
}