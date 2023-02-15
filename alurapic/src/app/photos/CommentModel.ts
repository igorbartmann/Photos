export interface IComment {
    id: number,
    photoId: number
    description: string;
    date: Date;
    userName: string;
}

export interface ICreateComment {
    photoId: number
    description: string;
}