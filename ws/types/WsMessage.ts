export class WsMessage {

    public userId: string;
    public skillId: string;
    public content: any[];

    constructor(userId: string, skillId: string, content: any[]) {
        this.userId = userId;
        this.skillId = skillId;
        this.content = content;
    }

}
