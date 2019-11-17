import position from "./models/Position";

export class DbHelpers {


    public async createPositionRecord(id: string, lastPosition: string, score: number) {
        return await position.create({
            currentScore: score,
            lastPosition,
            procedureId: id,
        });
    }
}

