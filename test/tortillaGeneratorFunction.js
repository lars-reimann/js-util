import {expect} from "chai";

import {TortillaGeneratorFunction} from "../src/util.js";

describe("TortillaGeneratorFunction", function () {
    beforeEach(function () {
        this.up = new TortillaGeneratorFunction(function* (first = 0) {
            for (let n = first; ; n++) {
                yield n;
            }
        });
    });

    describe("#head", function() {
        it ("should return the first value", function () {
            expect(this.up.head(2)).to.equal(2);
        });

        it("should allow multiple invocations", function () {
            expect(this.up.head()).to.equal(0);
            expect(this.up.head()).to.equal(0);
        });
    });

    describe("#tail", function () {
        it("should drop the first value", function () {
            const r0 = this.up.tail(2).head();
            expect(r0).to.equal(3);
        });

        it("should allow multiple invocations", function () {
            const r0 = this.up.tail().head();
            expect(r0).to.equal(1);

            const r1 = this.up.tail().head();
            expect(r1).to.equal(1);
        });
    });

    describe("#drop", function () {
        it("should drop the first n values", function () {
            const r0 = this.up.drop(2, 2).head();
            expect(r0).to.equal(4);
        });

        it("should allow multiple invocations", function () {
            const r0 = this.up.drop(2).head();
            expect(r0).to.equal(2);

            const r1 = this.up.drop(2).head();
            expect(r1).to.equal(2);
        });
    });

    describe("#dropWhile", function () {
        it("should drop all values until the predicate is true", function () {
            const r0 = this.up.dropWhile(x => x < 2, -1).head();
            expect(r0).to.equal(2);
        });

        it("should allow multiple invocations", function () {
            const r0 = this.up.dropWhile(x => x < 2).head();
            expect(r0).to.equal(2);

            const r1 = this.up.dropWhile(x => x < 2).head();
            expect(r1).to.equal(2);
        });
    });

    describe("#take", function () {
        it("should yield only the first n values", function () {
            const r0 = [...this.up.take(5, 5)];
            expect(r0).to.eql([5, 6, 7, 8, 9]);
        });

        it("should allow multiple invocations", function () {
            const r0 = [...this.up.take(5)];
            expect(r0).to.eql([0, 1, 2, 3, 4]);

            const r1 = [...this.up.take(5)];
            expect(r1).to.eql([0, 1, 2, 3, 4]);
        });
    });

    after(function () {
        delete this.f;
    });
});
