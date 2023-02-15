import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { VMessageComponente } from "./vmessage.component";

@NgModule({
    declarations: [ VMessageComponente ],
    imports: [ CommonModule ],
    exports: [ VMessageComponente ]
})
export class VMessageModule {}