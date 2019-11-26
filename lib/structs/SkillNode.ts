import {Pair} from "./Pair";

export class SkillNode {

    public name: string;

    public children: Pair[] = [];

    public dbRef: string;

    public mistakeCount: number;

    public next: Function;

    constructor(name: string) {
        this.name = name;
        this.dbRef = "";
        this.next = Function;
        this.mistakeCount = 0;
    }

}
