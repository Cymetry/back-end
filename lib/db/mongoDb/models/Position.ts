import {Schema, Document} from "mongoose";
import * as mongoose from "mongoose";

export interface Position extends Document {

    procedureId: string;
    lastPosition: string;
    currentScore: number;


}

const PositionSchema: Schema = new Schema({
    procedureId: {type: String, required: true},
    lastPosition: {type: String, required: true},
    currentScore: {type: Number, required: true},

});

export default mongoose.model<Position>('Positions', PositionSchema);
