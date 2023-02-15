import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { PlatformDetectorService } from "src/app/core/platform-detector/platform-detector.service";
import { lowerCaseValidator } from "src/app/shared/validators/lower-case.validator";
import { INewUser } from "./new-user";
import { SignUpService } from "./signup.service";
import { UserNotTakenValidatorService } from "./user-not-taken.validator.service";
import { userNamePasswordValidator } from "./username-password.validator";

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.html'],
    providers: [ UserNotTakenValidatorService ]
})
export class SignUpComponent implements OnInit {
    signupForm!: FormGroup;
    @ViewChild('inputNomeCompleto') inputNomeCompleto!: ElementRef<HTMLInputElement>;

    constructor(
        private formBuilder: FormBuilder, 
        private platformDetectorService: PlatformDetectorService,
        private signupService: SignUpService, 
        private userNotTakenValidatorService: UserNotTakenValidatorService,
        private router: Router) { }

    ngOnInit(): void {        
        this.signupForm = this.formBuilder.group({
            nomeCompleto: new FormControl('', 
                [
                    Validators.required,
                    Validators.minLength(3), 
                    Validators.maxLength(40)
                ],
                this.userNotTakenValidatorService.checkUserNameTaken()
            ),
            email: new FormControl('', 
                [
                    Validators.required,
                    Validators.email
                ]
            ),
            senha: new FormControl('', 
                [
                    Validators.required, 
                    Validators.minLength(3), 
                    Validators.maxLength(14)
                ]
            ),
            role: new FormControl('', 
                [
                    Validators.required,
                    lowerCaseValidator, // Validators.pattern(/^[a-z09_\-]+$/),
                    Validators.minLength(2),
                    Validators.maxLength(30)
                ]
            ),
        }, { validator: userNamePasswordValidator});

        if (this.platformDetectorService.isPlatformBrowser()) {
            this.inputNomeCompleto?.nativeElement.focus();
        }
    }

    signup() {
        if (this.signupForm.invalid || this.signupForm.pending){
            return;
        }

        const newUser = this.signupForm.getRawValue() as INewUser;

        this.signupService
            .signup(newUser)
            .subscribe(
                () => this.router.navigateByUrl(''),
                (error) => console.log(error)
            );
    }
}