import {Problem} from "../db/mongoDb/models/Problem";
import {Video} from "../db/mongoDb/models/Video";
import {Pair} from "../structs/Pair";
import {SkillNode} from "../structs/SkillNode";

export class SkillLearn {

    public globalIndex: number = 0;

    public graph: SkillNode[] = [];

    public init = (problemRef1: Problem,
                   problemRef2: Problem,
                   problemRef3: Problem,
                   videoRef: Video) => {

        // source node
        const source = new SkillNode("Guided Problem 1");
        this.graph[this.globalIndex++] = source;
        source.dbRef = problemRef1.toString();

        // guided problem 2 tree-level 1
        const gp2L1 = new SkillNode("Guided Problem 2");
        gp2L1.dbRef = problemRef2.toString();
        gp2L1.maxMistakeCount = 0;

        // guided video tree-level 1
        const videoL1 = new SkillNode("Video tutorial");
        videoL1.dbRef = videoRef.toString();

        // guided problem 3 tree-level 1
        const gp3L1 = new SkillNode("Guided Problem 3");
        gp3L1.dbRef = problemRef3.toString();
        gp3L1.maxMistakeCount = 2;

        // complete tree-level 1
        const complete = new SkillNode("Skill complete");
        complete.children = [];
        complete.dbRef = "";

        // push 4 child nodes for the source
        source.children.push(new Pair(1, this.globalIndex, gp2L1));
        this.graph[this.globalIndex++] = gp2L1;

        source.children.push(new Pair(2, this.globalIndex, videoL1));
        this.graph[this.globalIndex++] = videoL1;

        source.children.push(new Pair(3, this.globalIndex, gp3L1));
        this.graph[this.globalIndex++] = gp3L1;

        source.children.push(new Pair(4, this.globalIndex, complete));
        this.graph[this.globalIndex++] = complete;

        // define deepening logic
        function sourceNext() {
            if (this.correctCount >= 0.5) {
                return this.children.filter((elm) => elm.id === 1)[0];
            } else if (this.correctCount < 0.5 && this.mistakeCount === 2) {
                return this.children.filter((elm) => elm.id === 2)[0];
            } else if (this.mistakeCount === 1) {
                return this.children.filter((elm) => elm.id === 3)[0];
            } else if (this.mistakeCount === 0) {
                return this.children.filter((elm) => elm.id === 4)[0];
            }
        }

        source.next = sourceNext.bind(source);

        // guided problem 1 on level 3 under Dirichlet procedure
        const gp1L3 = new SkillNode("Guided problem 1");
        gp1L3.dbRef = problemRef1.toString();
        gp1L3.maxMistakeCount = 1;

        // bind guided problem 1 on level 3 to level 2 guided problem 2
        gp2L1.children.push(new Pair(5, this.globalIndex, gp1L3));
        this.graph[this.globalIndex++] = gp1L3;

        this.bindDirichlet(problemRef2, videoRef, gp2L1, gp1L3);

        function gp2L1Next() {
            if (this.mistakeCount === 0) {
                return this.children.filter((elm) => elm.id === 5)[0];
            } else {
                return this.children.filter((elm) => elm.id === 333)[0];
            }
        }

        gp2L1.next = gp2L1Next.bind(gp2L1);
        this.bindGrothendieck(problemRef1, problemRef2, problemRef3, videoRef, gp1L3);

        const gp1L2 = new SkillNode("Guided problem 1");
        gp1L2.dbRef = problemRef1.toString();
        gp1L2.maxMistakeCount = 0;

        videoL1.children.push(new Pair(6, this.globalIndex, gp1L2));
        this.graph[this.globalIndex++] = gp1L2;

        function videoL1Next() {
            return this.children[0];
        }

        videoL1.next = videoL1Next.bind(videoL1);

        const gp3L3 = new SkillNode("Guided problem 3");
        gp3L3.dbRef = problemRef3.toString();
        gp3L3.maxMistakeCount = 2;

        const gp2L3 = new SkillNode("Guided problem 2");
        gp2L3.dbRef = problemRef2.toString();
        gp2L3.maxMistakeCount = 0;

        gp1L2.children.push(new Pair(7, this.globalIndex, gp3L3));
        this.graph[this.globalIndex++] = gp3L3;

        gp1L2.children.push(new Pair(8, this.globalIndex, gp2L3));
        this.graph[this.globalIndex++] = gp2L3;

        function gp1L2Next() {
            if (this.mistakeCount === 0) {
                return this.children.filter((elm) => elm.id === 7)[0];
            } else {
                return this.children.filter((elm) => elm.id === 8)[0];
            }
        }

        gp1L2.next = gp1L2Next.bind(gp1L2);


        this.bindKolmogorov(problemRef3, problemRef1, videoRef, gp3L3);

        gp3L3.children.push(new Pair(9, this.globalIndex, complete));
        this.graph[this.globalIndex++] = complete;

        function gp3L3Next() {
            if (this.mistakeCount === 3) {
                return this.children.filter((elm) => elm.id === 111)[0];
            } else if (this.mistakeCount <= 2) {
                return this.children.filter((elm) => elm.id === 9)[0];
            }
        }

        gp3L3.next = gp3L3Next.bind(gp3L3);


        const gp1L4 = new SkillNode("Guided problem 1");
        gp1L4.dbRef = problemRef1.toString();
        gp1L4.maxMistakeCount = Number.MAX_VALUE;

        this.bindDirichlet(problemRef2, videoRef, gp2L3, gp1L4);

        gp2L3.children.push(new Pair(10, this.globalIndex, gp1L4));
        this.graph[this.globalIndex++] = gp1L4;

        function gp2L3Next() {
            if (this.mistakeCount === 0) {
                return this.children.filter((elm) => elm.id === 10)[0];
            } else {
                return this.children.filter((elm) => elm.id === 333)[0];
            }
        }

        gp2L3.next = gp2L3Next.bind(gp2L3);

        this.bindPythagoras(problemRef3, videoRef, gp1L4);

        function gp1L4Next() {
            return this.children[0];
        }

        gp1L4.next = gp1L4Next.bind(gp1L4);

        gp3L1.children.push(new Pair(11, this.globalIndex, complete));
        this.graph[this.globalIndex++] = complete;

        this.bindKolmogorov(problemRef3, problemRef1, videoRef, gp3L1);

        function gp3L1Next() {
            if (this.mistakeCount <= 2) {
                return this.children.filter((elm) => elm.id === 11)[0];
            } else if (this.mistakeCount === 3) {
                return this.children.filter((elm) => elm.id === 111)[0];
            }
        }

        gp3L1.next = gp3L1Next.bind(gp3L1);
    }

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
        video.dbRef = videoRef.toString();

