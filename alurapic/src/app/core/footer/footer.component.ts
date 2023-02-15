import { Component, OnInit } from "@angular/core";
import { IUser } from "../user/user";
import { UserService } from "../user/user.service";

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
    user!: IUser;
    
    constructor(private userService: UserService) { }

    ngOnInit(): void {
        this.userService
            .getUser()
            .subscribe(userSubscribed => this.user = userSubscribed);
    }
}