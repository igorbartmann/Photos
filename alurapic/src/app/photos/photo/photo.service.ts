import { HttpClient,  HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { TokenService } from 'src/app/core/token/token.service';
import { IComment, ICreateComment } from '../CommentModel';
import { IPhoto } from '../photoModel';
import { IPhotoUpload } from '../PhotoUploadModel';
import { environment } from 'src/environments/environment'

const urlBasePhotosEndpoints = `${environment.apiUrl}/api/photos`;

@Injectable({ providedIn: 'root' })
export class PhotoService {
    // httpClient: HttpClient;
    // constructor(httpClient: HttpClient) {
    //     this.httpClient = httpClient;
    // }

    // Note que o TypeScript permite fazer o que fiz acima, simplesmente colocando public/private no parâmetro recebido 
    // (automaticamente ele entende e não precisa de uma propriedade para adicionar o httpClient recebido por injeção de dependência).
    constructor(private httpClient: HttpClient, private tokenService: TokenService) { }

    getAll() {
        return this.httpClient.get<IPhoto[]>(urlBasePhotosEndpoints);
    }

    getAllPaginated(page: number, records: number) {
        let requestParams = new HttpParams()
            .append('page', page)
            .append('records', records);

        return this.httpClient.get<IPhoto[]>(urlBasePhotosEndpoints, { params: requestParams });
    }

    getById(photoId: number) {
        return this.httpClient.get<IPhoto>(`${urlBasePhotosEndpoints}/${photoId}`);
    }

    upload(fileUploadModel: IPhotoUpload) {
        const formData = new FormData();
        formData.append('PhotoFile', fileUploadModel.file);
        formData.append('Description', fileUploadModel.description);
        formData.append('AllowComments', fileUploadModel.allowComments ? 'true' : 'false');
        
        return this.httpClient.post(
            urlBasePhotosEndpoints, 
            formData,
            {
                observe: 'events',
                reportProgress: true
            }
        );
    }

    addComments(comment: ICreateComment) {
        return this.httpClient.post(`${urlBasePhotosEndpoints}/${comment.photoId}/comments`, comment);
    }

    getComments(photoId: number) {
        return this.httpClient.get<IComment[]>(`${urlBasePhotosEndpoints}/${photoId}/comments`);
    }

    delete(photoId: number) {
        return this.httpClient.delete(`${urlBasePhotosEndpoints}/${photoId}`);
    }

    like(photoId: number) {
        return this.httpClient
            .put(`${urlBasePhotosEndpoints}/${photoId}/like`, {}, {observe: 'response'})
            .pipe(map(res => true))
            .pipe(catchError(err => { return err.status == '304' ? of(false) : throwError(err); }));
    }
}