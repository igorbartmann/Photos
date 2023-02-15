export class Alert {
    // type: AlertType;
    // message: string;

    // Não é necessário adicionar popular os itens acima no contrutor, pois ts possibilita via 'public'/'private' no construtor
    constructor(public readonly type: AlertType, public readonly message: string) {}
}

export enum AlertType {
    SUCCESS = 0,
    WARNING = 1,
    DANGER = 2,
    INFO = 3
}