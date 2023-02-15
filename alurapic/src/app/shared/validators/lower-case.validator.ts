import { AbstractControl } from "@angular/forms";

export function lowerCaseValidator(control: AbstractControl) {
    if (control.value.trim() && !/^[a-z09_\-]+$/.test(control.value)) {
        return { lowerCase: true }
    }

    return null; // Deve retornar null quando não ocorre erro na validação.
}