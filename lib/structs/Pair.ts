import {SkillNode} from "./SkillNode";

export class Pair {

    public node: SkillNode;

    public id: number;

    public index: number;

    constructor(id: number, index: number, node: SkillNode) {
        this.id = id;
        this.index = index;
        this.node = node;
    }


}
