import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertService } from "src/app/shared/components/alert/alert.service";
import { PhotoService } from "../photo/photo.service";
import { IPhoto } from '../photoModel';

@Component({
    templateUrl: './photo-details.component.html',
    styleUrls: ['./photo-details.component.css']
})
export class PhotoDetailsComponent implements OnInit {
    photo!: IPhoto;

    constructor(
        private activatedRoute: ActivatedRoute, 
        private router: Router,
        private photoService: PhotoService,
        private alertService: AlertService) {}

    ngOnInit(): void {
        // Para sempre recarregar o componente quando a url alterar.
        // -> Note que, originalmente as urls '.../photos/details/1' e '.../photos/details/2' são as mesmas para o angular.
        // Isto faz com que, por padrão, ao alterarmos apenas o id no navegador, ele não recarregue o componente.
        // (photos/details/:id)

        // Forçando recarregar quando a rota mudar.
        this.activatedRoute.params.subscribe(params => {
            let id = params['id'] ?? '';

            if (id && /^([0-9]+|Infinity)$/.test(id))
            {
                let photoId = parseInt(id);
                this.photoService
                    .getById(photoId)
                    .subscribe(
                        photoResponse => this.photo = photoResponse,
                        error => this.router.navigateByUrl('/not-found')
                    );
            }
        });

        // FAZER DA FORMA ACIMA AO INVÉS DA FORMA ABAIXO QUANDO ALTERAR O PARÂMETRO DA ROTA É UM PROBLEMA!
        // let id =  this.activatedRoute.snapshot.paramMap.get('id');

        // if (id && /^([0-9]+|Infinity)$/.test(id))
        // {
        //     let photoId = parseInt(id);
        //     this.photoService
        //         .getById(photoId)
        //         .subscribe(photoResponse => this.photo = photoResponse);
        // }
    }

    deletePhoto()
    {
        this.photoService
            .delete(this.photo.id)
            .subscribe(
                () => {
                    this.alertService.success('Photo deleted!');
                    this.router.navigateByUrl('/photos/list');
                },
                error => {
                    console.error(error);
                    this.alertService.warning('Could not delete the photo!');
                }
            );
    }

    like(photo: IPhoto) {
        this.photoService
            .like(photo.id)
            .subscribe(
                liked => {
                    if (liked) {
                        this.photoService
                            .getById(photo.id)
                            .subscribe(photoResponse => this.photo = photoResponse);
                    }
                },
                err => this.alertService.danger('An error ocurred to like this photo!')
            );
    }

    atualizarPhotoNumberComments(numberComments: number) {
        this.photo.numberComments = numberComments;
    }
}