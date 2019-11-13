import {Pair} from "./Pair";

export class SkillNode {

    name: string;

    isHere: boolean;

    children: Array<Pair> = [];

    dbRef: string;

    maxMistakes: number;

    currentScore: number;

    maxScore: number;

    next: Function;

    constructor(name: string, maxMistakes: number) {
        this.name = name;
        this.maxMistakes = maxMistakes;
        this.isHere = false;
        this.dbRef = undefined;
        this.next = undefined;
        this.currentScore = undefined;
        this.maxScore = undefined;
    }

}