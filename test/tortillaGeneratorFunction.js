import {expect} from "chai";

import {TortillaGeneratorFunction} from "../src/util.js";

describe("TortillaGeneratorFunction", function () {
    beforeEach(function () {
        this.inf = new TortillaGeneratorFunction(function* (first = 0) {
            for (let n = first; ; n++) {
                yield n;
            }
        });

        this.fin = new TortillaGeneratorFunction(function* () {
            yield "A";
            yield "B";
            yield "C";
        });
    });

    describe("#empty", function () {
        it("should not yield any values", function () {
            const r0 = [...TortillaGeneratorFunction.empty];
            expect(r0).to.be.empty;
        });
    });

    describe("#constant", function () {
        it("should yield the same value forever", function () {
            const r0 = [...TortillaGeneratorFunction.constant("A").take(3)];
            expect(r0).to.eql(["A", "A", "A"]);
        });
    });

    describe("#range", function () {
        it("should yield all values in the given range", function () {
            const r0 = [...TortillaGeneratorFunction.range(0, 5, 2)];
            expect(r0).to.eql([0, 2, 4]);

            const r1 = [...TortillaGeneratorFunction.range().take(4)];
            expect(r1).to.eql([0, 1, 2, 3]);
        });
    });

    describe("#head", function() {
        it("should return the first value (infinite)", function () {
            expect(this.inf.head(2)).to.equal(2);
        });

        it("should return the first value (finite)", function () {
            expect(this.fin.head()).to.equal("A");
        });

        it("should allow multiple invocations", function () {
            expect(this.inf.head()).to.equal(0);
            expect(this.inf.head()).to.equal(0);
        });
    });

    describe("#tail", function () {
        it("should drop the first value (infinite)", function () {
            const r0 = this.inf.tail(2).head();
            expect(r0).to.equal(3);
        });

        it("should drop the first value (finite)", function () {
            const r0 = [...this.fin.tail()];
            expect(r0).to.eql(["B", "C"]);
        });

        it("should allow multiple invocations", function () {
            const r0 = this.inf.tail().head();
            expect(r0).to.equal(1);

            const r1 = this.inf.tail().head();
            expect(r1).to.equal(1);
        });
    });

    describe("#drop", function () {
        it("should drop the first n values (infinite)", function () {
            const r0 = this.inf.drop(2, 2).head();
            expect(r0).to.equal(4);
        });

        it("should drop the first n values (finite)", function () {
            const r0 = [...this.fin.drop(4)];
            expect(r0).to.be.empty;
        });

        it("should allow multiple invocations", function () {
            const r0 = this.inf.drop(2).head();
            expect(r0).to.equal(2);

            const r1 = this.inf.drop(2).head();
            expect(r1).to.equal(2);
        });
    });

    describe("#dropWhile", function () {
        it("should drop all values until the predicate is true (infinite)", function () {
            const r0 = this.inf.dropWhile(x => x < 2, -1).head();
            expect(r0).to.equal(2);
        });

        it("should drop all values until the predicate is true (finite)", function () {
            const r0 = [...this.fin.dropWhile(x => x !== "D")];
            expect(r0).to.be.empty;
        });

        it("should allow multiple invocations", function () {
            const r0 = this.inf.dropWhile(x => x < 2).head();
            expect(r0).to.equal(2);

            const r1 = this.inf.dropWhile(x => x < 2).head();
            expect(r1).to.equal(2);
        });
    });

    describe("#take", function () {
        it("should yield only the first n values (infinite)", function () {
            const r0 = [...this.inf.take(5, 5)];
            expect(r0).to.eql([5, 6, 7, 8, 9]);
        });

        it("should yield only the first n values (finite)", function () {
            const r0 = [...this.fin.take(5)];
            expect(r0).to.eql(["A", "B", "C"]);
        });

        it("should allow multiple invocations", function () {
            const r0 = [...this.inf.take(5)];
            expect(r0).to.eql([0, 1, 2, 3, 4]);

            const r1 = [...this.inf.take(5)];
            expect(r1).to.eql([0, 1, 2, 3, 4]);
        });
    });

    describe("#takeWhile", function () {
        it("should yield only the first value until the predicate is false (infinite)", function () {
            const r0 = [...this.inf.takeWhile(x => x < 7, 5)];
            expect(r0).to.eql([5, 6]);
        });

        it("should yield only the first value until the predicate is false (finite)", function () {
            const r0 = [...this.fin.takeWhile(x => x !== "D")];
            expect(r0).to.eql(["A", "B", "C"]);
        });

        it("should allow multiple invocations", function () {
            const r0 = [...this.inf.takeWhile(x => x < 5)];
            expect(r0).to.eql([0, 1, 2, 3, 4]);

            const r1 = [...this.inf.takeWhile(x => x < 5)];
            expect(r1).to.eql([0, 1, 2, 3, 4]);
        });
    });

    describe("filter", function () {
        it("should yield only matching values (infinite)", function () {
            const r0 = this.inf.filter(x => x > 4, 2).head();
            expect(r0).to.equal(5);
        });

        it("should yield only matching values (finite)", function () {
            const r0 = [...this.fin.filter(x => x !== "B")];
            expect(r0).to.eql(["A", "C"]);
        });

        it("should allow multiple invocations", function () {
            const r0 = this.inf.filter(x => x > 3).head();
            expect(r0).to.equal(4);

            const r1 = this.inf.filter(x => x > 3).head();
            expect(r1).to.equal(4);
        });
    });

    describe("map", function () {
        it("should apply the function on each value and yield the results (infinite)", function () {
            const r0 = this.inf.map(x => x * 2, 4).head();
            expect(r0).to.equal(8);
        });

        it("should apply the function on each value and yield the results (finite)", function () {
            const r0 = [...this.fin.map(x => x.toLowerCase())];
            expect(r0).to.eql(["a", "b", "c"]);
        });

        it("should allow multiple invocations", function () {
            const r0 = this.inf.map(x => x * 3).head();
            expect(r0).to.equal(0);

            const r1 = this.inf.map(x => x * 3).head();
            expect(r1).to.equal(0);
        });
    });

    describe("apply", function () {
        it("should partially apply the given parameters", function () {
            const r0 = this.inf.apply(4).head();
            expect(r0).to.equal(4);

            const r1 = this.inf.apply(5).apply().apply().head();
            expect(r1).to.equal(5);
        });
    });

    after(function () {
        delete this.f;
    });
});
