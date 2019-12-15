import complete from "./models/Complete";
import position from "./models/Position";
import problem from "./models/Problem";
import process from "./models/Process";
import submission from "./models/Submission";
import video, {Video} from "./models/Video";


export class DbHelpers {

    public async createOrUpdateSubmission(userId: string, procedure: string, content: any[]) {
        return await submission.update(
            {userId, procedure},
            {$set: {content}},
            {upsert: true},
        );
    }

    public async getSubmission(userId: string, procedure: string) {
        return await submission.findOne({userId, procedure});
    }

    public async createVideoRecord(content: string) {
        return await video.create({
            content,
        });
    }

    public async createProblemRecord(question: string, type: string, steps: any[]) {
        return await problem.create({
            question,
            steps,
            type,
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

    public async completeSkill(userId: number, topicId: number, skill: number) {
        const record = await complete.findOne({userId, topicId});

        if (record) {
            return await complete.updateOne({userId, topicId}, {$push: {skillsComplete: skill}});
        } else {
            const skillsComplete: number[] = [];
            skillsComplete.push(skill);
            return await complete.create({userId, topicId, skillsComplete});
        }
    }

    public async getCompleteSkills(userId: number, topicId: number) {
        return await complete.findOne({userId, topicId});
    }

    public async createPositionRecord(id: string,
                                      lastPosition: number,
                                      mistakeCount: number,
                                      userId: string,
                                      isFinished: boolean,
                                      correctCount: number) {
        return await position.create({
            correctCount,
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

    public async updatePositionRecord(userId: string, skillId: string, isFinished: boolean, mistakeCount: number,
                                      correctCount: number) {
        return await position.update({userId, skillId}, {correctCount, isFinished, mistakeCount});
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

