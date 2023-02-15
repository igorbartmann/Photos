import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { switchMap } from "rxjs";
import { IComment, ICreateComment } from "../../CommentModel";
import { PhotoService } from "../../photo/photo.service";

@Component({
    selector: 'app-photo-comments',
    templateUrl: './photo-comments.component.html',
    styleUrls: ['./photo-comments.component.css']
})
export class PhotoCommentsComponent implements OnInit {
    @Input() photoId!: number;
    comments!: IComment[];
    
    @Output() changeComments = new EventEmitter<number>();;

    commentForm!: FormGroup;

    constructor(private photoService: PhotoService) {}

    ngOnInit(): void {
        if (this.photoId && this.photoId > 0) {
            this.photoService
                .getComments(this.photoId)
                .subscribe(commentsResponse => {
                    this.atualizarComments(commentsResponse);
                });
        }

        this.commentForm = new FormGroup({
            comment: new FormControl('', [Validators.minLength(2), Validators.maxLength(300)])
        });
    }

    save() {
        var commentText = this.commentForm.get('comment')?.value as string;

        if (commentText) {
            var comment: ICreateComment = {
                photoId: this.photoId,
                description: commentText
            };
            
            this.photoService
                .addComments(comment)
                .pipe(switchMap(() => this.photoService.getComments(this.photoId)))
                .subscribe((commentsResponse) => {
                    this.atualizarComments(commentsResponse);
                    this.commentForm.reset();
                });
        }
    }

    private atualizarComments(comments: IComment[]) {
        this.comments = comments;
        this.changeComments.emit(comments.length);
    }
}