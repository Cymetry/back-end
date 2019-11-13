import {SkillLearn} from "../../lib/init/SkillLearn";
import {expect} from "chai";

describe('calculate', function () {
    it('add', function () {
        const skillLearn = new SkillLearn();
        let tree = skillLearn.getPythagorasInstance('', '');
        tree.head.maxScore = 10;
        tree.head.maxMistakes = 4;
        tree.head.isHere = true;
        tree

        expect(7).equal(7);
    });
});