        // bind video node to the source
        source.children.push(new Pair(222, this.globalIndex, video));
        this.graph[this.globalIndex++] = video;

        // determine logic for source node child generation
        function sourceNext() {
            if (this.mistakeCount <= 1) {
                return this.children.filter((elm) => elm.id === 111)[0];
            } else {
                return this.children.filter((elm) => elm.id === 222)[0];
            }
        }

        source.next = sourceNext.bind(source);


        // guided problem 1
        const problem1 = new SkillNode("Guided problem 1");
        problem1.dbRef = problemRef1.toString();
        problem1.maxMistakeCount = 1;

        // bind video child
        video.children.push(new Pair(0, this.globalIndex, problem1));
        this.graph[this.globalIndex++] = problem1;

        // determine next node for video
        function videoNext() {
            return this.children[0];
        }

        video.next = videoNext.bind(video);

        // bind poincare to guided problem 1 node
        this.bindPoincare(problemRef3, videoRef, problem1);

        const problem1Given2 = new SkillNode("Guided problem 1");
        problem1Given2.dbRef = problemRef1.toString();
        problem1Given2.givenRef = problemRef2.toString();
        problem1Given2.maxMistakeCount = 2;

        // add problem 1 given 2 to problem 1 children
        problem1.children.push(new Pair(1, this.globalIndex, problem1Given2));
        this.graph[this.globalIndex++] = problem1Given2;


