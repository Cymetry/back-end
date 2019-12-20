import {TestNode} from "./TestNode";

export class TestPair {

    public node: TestNode;

    public id: number;

    public index: number;

    constructor(id: number, index: number, node: TestNode) {
        this.id = id;
        this.index = index;
        this.node = node;
    }


}
