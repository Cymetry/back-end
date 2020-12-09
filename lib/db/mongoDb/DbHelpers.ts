import complete from "./models/Complete";
import faq from "./models/FAQ";
import position from "./models/Position";
import problem from "./models/Problem";
import process from "./models/Process";
import question from "./models/Question";
import submission from "./models/Submission";
import testComplete from "./models/TestComplete";
import testPosition from "./models/TestPosition";
import testSkills from "./models/TestSkills";
import testSubmission from "./models/TestSubmission";
import video, {Video} from "./models/Video";
import statistics from "./models/Statistics"


export class DbHelpers {
    public async findCompleteSkills(userId: string) {
        return complete.find({
            userId,
        });
    }

    public async findCompleteTests(userId: string) {
        return testComplete.findOne({
            userId,
        });
    }

    public async completeTest(userId: number, topicId: number) {
        const record = testComplete.findOne({userId, topicId});

        if (record) {
            return complete.updateOne({userId, topicId}, {$inc: {views: 1}});
        } else {
            return complete.create({userId, topicId, testsComplete: 1});
        }
    }


    public async createOrUpdateTestSubmission(userId: string, topicId: string, phase: number, submissions: any[]) {
        return testSubmission.update(
            {userId, topicId},
            {$set: {phase, submissions}},
            {upsert: true},
        );
    }

    public async getTestSubmission(userId: string, topicId: string, phase: number) {
        return testSubmission.findOne({
            phase,
            topicId,
            userId,
        });
    }

    public async findAllProcessesBySkills(skills: any[]) {
        return process.find({
            skillRef: {
                $in: skills,
            },
        });
    }

    public async findCoverableSkills(topicId: string) {
        return testSkills.findOne({
            topicId,
        });
    }

    public async addCoverableSkills(topicId: string, skills: any[]) {
        return testSkills.create({
            skills,
            topicId,
        });
    }

    public async findCoveredQuestions(skillIds: number[]) {
        return question.find({
            skillsCovered: {$elemMatch: {skillId: {$in: skillIds}}},
        });
    }

    public async createTestPositionRecord(topicId: string, userId: string) {
        return testPosition.update({
            topicId,
            userId,
        }, {
            $set: {
                correctAnswers: [],
                isFinished: false,
                lastPosition: 0,
                wrongAnswers: [],
            },
        }, {upsert: true});
    }

    public async createStatistics(userId: string, knowledge: number, accuracy: number, logics: number, speed: number) {
        return statistics.create({
            userId, knowledge, accuracy, logics, speed
        });
    }

    public async getStatistics(userId: string) {
        return statistics.findOne({userId});
    }

    public async getTestPositionRecord(userId: string, topicId: string) {
        return testPosition.findOne({
            topicId,
            userId,
        });
    }

    public async updateTestPositionRecord(topicId: string, userId: string, correctAnswers: any[], wrongAnswers: any[],
                                          isFinished: boolean) {
        return testPosition.updateOne({topicId, userId}, {
            correctAnswers,
            isFinished,
            wrongAnswers,
        });
    }

    public async updateProgress(topicId: string, userId: string, lastPosition: number) {
        return testPosition.updateOne({topicId, userId}, {
            lastPosition,
        });
    }

    public async updateProgressStatus(topicId: string, userId: string, isFinished: boolean) {
        return testPosition.updateOne({topicId, userId}, {
            isFinished,
        });
    }

    public async createQuestion(skillsCovered: any[], difficulty: number, score: number, setting: string,
                                fillIn: boolean, options: any[], graphs: string[], answers: string[]) {
        return question.create({
            answers, created: new Date(), difficulty, fillIn, graphs, options, question: setting,
            score, skillsCovered,
        });
    }

    public async getQuestion(id: string) {
        return question.findOne({_id: id});
    }

    public async getQuestionsByIds(ids: any[]) {
        return question.find({_id: ids});
    }

    public async deleteQuestion(id: string) {
        return question.deleteOne({_id: id});
    }

    public async createOrUpdateSubmission(userId: string, procedure: string, content: any[]) {
        return submission.update(
            {userId, procedure},
            {$set: {content}},
            {upsert: true},
        );
    }

    public async getSubmission(userId: string, procedure: string) {
        return submission.findOne({userId, procedure});
    }

    public async createVideoRecord(content: string) {
        return video.create({
            content,
        });
    }

    public async createProblemRecord(questionRec: string, type: string, steps: any[]) {
        return problem.create({
            question: questionRec,
            steps,
            type,
        });
    }

    public async deleteProblemRecord(id: string) {
        return problem.findByIdAndDelete(id);
    }

    public async createProcess(problems: any[], videoURL: Video, skillRef: string) {
        return process.create({
            created: new Date(),
            problems,
            skillRef,
            video: videoURL,
        });
    }

    public async completeSkill(userId: number, topicId: number, skill: number) {
        const record = await complete.find({userId, topicId});
        if (record.length > 0) {
            if (!record[0].skillsComplete.includes(skill)) {
                return complete.updateOne({userId, topicId}, {$push: {skillsComplete: skill}});
            }
        } else {
            const skillsComplete: number[] = [];
            skillsComplete.push(skill);
            return complete.create({userId, topicId, skillsComplete});
        }
    }

    public async getCompleteSkills(userId: number, topicId: number) {
        return complete.findOne({userId, topicId});
    }

    public async createPositionRecord(id: string,
                                      lastPosition: number,
                                      mistakeCount: number,
                                      userId: string,
                                      isFinished: boolean,
                                      correctCount: number) {
        return position.update({
            skillId: id,
            userId,
        }, {
            correctCount,
            isFinished,
            lastPosition,
            mistakeCount,
            skillId: id,
            userId,
        }, {upsert: true});
    }

    public async getPositionRecord(userId: string, skillId: string) {
        return position.findOne({
            skillId,
            userId,
        });
    }

    public async getLatestPositionRecord(userId: string) {
        return position.find({
            userId,
        }).sort({updated_At: 1}).limit(2);
    }

    public async updatePositionRecord(userId: string, skillId: string, isFinished: boolean, mistakeCount: number,
                                      correctCount: number) {
        return position.update({userId, skillId}, {correctCount, isFinished, mistakeCount});
    }

    public async updatePositionRecordPosition(userId: string, skillId: string, lastPosition: number) {
        return position.update({userId, skillId}, {lastPosition, isFinished: false});
    }

    public async getProcessRecordBySkillRef(skillRef: string) {
        return process.findOne({
            skillRef,
        });
    }

    public async getProblemById(id: string) {
        return problem.findById(id);
    }

    public async getVideoById(id: string) {
        return video.findById(id);
    }

    public async getVideosByIds(ids: any[]) {
        return video.find({
            _id: {$in: ids},
        });
    }

    public async loadFAQs() {
        return faq.find({});
    }

    public async addFAQ(title: string, content: string) {
        return faq.create({title, content});
    }

    public async editFAQ(recordId: string, object: any) {
        return faq.updateOne({_id: recordId}, object);
    }

    public async deleteFAQ(recordId) {
        return faq.deleteOne({_id: recordId});
    }
}

