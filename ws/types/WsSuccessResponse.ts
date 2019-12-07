import {Submission} from "../../lib/db/mongoDb/models/Submission";
import {WsResponse} from "./WsResponse";

export class WsSuccessResponse extends WsResponse {

    public data: Submission;

    constructor(message: string, error: string, data: Submission) {
        super(message, error);
        this.data = data;
    }

    public toString = () => {
        return JSON.stringify(this);
    }

}
