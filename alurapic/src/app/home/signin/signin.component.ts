import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "src/app/core/auth/auth.service";
import { PlatformDetectorService } from "src/app/core/platform-detector/platform-detector.service";

@Component({
    templateUrl: './signin.component.html'
})
export class SignInComponent implements OnInit{ 
    loginForm!: FormGroup;
    @ViewChild('inputUserName') userNameInput!: ElementRef<HTMLInputElement>;

    constructor(
        private formBuilder: FormBuilder, 
        private authService: AuthService,
        private router: Router,
        private platformDetectorService: PlatformDetectorService) { }


    ngOnInit(): void {
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
                        this.router.navigateByUrl('photos/list');
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