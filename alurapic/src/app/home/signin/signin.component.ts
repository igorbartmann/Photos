import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "src/app/core/auth/auth.service";
import { PlatformDetectorService } from "src/app/core/platform-detector/platform-detector.service";

@Component({
    templateUrl: './signin.component.html'
})
export class SignInComponent implements OnInit{
    redirectUrl!: string | null;
    loginForm!: FormGroup;
    @ViewChild('inputUserName') userNameInput!: ElementRef<HTMLInputElement>;

    constructor(
        private formBuilder: FormBuilder, 
        private authService: AuthService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private platformDetectorService: PlatformDetectorService) { }


    ngOnInit(): void {
        this.redirectUrl = this.activatedRoute.snapshot.paramMap.get('redirectTo');

        this.loginForm = this.formBuilder.group({
            userName: new FormControl('', Validators.required),
            password: new FormControl('', Validators.required)
        });

        if (this.platformDetectorService.isPlatformBrowser()) {
            // Se estiver executando no Browser e não no Servidor.
            this.userNameInput?.nativeElement.focus();
        }
    }

    login() {
        const userName = this.loginForm.get('userName')?.value;
        const password = this.loginForm.get('password')?.value;

        if (userName && password) {
            this.authService
                .login(userName, password)
                .subscribe(
                    response => { 
                        let url = this.redirectUrl ?? 'photos/list';

                        this.router.navigateByUrl(url);
                    },
                    error => { 
                        this.loginForm.reset(); 

                        if (this.platformDetectorService.isPlatformBrowser()) {
                            // Se estiver executando no Browser e não no Servidor.
                            this.userNameInput?.nativeElement.focus();
                        }

                        alert('Invalid user name or password!');
                    }
                );
        }
    }
}