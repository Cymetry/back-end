import position from "./models/Position";

export class DbHelpers {


    async createPositionRecord(id: string, lastPositon: string, score: number) {
        return await position.create({
            procedureId: id,
            lastPosition: lastPositon,
            currentScore: score

        });
    }
}

