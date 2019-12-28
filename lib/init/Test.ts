import {Question} from "../db/mongoDb/models/Question";
import {TestNode} from "../structs/TestNode";
import {TestPair} from "../structs/TestPair";

export interface IHash {
    [details: string]: number;
}

export class Test {

    public globalIndex: number = 0;

    public graph: TestNode[] = [];

    public round1WrongCount: Question[];
    public round1CorrectCount: Question[];
    public round3WrongCount: Question[];
    public round3CorrectCount: Question[];

    constructor(round1WrongCount, round1CorrectCount, round3WrongCount, round3CorrectCount) {
        this.round1WrongCount = round1WrongCount;
        this.round1CorrectCount = round1CorrectCount;
        this.round3WrongCount = round3WrongCount;
        this.round3CorrectCount = round3CorrectCount;
    }

    public init = (bank: Question[], coverable: string[], minBound: number, upBound: number) => {

        // round 1
        const start = new TestNode("round1");
        this.graph[this.globalIndex++] = start;
        start.questions = this.pickQuestions(bank, coverable, minBound, upBound);
        start.wrongAnswers = this.round1WrongCount;
        start.correctAnswers = this.round1CorrectCount;

        // round 2
        const round2 = new TestNode("round2");
        const weakSet = this.computeSkillWeaknessWeight(start.wrongAnswers, start.correctAnswers);
        round2.questions = this.pickQuestions(bank, weakSet, minBound, upBound);
        round2.solution = true;

        // bind round 2 to start(round 1)
        start.children.push(new TestPair(0, this.globalIndex, round2));
        this.graph[this.globalIndex++] = round2;


        function startNext() {
            return this.children[0];
        }

        start.next = startNext.bind(start);

        // round 3
        const round3 = new TestNode("round3");
        round3.questions = start.wrongAnswers;
        round3.solution = true;
        round3.wrongAnswers = this.round3WrongCount;
        round3.correctAnswers = this.round3CorrectCount;

        // bind round 3
        round2.children.push(new TestPair(0, this.globalIndex, round3));
        this.graph[this.globalIndex++] = round3;

        function round2Next() {
            return this.children[0];
        }

        round2.next = round2Next.bind(round2);

        // round 4
        const round4 = new TestNode("round4");
        const lastWeakSet = this.computeSkillWeaknessWeight(round3.wrongAnswers, round3.correctAnswers);
        round4.questions = this.pickQuestions(bank, lastWeakSet, minBound, upBound);
        round4.solution = true;

        // bind round 4
        round3.children.push(new TestPair(0, this.globalIndex, round4));
        this.graph[this.globalIndex++] = round4;


        function round3Next() {
            return this.children[0];
        }

        round3.next = round3Next.bind(round3);

        const complete = new TestNode("Test complete");
        complete.children = [];

        round4.children.push(new TestPair(0, this.globalIndex, complete));
        this.graph[this.globalIndex++] = complete;

    }

    public pickQuestions = (questions: Question[], coverable: string[], minBound: number, upBound: number)
        : Question[] => {
        // todo
    }

    private computeSkillWeaknessWeight = (wrongAnswers: Question[], correctAnswers: Question[]): string[] => {

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
