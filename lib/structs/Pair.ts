import {SkillNode} from "./SkillNode";

export class Pair {

    public node: SkillNode;

    public id: number;

    constructor(id: number, node: SkillNode) {
        this.id = id;
        this.node = node;
    }


}
