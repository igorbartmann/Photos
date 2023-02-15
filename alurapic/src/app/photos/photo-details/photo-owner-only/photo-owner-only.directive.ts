import { Directive, ElementRef, Input, OnInit, Renderer2 } from "@angular/core";
import { UserService } from "src/app/core/user/user.service";
import { IPhoto } from "../../photoModel";

@Directive({
    selector: '[photoOwnerOnly]'
})
export class PhotoOwnerOnlyDirective implements OnInit {
    @Input() ownedPhoto!: IPhoto;

    constructor(
        private element: ElementRef<any>, 
        private renderer: Renderer2,
        private userService: UserService) {}

    ngOnInit(): void {
        this.userService
            .getUser()
            .subscribe((user) => {
                if (user.id != this.ownedPhoto.userId) {
                    this.renderer.setStyle(this.element.nativeElement, 'display', 'none');
                }
            });
    }
}