import {Problem} from "../db/mongoDb/models/Problem";
import {Video} from "../db/mongoDb/models/Video";
import {Pair} from "../structs/Pair";
import {SkillNode} from "../structs/SkillNode";

export class SkillLearn {

    public getPythagorasInstance = (problemRef: Problem, videoRef: Video): SkillNode[] => {

        // video node
        const video = new SkillNode("Video tutorial");
        video.dbRef = videoRef.toString();

        function videoNext() {
            return this.children[0];
        }

        video.next = videoNext.bind(video);

        // skill complete
        const complete = new SkillNode("Skill complete");
        complete.children = [];
        complete.next = Function;
        complete.dbRef = "";


        // start procedure node
        const head = new SkillNode("Guided problem 3");
        head.children.push(new Pair(1, video));
        head.children.push(new Pair(2, complete));

        function headNext() {
            if (this.mistakeCount && this.mistakeCount <= 4) {
                return this.children.filter((elm) => elm.id === 2)[0];
            } else {
                return this.children.filter((elm) => elm.id === 1)[0];
            }
        }

        head.next = headNext.bind(head);
        head.dbRef = problemRef.toString();


        const tail = new SkillNode("reentered");
        tail.dbRef = problemRef.toString();
        tail.children.push(new Pair(0, head));
        tail.children.push(new Pair(2, complete));

        function tailNext() {
            if (this.mistakeCount && this.mistakeCount <= 4) {
                return this.children.filter((elm) => elm.id === 2)[0];
            } else {
                return this.children.filter((elm) => elm.id === 0)[0];
            }
        }

        tail.next = tailNext.bind(tail);

        video.children.push(new Pair(3, tail));


        const tree: SkillNode[] = [];
        tree[0] = head;
        tree[1] = video;
        tree[2] = complete;
        tree[3] = tail;


        return tree;
    }
}



