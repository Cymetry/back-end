import {Document, Schema} from "mongoose";
import * as mongoose from "mongoose";

export interface Position extends Document {

    skillId: string;
    lastPosition: string;
    currentScore: number;
    userId: string;


}

const PositionSchema: Schema = new Schema({
    currentScore: {type: Number, required: true},
    lastPosition: {type: String, required: true},
    skillId: {type: String, required: true},
    userId: {type: String, required: true},
});

export default mongoose.model<Position>("Positions", PositionSchema);
