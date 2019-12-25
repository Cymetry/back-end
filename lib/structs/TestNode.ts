import {TestPair} from "./TestPair";
import {Question} from "../db/mongoDb/models/Question";

export class TestNode {

    public name: string;

    public children: TestPair[] = [];

    public questions: Question[] = [];

    public next: () => TestPair;

    public correctAnswers: Question[] = [];

    public wrongAnswers: Question[] = [];

    public solution: boolean;

    constructor(name: string) {
        this.name = name;
        this.solution = false;
        this.next = () => new TestPair(1, 0, new TestNode("empty"));
    }

}
