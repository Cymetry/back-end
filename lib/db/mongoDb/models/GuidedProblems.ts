import {Document, Schema} from "mongoose";
import * as mongoose from "mongoose";

export interface GuidedProblems extends Document {

    problems: [
        {
            name: string,
            problemRef: Schema.Types.ObjectId,
        }
        ];
    created: Date;
    skillRef: string;

}

const GuidedProblemsSchema: Schema = new Schema({
    created: {type: Date, required: true},
    problems: {type: Array, required: true},
    skillRef: {type: String, required: true},
});

export default mongoose.model<GuidedProblems>("GuidedProblems", GuidedProblemsSchema);
