import { CommonModule } from "@angular/common";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { RequestInterceptor } from "src/app/core/auth/request.interceptor";
import { PhotoComponent } from "./photo.component";

@NgModule({
    declarations: [
        PhotoComponent,
        /*AuthImagePipe*/
    ],
    imports: [
        CommonModule,
        HttpClientModule,
    ],
    exports: [
        PhotoComponent
    ],
    providers: [ 
        {
          provide: HTTP_INTERCEPTORS, 
          useClass: RequestInterceptor, 
          multi: true
        }
      ],
})
export class PhotoModule {}