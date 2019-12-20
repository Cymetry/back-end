import {TestPair} from "./TestPair";

export class TestNode {

    public name: string;

    public children: TestPair[] = [];

    public questions: string[] = [];

    public next: () => TestPair;

    constructor(name: string) {
        this.name = name;
        this.next = () => new TestPair(1, 0, new TestNode("empty"));
    }

}
