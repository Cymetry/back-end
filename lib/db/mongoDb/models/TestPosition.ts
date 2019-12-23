import {Document, Schema} from "mongoose";
import * as mongoose from "mongoose";
import {Question} from "./Question";

export interface TestPosition extends Document {

    topicId: string;
    userId: string;
    isFinished: boolean;
    lastPosition: number;
    correctAnswers: [Question];
    wrongAnswers: [Question];


}

const TestPositionSchema: Schema = new Schema({
    correctAnswers: {type: Array(Question), required: true},
    isFinished: {type: Boolean, required: true},
    lastPosition: {type: Number, required: true},
    topicId: {type: String, required: true},
    userId: {type: String, required: true},
    wrongAnswers: {type: Array(Question), required: true},
});

export default mongoose.model<TestPosition>("TestPositions", TestPositionSchema);
