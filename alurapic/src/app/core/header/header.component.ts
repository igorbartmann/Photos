import { Component } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { User } from "../user/user";
import { UserService } from "../user/user.service";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['header.component.css']
})
export class HeaderComponent {
    user!: User;

    constructor(userService: UserService, private authService: AuthService) {
        // Coloca o Observable<User> dentro de uma propriedade.
        userService
            .getUser()
            .subscribe(user => this.user = user);
    }

    doLogout() {
        this.authService.logout();
    }
}