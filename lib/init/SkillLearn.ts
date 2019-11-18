import {Pair} from "../structs/Pair";
import {SkillNode} from "../structs/SkillNode";

export class SkillLearn {

    public getPythagorasInstance = (problemRef: string, videoRef: string): Object => {

        // video node
        const video = new SkillNode("Video tutorial");
        video.dbRef = videoRef;

        function videoNext() {
            return this.children.pop().node;
        }

        video.next = videoNext.bind(video);

        // skill complete
        const complete = new SkillNode("Skill complete");
        complete.children = [];
        complete.next = Function;
        complete.dbRef = "";


        // start procedure node
        const head = new SkillNode("Guided problem 3", 4);
        head.children.push(new Pair(0, video));
        head.children.push(new Pair(1, complete));

        function headNext() {
            if (this.mistakes && this.mistakes <= this.maxMistakes) {
                return this.children.filter((elm) => elm.id === 1);
            } else {
                return this.children.filter((elm) => elm.id === 0);
            }
        }

        head.next = headNext.bind(head);


        video.children.push(new Pair(0, head));


        return {head, video, complete};
    }
}



