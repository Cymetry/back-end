import {Pair} from "./Pair";

export class SkillNode {

    public name: string;

    public isHere: boolean;

    public children: Pair[] = [];

    public dbRef: string;

    public maxMistakes: number;

    public currentScore: number;

    public maxScore: number;

    public next: Function;

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
