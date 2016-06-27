import {expect} from "chai";

import {GumpPath} from "../src/util.js";

describe("GumpPath", function () {

    beforeEach(function () {
        this.path = GumpPath.fromString("this.is.a.test");
    });

    describe("#toGumpPath", function () {
        it("should leave GumpPath objects unchanged", function () {
            const r0 = GumpPath.toGumpPath(this.path);
            expect(r0.keyAt(0)).to.equal("this");
            expect(r0.length).to.equal(4);
        });

        it("should convert iterable objects", function () {
            const r0 = GumpPath.toGumpPath(["this", "is", "a", "test"]);
            expect(r0.keyAt(0)).to.equal("this");
            expect(r0.length).to.equal(4);
        });

        it("should convert other values", function () {
            const r0 = GumpPath.toGumpPath(42);
            expect(r0.keyAt(0)).to.equal(42);
            expect(r0.length).to.equal(1);
        });
    });

    describe("#fromString", function () {
        it("create a GumpPath from a given string", function () {
            const p0 = this.path;
            expect(p0.keyAt(0)).to.equal("this");
            expect(p0.keyAt(3)).to.equal("test");
            expect(p0.length).to.equal(4);

            const p1 = GumpPath.fromString("another;test", ";");
            expect(p1.keyAt(0)).to.equal("another");
            expect(p1.keyAt(1)).to.equal("test");
        });
    });

    describe("#head", function () {
        it("should return the first key in the path", function () {
            const k = this.path.head();
            expect(k).to.equal("this");
        });
    });

    describe("#tail", function () {
        it("should return a path with every key but the first", function () {
            const p = this.path.tail();
            expect(p.keyAt(0)).to.equal("is");
            expect(p.keyAt(1)).to.equal("a");
            expect(p.keyAt(2)).to.equal("test");
            expect(p.length).to.equal(3);
        });
    });

    describe("#last", function () {
        it("should return the last key in the path", function () {
            const k = this.path.last();
            expect(k).to.equal("test");
        });
    });

    describe("#init", function () {
        it("should return a path with every key but the last", function () {
            const p = this.path.init();
            expect(p.keyAt(0)).to.equal("this");
            expect(p.keyAt(1)).to.equal("is");
            expect(p.keyAt(2)).to.equal("a");
            expect(p.length).to.equal(3);
        });
    });

    describe("#append", function () {
        it("should return a path with every key but the last", function () {
            const p = this.path.append("!");
            expect(p.keyAt(4)).to.equal("!");
            expect(p.length).to.equal(5);
        });
    });

    describe("#prepend", function () {
        it("should return a path with every key but the last", function () {
            const p = this.path.prepend("hey, ");
            expect(p.keyAt(0)).to.equal("hey, ");
            expect(p.length).to.equal(5);
        });
    });

    describe("#insertAt", function () {
        it("should return a path with every key but the last", function () {
            const p = this.path.insertAt("just", 1);
            expect(p.keyAt(1)).to.equal("just");
            expect(p.length).to.equal(5);
        });
    });

    describe("#isEmpty", function () {
        it("should test if the length of the path is 0", function () {
            const p0 = this.path;
            expect(p0.isEmpty()).to.be.false;

            const p1 = GumpPath.fromString("");
            expect(p1.isEmpty()).to.be.false;

            const p2 = new GumpPath([]);
            expect(p2.isEmpty()).to.be.true;
        });
    });

    describe("#toString", function () {
        it("should return a string representation of the path", function () {
            const s0 = "this.is.a.test",
                  s1 = GumpPath.fromString(s0).toString();
            expect(s1).to.equal(s0);
        });
    });

    after(function () {
       delete this.path;
    });
});
