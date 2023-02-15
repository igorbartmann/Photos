import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LogCreate } from "./log";
import { environment } from "src/environments/environment";

const UrlBaseEndpointsLog = environment.apiUrl + '/api/logs';

@Injectable({ providedIn: 'root' })
export class LogService {
    constructor(private httpClient: HttpClient) {}

    log(logDetails: LogCreate) {
        return this.httpClient.post(UrlBaseEndpointsLog, logDetails);
    }
}