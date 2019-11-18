import {Document, Schema} from "mongoose";
import * as mongoose from "mongoose";

export interface Video extends Document {
    url: string;
}

const VideoSchema: Schema = new Schema({
    url: {type: String, required: true},
});

export default mongoose.model<Video>("Videos", VideoSchema);
