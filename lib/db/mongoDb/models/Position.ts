import {Document, Schema} from "mongoose";
import * as mongoose from "mongoose";

export interface Position extends Document {

    skillId: string;
    lastPosition: number;
    currentScore: number;
    userId: string;
    isFinished: boolean;


}

const PositionSchema: Schema = new Schema({
    currentScore: {type: Number, required: true},
    isFinished: {type: Boolean, required: true},
    lastPosition: {type: Number, required: true},
    skillId: {type: String, required: true},
    userId: {type: String, required: true},
});

export default mongoose.model<Position>("Positions", PositionSchema);
