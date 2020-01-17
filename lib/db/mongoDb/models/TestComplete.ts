import {Document, Schema} from "mongoose";
import * as mongoose from "mongoose";

export interface TestComplete extends Document {

    userId: number;
    topicId: number;
    testsComplete: number;
}

const CompleteSchema: Schema = new Schema({
    testsComplete: {type: Number, required: true},
    topicId: {type: Number, required: true},
    userId: {type: Number, required: true},
});

export default mongoose.model<TestComplete>("TestComplete", CompleteSchema);
