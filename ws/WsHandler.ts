import * as WebSocket from "ws";
import {DbHelpers} from "../lib/db/mongoDb/DbHelpers";
import {WsMessage} from "./types/WsMessage";
import {WsResponse} from "./types/WsResponse";
import {WsSuccessResponse} from "./types/WsSuccessResponse";
import {WsTestMessage} from "./types/WsTestMessage";


export class WsHandler {

    public ws: WebSocket;

    private dbHelpers: DbHelpers;

    constructor(ws: WebSocket) {
        this.ws = ws;
        this.dbHelpers = new DbHelpers();
    }

    public insertOrUpdateTestSubmission = async (message: WsTestMessage): Promise<WsResponse> => {
        let result: WsResponse;

        try {
            const progressRecord = await this.dbHelpers.getTestPositionRecord(message.userId, message.topicId);
            if (progressRecord) {
                const testSubmission = await this.dbHelpers.createOrUpdateTestSubmission(
                    message.userId,
                    message.topicId,
                    progressRecord.lastPosition,
                    message.content);
                if (testSubmission) {
                    result = new WsSuccessResponse(
                        "Success",
                        "",
                        testSubmission,
                    );
                } else {
                    result = new WsResponse("Missing Submission", "");
                }
            } else {
                result = new WsResponse("Fail to load procedure", "");
            }
        } catch (e) {
            console.error(e);
            result = new WsResponse("Failure", JSON.stringify(e));
        }

        return result;
    }

    public get = async (message: WsMessage): Promise<WsResponse> => {

        let result: WsResponse;

        try {
            const procedure = await this.dbHelpers.getProcessRecordBySkillRef(message.skillId);
            if (procedure) {
                const submission = await this.dbHelpers.getSubmission(message.userId, procedure._id);
                if (submission) {
                    result = new WsSuccessResponse(
                        "Success",
                        "",
                        submission,
                    );
                } else {
                    result = new WsResponse("Missing Submission", "");
                }
            } else {
                result = new WsResponse("Fail to load procedure", "");
            }
        } catch (e) {
            console.error(e);
            result = new WsResponse("Failure", JSON.stringify(e));
        }

        return result;
    };

    public insertOrUpdate = async (message: WsMessage): Promise<WsResponse> => {

        let result: WsResponse;

        try {
            const procedure = await this.dbHelpers.getProcessRecordBySkillRef(message.skillId);
            if (procedure) {
                const submission = await this.dbHelpers.createOrUpdateSubmission(
                    message.userId,
                    procedure._id,
                    message.content);
                if (submission) {
                    result = new WsSuccessResponse(
                        "Success",
                        "",
                        submission,
                    );
                } else {
                    result = new WsResponse("Missing Submission", "");
                }
            } else {
                result = new WsResponse("Fail to load procedure", "");
            }
        } catch (e) {
            console.error(e);
            result = new WsResponse("Failure", JSON.stringify(e));
        }

        return result;
    }

}
