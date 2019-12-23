import {Document, Schema} from "mongoose";
import * as mongoose from "mongoose";

export interface TestPosition extends Document {

    topicId: string;
    userId: string;
    isFinished: boolean;
    lastPosition: number;
    correctAnswers: [string];
    wrongAnswers: [string];


}

const TestPositionSchema: Schema = new Schema({
    correctAnswers: {type: Array(String), required: true},
    isFinished: {type: Boolean, required: true},
    lastPosition: {type: Number, required: true},
    topicId: {type: String, required: true},
    userId: {type: String, required: true},
    wrongAnswers: {type: Array(String), required: true},
});

export default mongoose.model<TestPosition>("TestPositions", TestPositionSchema);
