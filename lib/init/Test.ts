import {Question} from "../db/mongoDb/models/Question";
import {TestNode} from "../structs/TestNode";

export interface IHash {
    [details: string]: number;
}

export class Test {

    public globalIndex: number = 0;

    public graph: TestNode[] = [];

    public pickQuestions = (questions: Question[], coverable: string[], minBound: number, upBound: number) => {
        // todo

    }

    private computeSkillWeaknessWeight = (wrongAnswers: Question[], correctAnswers: Question[]) => {

        const wrongCount: Map<number, number> = new Map<number, number>();
        const correctCount: Map<number, number> = new Map<number, number>();
        const intersection: Set<number> = new Set<number>();


        // compute frequency for each wrong answered skill
        wrongAnswers.forEach((answer) => {
            answer.skillsCovered.forEach((skill) => {
                if (wrongCount.has(skill.skillId)) {
                    let current = wrongCount.get(skill.skillId);
                    if (current) {
                        current++;
                        wrongCount.set(skill.skillId, current);
                    }
                } else {
                    wrongCount.set(skill.skillId, 1);
                }
            });
        });

        // compute frequency for each correctly answered skill
        correctAnswers.forEach((answer) => {
            answer.skillsCovered.forEach((skill) => {
                if (correctCount.has(skill.skillId)) {
                    let current = correctCount.get(skill.skillId);
                    if (current) {
                        current++;
                        correctCount.set(skill.skillId, current);
                    }
                } else {
                    correctCount.set(skill.skillId, 1);
                }
            });
        });

        // compute intersection
        wrongCount.forEach((value, key) => {
            if (correctCount.has(key)) {
                intersection.add(key);
            }
        });

        // todo
        // complexity rate
    }

}
