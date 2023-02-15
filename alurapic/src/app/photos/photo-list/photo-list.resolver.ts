import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { PhotoService } from "../photo/photo.service";
import { IPhoto } from "../photoModel";

@Injectable({ providedIn: 'root'})
export class PhotoListResolver implements Resolve<Observable<IPhoto[]>>{
    constructor (private photoService: PhotoService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Observable<IPhoto[]> {
        return this.photoService.getAllPaginated(0, 2);
    }
}