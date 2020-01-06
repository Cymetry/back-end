import {Document, Schema} from "mongoose";
import * as mongoose from "mongoose";

const submissionSchema = new Schema({
    question: String,
    userAnswer: String,
});

export interface Submission extends Document {
    userId: string;
    topicId: string;
    phase: number;
    submissions: [{
        question: string,
        userAnswer: string,
    }];
}

const SubmissionSchema: Schema = new Schema({
    phase: {type: Number, required: true},
    submissions: {type: Array(submissionSchema), required: true},
    topicId: {type: String, required: true},
    userId: {type: String, required: true},
});

export default mongoose.model<Submission>("TestSubmissions", SubmissionSchema);
