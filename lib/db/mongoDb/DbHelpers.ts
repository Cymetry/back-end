import position from "./models/Position";

export class DbHelpers {


    async createPositionRecord(id: string, lastPosition: string, score: number) {
        return await position.create({
            procedureId: id,
            lastPosition: lastPosition,
            currentScore: score

        });
    }
}

