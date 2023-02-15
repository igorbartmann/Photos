export interface ILog {
    id: number;
    user: string;
    message: string;
    url: string;
    stack: string;
}

export class LogCreate {
    message: string;
    url: string;
    stack: string;

    constructor(message: string, url: string, stack: string) {
        this.message = message;
        this.url = url;
        this.stack = stack;
    }
}