import { Pipe, PipeTransform } from "@angular/core";
import { IPhoto } from "../photoModel";

@Pipe({ name: 'filterByDescription' })
export class FilterByDescriptionPipe implements PipeTransform{

    transform(photos: IPhoto[], descriptionQuery: string) {
        descriptionQuery = descriptionQuery.trim().toLocaleLowerCase();
        
        if (descriptionQuery) {
            return photos.filter(photo => photo.description.toLocaleLowerCase().includes(descriptionQuery));
        }

        return photos;
    }
}