import { Component } from "@angular/core";

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css']
})
export class MenuComponent {
    isShow: boolean = false;

    toggleShow() {
        this.isShow = !this.isShow;
    }
}