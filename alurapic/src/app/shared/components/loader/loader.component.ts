import { Component, OnInit } from "@angular/core";
import { map } from "rxjs";
import { LoaderService } from "./loader.service";

@Component({
    selector: 'app-loader',
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {
    loaderClass!: string;

    constructor(private loaderService: LoaderService) {}

    ngOnInit(): void {
        this.loaderService
            .getLoader()
            .pipe(map(loaderType => loaderType.valueOf()))
            .subscribe((loaderTypeString) => {
                this.loaderClass = loaderTypeString;
            });
    }
}