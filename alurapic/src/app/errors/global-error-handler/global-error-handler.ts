import { LocationStrategy, PathLocationStrategy } from "@angular/common";
import { ErrorHandler, Injectable, Injector } from "@angular/core";
import { Router } from "@angular/router";

import { LogService } from "./log.service";
import { LogCreate } from "./log";

import { environment } from "src/environments/environment";

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    constructor(private injector: Injector) {}

    handleError(error: any): void {
        const logService = this.injector.get(LogService);
        const location = this.injector.get(LocationStrategy);
        const router = this.injector.get(Router);

        if (environment.production) {
            // Redireciona apenas quando em produção.
            router.navigateByUrl('/error');
        }

        const message = error.message ?? error.toString();

        const url = location instanceof PathLocationStrategy
            ? location.path()
            : error.url && error.url.length > 0 
                ? error.url 
                : '';
        
        const stack = error.stack
            ? error.stack.toString()
            : ' ';

        const logDetails = new LogCreate(message, url, stack);

        logService
            .log(logDetails)
            .subscribe(
                () => console.log('Error logged on server!'),
                err => console.log(`Fail to send error log to server! Error: ${err}`));
    }
}