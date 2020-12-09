import {Document, Schema} from "mongoose";
import * as mongoose from "mongoose";

export interface Statistics extends Document {

    userId: string;
    knowledge: number,
    accuracy: number,
    logics: number,
    speed: number
}

const StatisticsSchema: Schema = new Schema({
    userId: {type: String, required: true},
    knowledge: {type: Number, required: true},
    accuracy: {type: Number, required: true},
    logics: {type: Number, required: true},
    speed: {type: Number, required: true},
});

export default mongoose.model<Statistics>("Statistics", StatisticsSchema);