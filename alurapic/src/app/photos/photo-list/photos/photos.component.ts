import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IPhoto } from '../../photoModel';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.css']
})
export class PhotosComponent implements OnChanges {
  @Input() photos: IPhoto[] = [];
  rows: IPhoto[][] = [];

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['photos']) {
      this.rows = this.groupColumns(this.photos);
    }
  }

  groupColumns(photos: IPhoto[]) {
    const newRows: IPhoto[][] = [];

    for (let i = 0; i < photos.length; i += 3){
      newRows.push(photos.slice(i, i + 3));
    }

    return newRows;
  }
}
