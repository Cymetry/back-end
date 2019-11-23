import position from "./models/Position";
import problem from "./models/Problem";
import process from "./models/Process";
import video, {Video} from "./models/Video";


export class DbHelpers {

    public async createVideoRecord(url: string) {
        return await video.create({
            url,
        });
    }

    public async createProblemRecord(content: string) {
        return await problem.create({
            content,
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
                                      score: number,
                                      userId: string,
                                      isFinished: boolean) {
        return await position.create({
            currentScore: score,
            isFinished,
            lastPosition,
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

    public async updatePositionRecord(userId: string, skillId: string, isFinished: boolean, score: number) {
        return await position.update({userId, skillId}, {isFinished, score});
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

