import { Component, Input } from "@angular/core";
import { Alert, AlertType } from "./alert";
import { AlertService } from "./alert.service";

@Component({
    selector: 'app-alert',
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.css']
})
export class AlertComponenet {
    @Input() timeout: number = 3000;
    alerts: Alert[] = [];

    constructor(private alertService: AlertService) {
        this.alertService
            .getAlert()
            .subscribe((alert) => {
                if (!alert) {
                    this.alerts = [];
                    return;
                }

                this.alerts.push(alert);
                setTimeout(() => this.removeAlert(alert), this.timeout);
            });
    }

    removeAlert(alertToRemove: Alert) {
        this.alerts = this.alerts.filter(alert => alert != alertToRemove);
    }

    getAlertClass(alert: Alert): string {
        if (!alert) {
            return '';
        }
        
        let className: string;
        switch(alert.type) {
            case AlertType.SUCCESS:
                className = 'alert alert-success';
                break;
            case AlertType.WARNING:
                className = 'alert alert-warning';
                break;
            case AlertType.DANGER:
                className = 'alert alert-danger';
                break;
            case AlertType.INFO:
                className = 'alert alert-info';
                break;
            default: 
                throw new Error("Alert type is not defined!");
        }

        return className;
    }
}