import {Document, Schema} from "mongoose";
import * as mongoose from "mongoose";
import {Problem} from "./Problem";
import {Video} from "./Video";

export interface Process extends Document {

    problems: [
        {
            name: string,
            problemRef: Problem,
        }
        ];
    video: Video;
    created: Date;
    skillRef: string;

}

const ProcessSchema: Schema = new Schema({
    created: {type: Date, required: true},
    problems: {type: Array(Schema.Types.ObjectId), required: true},
    skillRef: {type: String, required: true},
    video: {type: Schema.Types.ObjectId, required: true},
});

export default mongoose.model<Process>("Process", ProcessSchema);
