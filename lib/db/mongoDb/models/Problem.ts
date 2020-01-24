import {Document, Schema} from "mongoose";
import * as mongoose from "mongoose";

const StepSchema = new Schema({
    answer: [[String]],
    fillIn: Boolean,
    graphs: [String],
    index: String,
    instruction: String,

    options: [
        {
            content: String,
            index: String,
        },
    ],
    solution: String,
});

export interface Problem extends Document {
    question: string;
    type: string;
    steps: [
        {
            instruction: string,
            graphs: [string],
            fillIn: boolean,
            options: [
                {
                    index: string,
                    content: string,
                }
                ],
            answer: [[string]],
            solution: string,
            index: string,
        }
        ];
}

const ProblemSchema: Schema = new Schema({
    question: {type: String, required: true},
    steps: {type: Array(Array(StepSchema)), required: true},
    type: {type: String, required: true},
});

export default mongoose.model<Problem>("Problems", ProblemSchema);
