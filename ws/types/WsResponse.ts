export class WsResponse {

    public message: string;
    public error: string;

    constructor(message: string, error: string) {
        this.message = message;
        this.error = error;
    }

    public toString = () => {
        return JSON.stringify(this);
    }

}
