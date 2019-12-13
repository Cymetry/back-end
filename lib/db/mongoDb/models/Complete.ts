import {Document, Schema} from "mongoose";
import * as mongoose from "mongoose";

export interface Complete extends Document {

    userId: string;
    topicId: string;
    skillComplete: number;
}

const CompleteSchema: Schema = new Schema({
    skillComplete: {type: Number, required: true},
    topicId: {type: String, required: true},
    userId: {type: String, required: true},
});

export default mongoose.model<Complete>("Complete", CompleteSchema);
