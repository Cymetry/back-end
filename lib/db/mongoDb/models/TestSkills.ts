import {Document, Schema} from "mongoose";
import * as mongoose from "mongoose";

export interface TestSkills extends Document {
    topicId: string;
    skills: [number];
}

const TestSkillsSchema: Schema = new Schema({
    skills: {type: Array(Number), required: true},
    topicId: {type: String, required: true},
});

export default mongoose.model<TestSkills>("TestSkills", TestSkillsSchema);
