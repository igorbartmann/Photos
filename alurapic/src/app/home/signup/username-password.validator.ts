import { AbstractControl, FormGroup, ValidatorFn } from "@angular/forms";

export const userNamePasswordValidator: ValidatorFn = (control: AbstractControl) => {
    const userName = control.get('nomeCompleto')?.value
    const password = control.get('senha')?.value;

    return userName != password || userName.trim().length == 0
        ? null
        : { userNamePassword: true };
}