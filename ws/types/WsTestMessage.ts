export class WsTestMessage {

    public userId: string;
    public topicId: string;
    public content: any[];

    constructor(userId: string, topicId: string, content: any[]) {
        this.userId = userId;
        this.topicId = topicId;
        this.content = content;
    }

}
