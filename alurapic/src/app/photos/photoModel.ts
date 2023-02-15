import { IComment } from "./CommentModel";

export interface IPhoto {
    id: number;
    description: string;
    postDate: Date;
    numberLiks: number;
    allowComments: boolean;
    numberComments: number;
    comments: IComment[];
    url: string;
    userId: number;
}