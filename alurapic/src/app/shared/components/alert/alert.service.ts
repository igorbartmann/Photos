import { Injectable } from "@angular/core";
import { NavigationStart, Router } from "@angular/router";
import { Subject } from "rxjs";

import { Alert, AlertType } from "./alert";

@Injectable({providedIn: 'root'})
export class AlertService {
    alertSubject: Subject<Alert | null> = new Subject<Alert | null>();
    clearAfterRouteChange: boolean = false;

    constructor(router: Router) {
        router.events.subscribe((event) => {
            if (event instanceof NavigationStart) {
                if (this.clearAfterRouteChange) {
                    this.clear();
                } else {
                    this.clearAfterRouteChange = true;
                }
            }
        });
    }

    getAlert() {
        return this.alertSubject.asObservable();
    }

    success(message: string, clearAfterRouteChange: boolean = false) {
        this.alert(AlertType.SUCCESS, message, clearAfterRouteChange);
    }

    warning(message: string, clearAfterRouteChange: boolean = false) {
        this.alert(AlertType.WARNING, message, clearAfterRouteChange);
    }

    danger(message: string, clearAfterRouteChange: boolean = false) {
        this.alert(AlertType.DANGER, message, clearAfterRouteChange);
    }

    info(message: string, clearAfterRouteChange: boolean = false) {
        this.alert(AlertType.INFO, message, clearAfterRouteChange);
    }

    private alert(type: AlertType, message: string, clearAfterRouteChange: boolean) {
        this.clearAfterRouteChange = clearAfterRouteChange;

        this.alertSubject.next(new Alert(type, message));
    }

    clear() {
        this.alertSubject.next(null);
    }
}