import {expect} from "chai";
import {SkillLearn} from "../../lib/init/SkillLearn";

describe("calculate", () => {
    it("add", () => {
        const skillLearn = new SkillLearn();
        const tree = skillLearn.getPythagorasInstance("", "");
        // tree.head.maxScore = 10;
        // tree.head.maxMistakes = 4;
        // tree.head.isHere = true;
        // tree;

        expect(7).equal(7);
    });
});
