import {Question} from "../db/mongoDb/models/Question";
import {TestNode} from "../structs/TestNode";
import {TestPair} from "../structs/TestPair";

export class SkillTest {

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

    public init = (bank: Question[], coverage: number[], minBound: number) => {

        // sort questions by number of skills covered(decreasing)
        bank = bank.sort((a: Question, b: Question) => {
            return b.skillsCovered.length - a.skillsCovered.length;
        });

        // round 1
        const start = new TestNode("round1");
        this.graph[this.globalIndex++] = start;
        start.questions = this.pickQuestions(bank, coverage, minBound);
        start.wrongAnswers = this.round1WrongCount;
        start.correctAnswers = this.round1CorrectCount;

        // round 2
        const round2 = new TestNode("round2");
        const weakSet = this.computeSkillWeaknessWeight(start.wrongAnswers, start.correctAnswers);
        round2.questions = this.pickQuestions(bank, weakSet, minBound);
        round2.solution = false;
        round2.weakSet = weakSet;

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
        round4.questions = this.pickQuestions(bank, lastWeakSet, minBound);
        round4.solution = true;

        // bind round 4
        round3.children.push(new TestPair(0, this.globalIndex, round4));
        this.graph[this.globalIndex++] = round4;


        function round3Next() {
            return this.children[0];
        }

        round3.next = round3Next.bind(round3);

        const complete = new TestNode("SkillTest complete");
        complete.children = [];

        round4.children.push(new TestPair(0, this.globalIndex, complete));
        this.graph[this.globalIndex++] = complete;

        function round4Next() {
            return this.children[0];
        }

        round4.next = round4Next.bind(round4);

    }

    public pickQuestions = (questions: Question[], coverage: number[], minBound: number): Question[] => {

        const result: Question[] = [];
        const coverageSet: Set<number> = new Set<number>([...coverage]);

        if (coverage.length === 0) {
            return result;
        }

        for (const question of questions) {

            if ((coverageSet.size === 0 && result.length >= minBound) || result.length === 6) {
                break;
            }

            // to not enter into foreach if coverage is satisfied but minimum bound not
            if (coverageSet.size > 0) {
                // filling skills covered
                question.skillsCovered.forEach((skill) => {
                    if (coverageSet.has(skill.skillId)) {
                        result.push(question);
                        coverageSet.delete(skill.skillId);
                    }
                });
            }
        }

        return result;
    }

    private computeSkillWeaknessWeight = (wrongAnswers: Question[], correctAnswers: Question[]): number[] => {

        const wrongCount: Map<number, number | undefined> = new Map<number, | undefined>();
        const correctCount: Map<number, number | undefined> = new Map<number, number | undefined>();
        const intersection: Map<number, number | undefined> = new Map<number, number | undefined>();
        const intersectionWrong: Map<number, number | undefined> = new Map<number, number | undefined>();
        const complexityRateWrong: Map<number, number | undefined> = new Map<number, number | undefined>();
        const complexityRateCorrect: Map<number, number | undefined> = new Map<number, number | undefined>();
        const resultMap: Map<number, number | undefined> = new Map<number, number | undefined>();


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
                intersection.set(key, correctCount.get(key));
                intersectionWrong.set(key, wrongCount.get(key));
            }
        });

        // complexity rate wrong ones
        wrongCount.forEach(((value, key) => {
            const sigma = wrongAnswers.filter((question) => {
                return question.skillsCovered.some((skill) => key === skill.skillId);
            }).map((question) => {
                return question.difficulty + question.skillsCovered.filter(
                    (skill) => skill.skillId === key)
                    [0].difficulty;
            }).reduce((a, b) => a + b, 0);

            if (value) {
                complexityRateWrong.set(key, sigma / value);
            }
        }));

        // complexity rate correct ones
        correctCount.forEach(((value, key) => {
            const sigma = correctAnswers.filter((question) => {
                question.skillsCovered.some((skill) => key === skill.skillId);
            }).map((question) => {
                return question.difficulty + question.skillsCovered.filter(
                    (skill) => skill.skillId === key)
                    [0].difficulty;
            }).reduce((a, b) => a + b, 0);

            if (intersectionWrong.has(key) && value) {
                complexityRateCorrect.set(key, sigma / value);
            }
        }));

        let M = 0;
        let m1 = 0;
        let m2 = 0;

        wrongCount.forEach(((value, key) => {
            const m = complexityRateWrong.get(key);
            const u = wrongCount.get(key);
            if (m && u) {
                m1 += m * u;
            }
        }));

        correctCount.forEach(((value, key) => {
            const d = complexityRateCorrect.get(key);
            const w = correctCount.get(key);
            if (d && w) {
                m2 += d * w;
            }
        }));

        M = m1 - m2;


        wrongCount.forEach(((value, key) => {
            const m = complexityRateWrong.get(key);
            const u = wrongCount.get(key);
            if (m && u) {
                const first = m * u;
                let second = 0;
                const d = intersectionWrong.get(key);
                const w = correctCount.get(key);
                if (d && w) {
                    second = d * w;
                }
                resultMap.set(key, (first - second) / M);
            }
        }));

        const sorted = new Map([...resultMap.entries()].sort((a: any[], b: any[]) => {
            return b[1] - a[1];
        }));
        const sortedArray: number[] = [];

        sorted.forEach((value, key) => {
            if (value) {
                sortedArray.push(key);
            }
        });

        const numToFill = wrongAnswers.length;
        let filled = 0;
        const usedQuestion: Set<string> = new Set<string>();
        const resArray: number[] = [];
        for (const skillId of sortedArray) {
            if (filled === numToFill) {
                break;
            }
            resArray.push(skillId);
            wrongAnswers.forEach((question) => {
                if (!usedQuestion.has(question._id) &&
                    question.skillsCovered.some((skill) => skillId === skill.skillId)) {
                    filled++;
                    usedQuestion.add(question._id);
                }
            });
        }

        return resArray;
    }

}
