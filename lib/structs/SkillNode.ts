import {Pair} from "./Pair";

export class SkillNode {

    name: string;

    isHere: boolean;

    children: [Pair];

    dbRef: string;

    maxMistakes: number;

    mistakes: number;

    next: Function;

    constructor(name: string, maxMistakes: number) {
        this.name = name;
        this.maxMistakes = maxMistakes;
        this.isHere = false;
        this.children = undefined;
        this.dbRef = undefined;
        this.next = undefined;
        this.mistakes = undefined;
    }

}