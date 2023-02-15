import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PhotoService } from '../photo/photo.service';
import { IPhoto } from '../photoModel';

@Component({
  selector: 'app-photo-list',
  templateUrl: './photo-list.component.html',
  styleUrls: ['./photo-list.component.css']
})
export class PhotoListComponent implements OnInit {
  filter: string = '';
  photos: IPhoto[] = [];
  hasMore: boolean = true;
  currentPage: number = 0;
  recordsByPage: number = 2;

  // Construtor apenas para injeção de dependências.
  constructor (private activatedRoute: ActivatedRoute, private photoService: PhotoService) { }

  // método chamado ao inicializar o componente.
  ngOnInit(): void {
    this.photos = this.activatedRoute.snapshot.data['photos'] 
  }  

  load() {
    this.photoService
      .getAllPaginated(++this.currentPage, this.recordsByPage)
      .subscribe(newPhotos => {
        this.filter = '';
        this.photos = this.photos.concat(newPhotos);

        if (!newPhotos.length) {
          this.hasMore = false;
        }
      });
  }
}
