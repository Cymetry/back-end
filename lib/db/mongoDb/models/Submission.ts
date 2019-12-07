import {Document, Schema} from "mongoose";
import * as mongoose from "mongoose";
import {Process} from "./Process";

const ContentSchema = new Schema({
    data: [{
        answer: String,
        fillIn: Boolean,
        step: String,
        submissions: [],
    }],
    problem: String,
});

export interface Submission extends Document {
    userId: string;
    procedure: Process;
    content: [
        {
            problem: string
            data: [
                {
                    answer: string,
                    fillIn: boolean,
                    step: string,
                    submissions: [],
                }
                ],
        }
        ];

}

const SubmissionSchema: Schema = new Schema({
    content: {type: Array(ContentSchema), required: true},
    procedure: {type: Schema.Types.ObjectId, required: true},
    userId: {type: String, required: true},
});

export default mongoose.model<Submission>("Submissions", SubmissionSchema);
