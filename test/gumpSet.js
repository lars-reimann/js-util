import {expect} from "chai";

import {GumpSet} from "../src/util.js";

describe("GumpPath", function () {

    describe("#fromString", function () {
        it("create a GumpPath from a given string", function () {
            const p0 = GumpPath.fromString("this.is.a.test");
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
            const k = GumpPath.fromString("this.is.a.test");
            expect(k.head()).to.equal("this");
        });
    });

    describe("#tail", function () {
        it("should return the remaining path, i. e. everything but the head", function () {
            const p = GumpPath.fromString("this.is.a.test").tail();
            expect(p.keyAt(0)).to.equal("is");
            expect(p.keyAt(1)).to.equal("a");
            expect(p.keyAt(2)).to.equal("test");
        });
    });

    describe("#isEmpty", function () {
        it("should test if the length of the path is 0", function () {
            const p0 = GumpPath.fromString("this.is.a.test");
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
                  s1 = GumpPath.fromString(s0).toString()
            expect(s1).to.equal(s0);
        });
    })
});
