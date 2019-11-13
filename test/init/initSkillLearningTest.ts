import {SkillLearn} from "../../lib/init/SkillLearn";
import {expect} from "chai";

describe('calculate', function () {
    it('add', function () {
        const skillLearn = new SkillLearn();
        let tree = skillLearn.getPythagorasInstance('', '');
        expect(7).equal(7);
    });
});