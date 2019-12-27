import {Document, Schema} from "mongoose";
import * as mongoose from "mongoose";

export interface TestSkills extends Document {

    topicId: string;
    skills: [string];


}

const TestSkillsSchema: Schema = new Schema({
    skills: {type: Array(String), required: true},
    topicId: {type: String, required: true},
});

export default mongoose.model<TestSkills>("TestSkills", TestSkillsSchema);
