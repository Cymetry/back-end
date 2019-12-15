import {Document, Schema} from "mongoose";
import * as mongoose from "mongoose";

export interface Complete extends Document {

    userId: number;
    topicId: number;
    skillsComplete: [number];
}

const CompleteSchema: Schema = new Schema({
    skillsComplete: {type: Array(Number), required: true},
    topicId: {type: Number, required: true},
    userId: {type: Number, required: true},
});

export default mongoose.model<Complete>("Complete", CompleteSchema);
