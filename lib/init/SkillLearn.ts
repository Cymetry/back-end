import {Problem} from "../db/mongoDb/models/Problem";
import {Video} from "../db/mongoDb/models/Video";
import {Pair} from "../structs/Pair";
import {SkillNode} from "../structs/SkillNode";

export class SkillLearn {

    public globalIndex: number = 0;

    public graph: SkillNode[] = [];

    public bindGrothendieck = (
        problemRef1: Problem,
        problemRef2: Problem,
        problemRef3: Problem,
        videoRef: Video,
        source: SkillNode,
    ) => {

        // bind poincare to the source
        this.bindPoincare(problemRef3, videoRef, source);

        // video node
        const video = new SkillNode("Video tutorial");
        this.graph[this.globalIndex++] = video;
        video.dbRef = videoRef.toString();

        // bind video node to the source
        source.children.push(new Pair(222, video));

        // determine logic for source node child generation
        function sourceNext() {
            if (this.mistakeCount && this.mistakeCount <= 1) {
                return this.children.filter((elm) => elm.id === 111)[0];
            } else {
                return this.children.filter((elm) => elm.id === 222)[0];
            }
        }

        source.next = sourceNext.bind(source);


        // guided problem 1
        const problem1 = new SkillNode("Guided problem 1");
        this.graph[this.globalIndex++] = problem1;
        problem1.dbRef = problemRef1.toString();

        // bind video child
        video.children.push(new Pair(0, problem1));

        // determine next node for video
        function videoNext() {
            return this.children[0];
        }

        video.next = videoNext.bind(video);

        // bind poincare to guided problem 1 node
        this.bindPoincare(problemRef3, videoRef, problem1);

        const problem1Given2 = new SkillNode("Guided problem 1");
        this.graph[this.globalIndex++] = problem1Given2;
        problem1Given2.dbRef = problemRef1.toString();
        problem1Given2.givenRef = problemRef2.toString();

        // add problem 1 given 2 to problem 1 children
        problem1.children.push(new Pair(1, problem1Given2));

        // next node generation logic
        function problem1Next() {
            if (this.mistakeCount && this.mistakeCount <= 1) {
                return this.children.filter((elm) => elm.id === 111)[0];
            } else {
                return this.children.filter((elm) => elm.id === 1)[0];
            }
        }

        problem1.next = problem1Next.bind(problem1);

        this.bindPythagoras(problemRef3, videoRef, problem1Given2);
        this.bindKolmogorov(problemRef3, problemRef1, videoRef, problem1Given2);

        // next node generation logic for problem1 given 2
        function problem1given2Next() {
            if (this.mistakeCount && this.mistakeCount <= 1) {
                return this.children.filter((elm) => elm.id === 222)[0];
            } else {
                return this.children.filter((elm) => elm.id === 111)[0];
            }
        }

        problem1Given2.next = problem1given2Next.bind(problem1Given2);


    }

    public bindKolmogorov = (problemRef: Problem, givenProblemRef: Problem, videoRef: Video, source: SkillNode) => {
        const head = new SkillNode("Guided problem 3");
        this.graph[this.globalIndex++] = head;
        head.dbRef = problemRef.toString();
        head.givenRef = givenProblemRef.toString();

        function headNext() {
            if (this.mistakeCount && this.mistakeCount <= 4) {
                return this.children.filter((elm) => elm.id === 2)[0];
            } else {
                return this.children.filter((elm) => elm.id === 1)[0];
            }
        }

        head.next = headNext.bind(head);

        const video = new SkillNode("Video tutorial");
        this.graph[this.globalIndex++] = video;
        video.dbRef = videoRef.toString();

        // skill complete
        const complete = new SkillNode("Skill complete");
        complete.children = [];
        complete.next = () => new Pair(1, new SkillNode("empty"));
        complete.dbRef = "";

        const tail = new SkillNode("reentered");
        this.graph[this.globalIndex++] = tail;
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

        head.children.push(new Pair(1, video));
        head.children.push(new Pair(2, complete));
        video.children.push(new Pair(3, tail));
        source.children.push(new Pair(111, head));
    }

    public bindDirichlet = (problemRef: Problem, videoRef: Video, source: SkillNode, end: SkillNode) => {

        // head, meanwhile video node
        const head = new SkillNode("Video tutorial");
        this.graph[this.globalIndex++] = head;
        head.dbRef = videoRef.toString();

        function headNext() {
            return this.children[0];
        }

        head.next = headNext.bind(head);

        // only child guided problem 2 node
        const problem = new SkillNode("Guided problem 2");
        this.graph[this.globalIndex++] = problem;
        problem.dbRef = problemRef.toString();
        problem.children.push(new Pair(111, end));

        function problemNext() {
            return this.children[0];
        }

        problem.next = problemNext.bind(problem);

        head.children.push(new Pair(1, problem));
        source.children.push(new Pair(111, head));
    }

    public bindPoincare = (problemRef: Problem, videoRef: Video, source: SkillNode) => {

        // video node
        const video = new SkillNode("Video tutorial");
        this.graph[this.globalIndex++] = video;
        video.dbRef = videoRef.toString();

        function videoNext() {
            return this.children[0];
        }

        video.next = videoNext.bind(video);

        // skill complete
        const complete = new SkillNode("Skill complete");
        this.graph[this.globalIndex++] = complete;
        complete.children = [];
        complete.next = () => new Pair(1, new SkillNode("empty"));
        complete.dbRef = "";

        // start procedure node
        const head = new SkillNode("Guided problem 3");
        this.graph[this.globalIndex++] = head;
        head.children.push(new Pair(1, video));
        head.children.push(new Pair(2, complete));

        function headNext() {
            if (this.mistakeCount && this.mistakeCount <= 2) {
                return this.children.filter((elm) => elm.id === 2)[0];
            } else {
                return this.children.filter((elm) => elm.id === 1)[0];
            }
        }

        head.next = headNext.bind(head);
        head.dbRef = problemRef.toString();

        const tail = new SkillNode("reentered");
        this.graph[this.globalIndex++] = tail;
        tail.dbRef = problemRef.toString();
        tail.children.push(new Pair(0, head));
        tail.children.push(new Pair(2, complete));

        function tailNext() {
            if (this.mistakeCount && this.mistakeCount <= 1) {
                return this.children.filter((elm) => elm.id === 2)[0];
            } else {
                return this.children.filter((elm) => elm.id === 0)[0];
            }
        }

        tail.next = tailNext.bind(tail);

        video.children.push(new Pair(3, tail));
        source.children.push(new Pair(111, head));


    }

    public bindPythagoras = (problemRef: Problem, videoRef: Video, source: SkillNode) => {
        // video node
        const video = new SkillNode("Video tutorial");
        this.graph[this.globalIndex++] = video;
        video.dbRef = videoRef.toString();

        function videoNext() {
            return this.children[0];
        }

        video.next = videoNext.bind(video);

        // skill complete
        const complete = new SkillNode("Skill complete");
        this.graph[this.globalIndex++] = complete;
        complete.children = [];
        complete.next = () => new Pair(1, new SkillNode("empty"));
        complete.dbRef = "";


        // start procedure node
        const head = new SkillNode("Guided problem 3");
        this.graph[this.globalIndex++] = head;
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
        this.graph[this.globalIndex++] = tail;
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
        source.children.push(new Pair(222, head));
    }

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
        complete.next = () => new Pair(1, new SkillNode("empty"));
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



