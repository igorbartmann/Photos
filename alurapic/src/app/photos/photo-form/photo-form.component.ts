import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { PhotoService } from '../photo/photo.service';
import { IPhotoUpload } from '../PhotoUploadModel';

@Component({
  selector: 'app-photo-form',
  templateUrl: './photo-form.component.html',
  styleUrls: ['./photo-form.component.css']
})
export class PhotoFormComponent implements OnInit {
  photoForm!: FormGroup;
  preview!: string;
  percentDone!: number;

  constructor(
    private photoService: PhotoService, 
    private router: Router,
    private alertService: AlertService) { }

  ngOnInit(): void {
    this.photoForm = new FormGroup({
      file: new FormControl('', Validators.required),
      description: new FormControl('', Validators.maxLength(300)),
      allowComments: new FormControl(true)
    });
  }

  onFileChange(event: any) {
    const file: File = event.target.files[0];

    // Setando no PhotoForm (FormGroup).
    this.photoForm.patchValue({file: file});

    // Pré-Visualizacao
    const fileReader = new FileReader();
    fileReader.onload = (eventOnLoaded: any) => this.preview = eventOnLoaded.target.result;
    fileReader.readAsDataURL(file);
  }

  upload() {
    const dados = this.photoForm.getRawValue() as IPhotoUpload;

    this.photoService
      .upload(dados)
      .pipe(finalize(() => {
        // Dando sucesso ou erro no subscribe, desejo fazer isto ao finalizar!
        this.router.navigateByUrl('/photos/list');
      }))
      .subscribe(
        (event: HttpEvent<any>) => {
          if (event.type == HttpEventType.UploadProgress) {
            let eventTotal = event.total ?? event.loaded;
            this.percentDone = Math.round(100 * event.loaded / eventTotal);
          } 
          else if (event.type == HttpEventType.Response) {
            this.alertService.success("Upload complete!");
            //this.router.navigateByUrl('/photos/list');
          }
        },
        (err) => {
          this.alertService.danger('Upload error!');
          throw err;
          //this.router.navigateByUrl('/photos/list');
        }
      );
  }
}
