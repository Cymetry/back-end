import position from "./models/Position";
import problem from "./models/Problem";
import process from "./models/Process";
import video, {Video} from "./models/Video";


export class DbHelpers {

    public async createVideoRecord(content: string) {
        return await video.create({
            content,
        });
    }

    public async createProblemRecord(question: string, steps: any[]) {
        return await problem.create({
            question,
            steps,
        });
    }

    public async createProcess(problems: any[], videoURL: Video, skillRef: string) {
        return await process.create({
            created: new Date(),
            problems,
            skillRef,
            video: videoURL,
        });
    }

    public async createPositionRecord(id: string,
                                      lastPosition: number,
                                      mistakeCount: number,
                                      userId: string,
                                      isFinished: boolean) {
        return await position.create({
            isFinished,
            lastPosition,
            mistakeCount,
            skillId: id,
            userId,
        });
    }

    public async getPositionRecord(userId: string, skillId: string) {
        return await position.findOne({
            skillId,
            userId,
        });
    }

    public async updatePositionRecord(userId: string, skillId: string, isFinished: boolean, mistakeCount: number) {
        return await position.update({userId, skillId}, {isFinished, mistakeCount});
    }

    public async updatePositionRecordPosition(userId: string, skillId: string, lastPosition: number) {
        return await position.update({userId, skillId}, {lastPosition, isFinished: false});
    }

    public async getProcessRecordBySkillRef(skillRef: string) {
        return await process.findOne({
            skillRef,
        });
    }

    public async getProblemById(id: string) {
        return await problem.findById(id);
    }

    public async getVideoById(id: string) {
        return await video.findById(id);
    }
}

