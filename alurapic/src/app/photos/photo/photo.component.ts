import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment'

const UrlBase = environment.apiUrl;

@Component({
    selector: 'app-photo',
    templateUrl: 'photo.component.html'
})

export class PhotoComponent {
    objectURL!: string | null;
    imageSource!: SafeUrl;

    constructor(private httpClient: HttpClient, private domSanitizer: DomSanitizer) {}

    @Input() textoAlternativo = '';
    @Input() set url (src: string) {
        this.objectURL = null;

        // Caso receber base64!
        if (src.startsWith('data:image')) {
            this.imageSource = this.domSanitizer.bypassSecurityTrustUrl(src);
            return;
        }
        
        // Caso deva requisitar a image, seta a padrão antes de fazer a chamada assíncrona.
        this.imageSource = this.domSanitizer.bypassSecurityTrustUrl('assets/images/default.png');

        // Realizar a chamada assíncrona para buscar a imagem no back-end e setar no front-end.
        this.httpClient
            .get(UrlBase + src, { responseType: 'blob'})
            .subscribe(response => {
                this.objectURL = URL.createObjectURL(response);
                this.imageSource = this.domSanitizer.bypassSecurityTrustUrl(this.objectURL);
            });
    }

    onImageLoad() {
        if (this.objectURL) {
            URL.revokeObjectURL(this.objectURL);
        }
    }
}