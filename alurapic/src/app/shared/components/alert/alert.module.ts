import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { AlertComponenet } from "./alert.component";

@NgModule({
    declarations: [ AlertComponenet ],
    imports: [ CommonModule ],
    exports: [ AlertComponenet ]
})
export class AlertModule {}