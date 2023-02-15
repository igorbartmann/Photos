import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HeaderComponent } from "./header/header.component";
import { RouterModule } from "@angular/router";
import { FooterComponent } from "./footer/footer.component";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { RequestInterceptor } from "./auth/request.interceptor";
import { AlertModule } from "../shared/components/alert/alert.module";
import { LoaderModule } from "../shared/components/loader/loader.module";
import { MenuModule } from "../shared/components/menu/menu.module";
import { ShowIfLoggedModule } from "../shared/directives/show-if-logged/show-if-logged.module";

@NgModule({
    declarations: [ 
      HeaderComponent, 
      FooterComponent 
    ],
    imports: [ 
      CommonModule, 
      RouterModule, 
      AlertModule,
      LoaderModule,
      MenuModule,
      ShowIfLoggedModule
    ],
    exports: [ 
      HeaderComponent, 
      FooterComponent 
    ],
    providers: [ 
      { 
        provide: HTTP_INTERCEPTORS, 
        useClass: RequestInterceptor, 
        multi: true
      }
    ],
})
export class CoreModule {}