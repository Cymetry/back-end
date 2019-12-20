import {Question} from "../db/mongoDb/models/Question";
import {TestNode} from "../structs/TestNode";

export class Test {

    public globalIndex: number = 0;

    public graph: TestNode[] = [];

    public init = (questions: Question[]) => {
        // todo
    }

}
