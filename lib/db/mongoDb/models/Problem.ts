import {Document, Schema} from "mongoose";
import * as mongoose from "mongoose";

export interface Problem extends Document {
    content: string;
}

const ProblemSchema: Schema = new Schema({
    content: {type: String, required: true},
});

export default mongoose.model<Problem>("Problems", ProblemSchema);
