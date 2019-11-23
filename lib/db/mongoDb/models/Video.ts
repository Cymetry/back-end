import {Document, Schema} from "mongoose";
import * as mongoose from "mongoose";

export interface Video extends Document {
    content: string;
}

const VideoSchema: Schema = new Schema({
    content: {type: String, required: true},
});

export default mongoose.model<Video>("Videos", VideoSchema);
