import { Injectable } from "@angular/core";
import { AbstractControl } from "@angular/forms";
import { SignUpService } from "./signup.service";

import { debounceTime, first, map, switchMap } from "rxjs/operators";

@Injectable()
export class UserNotTakenValidatorService {
    constructor(private signupService: SignUpService) { }

    checkUserNameTaken() {
        return (control: AbstractControl) => {
            return control
                .valueChanges
                .pipe(debounceTime(300))
                .pipe(switchMap(value => this.signupService.checkUserNameTaken(value)))
                .pipe(map(isTaken => isTaken ? {usernametaken: true} : null))
                .pipe(first());
        }
    }
}