        // next node generation logic
        function problem1Next() {
            if (this.mistakeCount <= 1) {
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
        head.dbRef = problemRef.toString();
        head.givenRef = givenProblemRef.toString();
        head.maxMistakeCount = 4;

        function headNext() {
            if (this.mistakeCount && this.mistakeCount <= 4) {
                return this.children.filter((elm) => elm.id === 2)[0];
            } else {
                return this.children.filter((elm) => elm.id === 1)[0];
            }
        }

        head.next = headNext.bind(head);

        const video = new SkillNode("Video tutorial");
        video.dbRef = videoRef.toString();

        function videoNext() {
            return this.children[0];
        }

        video.next = videoNext.bind(video);

        // skill complete
        const complete = new SkillNode("Skill complete");
        complete.children = [];
        complete.next = () => new Pair(1, 0, new SkillNode("empty"));
        complete.dbRef = "";

        const tail = new SkillNode("reentered");
        tail.dbRef = problemRef.toString();
        tail.maxMistakeCount = 4;


        tail.children.push(new Pair(0, this.globalIndex, head));
        this.graph[this.globalIndex++] = head;


        tail.children.push(new Pair(2, this.globalIndex, complete));
        this.graph[this.globalIndex++] = complete;

        function tailNext() {
            if (this.mistakeCount && this.mistakeCount <= 4) {
                return this.children.filter((elm) => elm.id === 2)[0];
            } else {
                return this.children.filter((elm) => elm.id === 0)[0];
            }
        }

        tail.next = tailNext.bind(tail);

        head.children.push(new Pair(1, this.globalIndex, video));
        this.graph[this.globalIndex++] = video;


        head.children.push(new Pair(2, this.globalIndex, complete));
        this.graph[this.globalIndex++] = complete;


        video.children.push(new Pair(3, this.globalIndex, tail));
        this.graph[this.globalIndex++] = tail;

        source.children.push(new Pair(111, this.globalIndex, head));
        this.graph[this.globalIndex++] = head;
    }

    public bindDirichlet = (problemRef: Problem, videoRef: Video, source: SkillNode, end: SkillNode) => {

        // head, meanwhile video node
        const head = new SkillNode("Video tutorial");
        head.dbRef = videoRef.toString();

        function headNext() {
            return this.children[0];
        }

        head.next = headNext.bind(head);

        // only child guided problem 2 node
        const problem = new SkillNode("Guided problem 2");
        problem.dbRef = problemRef.toString();
        problem.maxMistakeCount = Number.MAX_SAFE_INTEGER;

        problem.children.push(new Pair(111, this.globalIndex, end));
        this.graph[this.globalIndex++] = end;

        function problemNext() {
            return this.children[0];
        }

        problem.next = problemNext.bind(problem);

        head.children.push(new Pair(1, this.globalIndex, problem));
        this.graph[this.globalIndex++] = problem;


        source.children.push(new Pair(333, this.globalIndex, head));
        this.graph[this.globalIndex++] = head;

    }

    public bindPoincare = (problemRef: Problem, videoRef: Video, source: SkillNode) => {

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
        complete.next = () => new Pair(1, 0, new SkillNode("empty"));
        complete.dbRef = "";

        // start procedure node
        const head = new SkillNode("Guided problem 3");

        head.children.push(new Pair(1, this.globalIndex, video));
        this.graph[this.globalIndex++] = video;


        head.children.push(new Pair(2, this.globalIndex, complete));
        this.graph[this.globalIndex++] = complete;


        function headNext() {
            if (this.mistakeCount && this.mistakeCount <= 2) {
                return this.children.filter((elm) => elm.id === 2)[0];
            } else {
                return this.children.filter((elm) => elm.id === 1)[0];
            }
        }

        head.next = headNext.bind(head);
        head.dbRef = problemRef.toString();
        head.maxMistakeCount = 2;

        const tail = new SkillNode("reentered");
        tail.dbRef = problemRef.toString();
        tail.maxMistakeCount = 1;

        tail.children.push(new Pair(0, this.globalIndex, head));
        this.graph[this.globalIndex++] = head;


        tail.children.push(new Pair(2, this.globalIndex, complete));
        this.graph[this.globalIndex++] = complete;


        function tailNext() {
            if (this.mistakeCount && this.mistakeCount <= 1) {
                return this.children.filter((elm) => elm.id === 2)[0];
            } else {
                return this.children.filter((elm) => elm.id === 0)[0];
            }
        }

        tail.next = tailNext.bind(tail);

        video.children.push(new Pair(3, this.globalIndex, tail));
        this.graph[this.globalIndex++] = tail;

        source.children.push(new Pair(111, this.globalIndex, head));
        this.graph[this.globalIndex++] = head;


    }

    public bindPythagoras = (problemRef: Problem, videoRef: Video, source: SkillNode) => {
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
        complete.next = () => new Pair(1, 0, new SkillNode("empty"));
        complete.dbRef = "";


        // start procedure node
        const head = new SkillNode("Guided problem 3");


        head.children.push(new Pair(1, this.globalIndex, video));
        this.graph[this.globalIndex++] = video;

        head.children.push(new Pair(2, this.globalIndex, complete));
        this.graph[this.globalIndex++] = complete;


        function headNext() {
            if (this.mistakeCount && this.mistakeCount <= 4) {
                return this.children.filter((elm) => elm.id === 2)[0];
            } else {
                return this.children.filter((elm) => elm.id === 1)[0];
            }
        }

        head.next = headNext.bind(head);
        head.dbRef = problemRef.toString();
        head.maxMistakeCount = 4;


        const tail = new SkillNode("reentered");
        tail.dbRef = problemRef.toString();
        tail.maxMistakeCount = 4;

        tail.children.push(new Pair(0, this.globalIndex, head));
        this.graph[this.globalIndex++] = head;

        tail.children.push(new Pair(2, this.globalIndex, complete));
        this.graph[this.globalIndex++] = complete;

        function tailNext() {
            if (this.mistakeCount && this.mistakeCount <= 4) {
                return this.children.filter((elm) => elm.id === 2)[0];
            } else {
                return this.children.filter((elm) => elm.id === 0)[0];
            }
        }

        tail.next = tailNext.bind(tail);

        video.children.push(new Pair(3, this.globalIndex, tail));
        this.graph[this.globalIndex++] = tail;

        source.children.push(new Pair(222, this.globalIndex, head));
        this.graph[this.globalIndex++] = head;
    }
}



