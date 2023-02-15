export interface ApiToken
{
    token: string;
    refreshToken: string;
}

export class ApiToken
{
    token: string;
    refreshToken: string;

    constructor (token: string, refreshToken: string) {
        this.token = token;
        this.refreshToken = refreshToken; 
    }
}