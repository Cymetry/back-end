import {Document, Schema} from "mongoose";
import * as mongoose from "mongoose";

const SkillSchema = new Schema({
    difficulty: Number,
    skillId: Number,
});


export interface Question extends Document {

    skillsCovered: [{
        difficulty: number,
        skillId: number,
    }];
    difficulty: number;
    score: number;
    question: string;
    options: [string];
    fillIn: boolean;
    created: Date;
}

const QuestionSchema: Schema = new Schema({
    created: {type: Date, required: true},
    difficulty: {type: Number, required: true},
    fillIn: {type: Boolean, required: true},
    options: {type: Array(String), required: true},
    question: {type: String, required: true},
    score: {type: Number, required: true},
    skillsCovered: {type: Array(SkillSchema), required: true},
});

export default mongoose.model<Question>("Questions", QuestionSchema);
