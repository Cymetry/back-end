import {Document, Schema} from "mongoose";
import * as mongoose from "mongoose";

export interface FAQ extends Document {
    content: string;
    title: string;
}

const FAQSchema: Schema = new Schema({
    content: {type: String, required: true},
    title: {type: String, required: true},
});

export default mongoose.model<FAQ>("Process", FAQSchema);
