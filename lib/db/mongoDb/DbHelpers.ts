import complete from "./models/Complete";
import faq from "./models/FAQ";
import position from "./models/Position";
import problem from "./models/Problem";
import process from "./models/Process";
import question from "./models/Question";
import submission from "./models/Submission";
import testPosition from "./models/TestPosition";
import testSkills from "./models/TestSkills";
import video, {Video} from "./models/Video";


export class DbHelpers {

    public async findCoverableSkills(topicId: string) {
        return await testSkills.findOne({
            topicId,
        });
    }

    public async findCoveredQuestions(skillIds: number[]) {
        return await question.find({
            skillsCovered: {$elemMatch: {skillId: {$in: skillIds}}},
        });
    }

    public async createTestPositionRecord(topicId: string, userId: string) {
        return await testPosition.create({
            correctAnswers: [],
            isFinished: false,
            lastPosition: 0,
            topicId,
            userId,
            wrongAnswers: [],
        });
    }

    public async getTestPositionRecord(userId: string, topicId: string) {
        return await testPosition.findOne({
            topicId,
            userId,
        });
    }

    public async updateTestPositionRecord(topicId: string, userId: string, correctAnswers: any[], wrongAnswers: any[]) {
        return await testPosition.updateOne({topicId, userId}, {
            correctAnswers,
            isFinished: true,
            wrongAnswers,
        });

    }

    public async updateProgress(topicId: string, userId: string, lastPosition: number) {
        return await testPosition.updateOne({topicId, userId}, {
            lastPosition,
        });
    }

    public async createQuestion(skillsCovered: any[], difficulty: number, score: number) {
        return await question.create({skillsCovered, difficulty, score});
    }

    public async getQuestion(id: string) {
        return await question.findOne({_id: id});
    }

    public async deleteQuestion(id: string) {
        return await question.deleteOne({_id: id});
    }

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

    public async createProblemRecord(questionRec: string, type: string, steps: any[]) {
        return await problem.create({
            question: questionRec,
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

    public async loadFAQs() {
        return await faq.find({});
    }

    public async addFAQ(title: string, content: string) {
        return await faq.create({title, content});
    }

    public async editFAQ(recordId: string, object: any) {
        return await faq.updateOne({_id: recordId}, object);
    }

    public async deleteFAQ(recordId) {
        return await faq.deleteOne({_id: recordId});
    }
}

