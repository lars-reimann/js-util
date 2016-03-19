import {expect} from "chai";

import {tortilla} from "../src/util.js";

describe("TortillaWrapper", function () {
    beforeEach(function () {
        this.inf = tortilla(function* (first = 0) {
            for (let n = first; ; n++) {
                yield n;
            }
        });

        this.fin = tortilla(function* () {
            yield "A";
            yield "B";
            yield "C";
        });

        this.iterable = tortilla("Hello");

        this.iterator = tortilla("world"[Symbol.iterator]());
    });

    // describe("#empty", function () {
    //     it("should not yield any values", function () {
    //         const r0 = [...TortillaGeneratorFunction.empty];
    //         expect(r0).to.be.empty;
    //     });
    // });

    // describe("#constant", function () {
    //     it("should yield the same value forever", function () {
    //         const r0 = [...TortillaGeneratorFunction.constant("A").take(3)];
    //         expect(r0).to.eql(["A", "A", "A"]);
    //     });
    // });

    // describe("#range", function () {
    //     it("should yield all values in the given range", function () {
    //         const r0 = [...TortillaGeneratorFunction.range(0, 5, 2)];
    //         expect(r0).to.eql([0, 2, 4]);

    //         const r1 = [...TortillaGeneratorFunction.range().take(4)];
    //         expect(r1).to.eql([0, 1, 2, 3]);
    //     });
    // });

    // TODO: infinite, finite generator, multiple invocations on iterator, iterables

    describe("#head", function() {
        it("should return the first value (infinite generator)", function () {
            expect(this.inf.head()).to.equal(0);
        });

        it("should return the first value (finite generator)", function () {
            expect(this.fin.head()).to.equal("A");
        });

        it("should return the first value (iterable)", function () {
            expect(this.iterable.head()).to.equal("H");
        });

        it("should return the first value (iterator)", function () {
            expect(this.iterator.head()).to.equal("w");
            expect(this.iterator.head()).to.equal("w");
        });
    });

    describe("#tail", function () {
        it("should drop the first value (infinite)", function () {
            const r0 = this.inf.tail().head();
            expect(r0).to.equal(1);
        });

        it("should drop the first value (finite)", function () {
            const r0 = [...this.fin.tail()].join("");
            expect(r0).to.equal("BC");
        });

        it("should drop the first value (iterable)", function () {
            const r0 = [...this.iterable.tail()].join("");
            expect(r0).to.equal("ello");
        });

        it("should drop the first value (iterator)", function () {
            const r0 = [...this.iterator.tail()].join("");
            expect(r0).to.equal("orld");

            const r1 = [...this.iterator.tail()].join("");
            expect(r1).to.equal("orld");
        });
    });

    describe("#chunk", function () {
        it("should yield chunks of the given size (infinite)", function () {
            const r0 = this.inf.chunk(2).head();
            expect(r0).to.eql([0, 1]);
        });

        it("should yield chunks of the given size (finite)", function () {
            const r0 = [...this.fin.chunk(2)];
            expect(r0).to.eql([["A", "B"], ["C"]]);
        });

        it("should yield chunks of the given size (iterable)", function () {
            const r0 = [...this.iterable.chunk(2)];
            expect(r0).to.eql([["H", "e"], ["l", "l"], ["o"]]);
        });

        it("should yield chunks of the given size (iterator)", function () {
            const r0 = [...this.iterator.chunk(2)];
            expect(r0).to.eql([["w", "o"], ["r", "l"], ["d"]]);

            const r1 = [...this.iterator.chunk(2)];
            expect(r1).to.eql([["w", "o"], ["r", "l"], ["d"]]);
        });
    });

    describe("compact", function () {
        it("should remove all falsy values (infinite)", function () {
            const r0 = this.inf.compact().head();
            expect(r0).to.equal(1);
        });

        it("should remove all falsy values (finite)", function () {
            const r0 = [...this.fin.compact()].join("");
            expect(r0).to.equal("ABC");
        });

        it("should remove all falsy values (iterable)", function () {
            const r0 = [...this.iterable.compact()].join("");
            expect(r0).to.equal("Hello");
        });

        it("should remove all falsy values (iterator)", function () {
            const r0 = [...this.iterator.compact()].join("");
            expect(r0).to.equal("world");

            const r1 = [...this.iterator.compact()].join("");
            expect(r1).to.equal("world");
        });
    });

    describe("without", function () {
        it("should remove all matching values (infinite)", function () {
            const r0 = this.inf.without([0, 1]).head();
            expect(r0).to.equal(2);
        });

        it("should remove all matching values (finite)", function () {
            const r0 = [...this.fin.without(["B"])].join("");
            expect(r0).to.equal("AC");
        });

        it("should remove all matching values (iterable)", function () {
            const r0 = [...this.iterable.without(["H"])].join("");
            expect(r0).to.equal("ello");
        });

        it("should remove all matching values (iterator)", function () {
            const r0 = [...this.iterator.without(["w"])].join("");
            expect(r0).to.equal("orld");

            const r1 = [...this.iterator.without(["w"])].join("");
            expect(r1).to.equal("orld");
        });
    });

    describe("slice", function () {
        it("should only yield values in the given range (infinite)", function () {
            const r0 = [...this.inf.slice(1, 3)];
            expect(r0).to.eql([1, 2]);
        });

        it("should only yield values in the given range (finite)", function () {
            const r0 = [...this.fin.slice(1, 2)].join("");
            expect(r0).to.equal("B");
        });

        it("should only yield values in the given range (iterable)", function () {
            const r0 = [...this.iterable.slice(1, 2)].join("");
            expect(r0).to.equal("e");
        });

        it("should only yield values in the given range (iterator)", function () {
            const r0 = [...this.iterator.slice(1, 2)].join("");
            expect(r0).to.equal("o");

            const r1 = [...this.iterator.slice(1, 2)].join("");
            expect(r1).to.equal("o");
        });
    });

    describe("#drop", function () {
        it("should drop the first n values (infinite)", function () {
            const r0 = this.inf.drop(2).head();
            expect(r0).to.equal(2);
        });

        it("should drop the first n values (finite)", function () {
            const r0 = [...this.fin.drop(4)].join("");
            expect(r0).to.be.empty;
        });

        it("should drop the first n values (iterable)", function () {
            const r0 = [...this.iterable.drop(4)].join("");
            expect(r0).to.equal("o");
        });

        it("should drop the first n values (iterator)", function () {
            const r0 = [...this.iterator.drop(4)].join("");
            expect(r0).to.equal("d");

            const r1 = [...this.iterator.drop(4)].join("");
            expect(r1).to.equal("d");
        });
    });

    describe("#dropWhile", function () {
        it("should drop all values until the predicate is true (infinite)", function () {
            const r0 = this.inf.dropWhile(x => x < 2).head();
            expect(r0).to.equal(2);
        });

        it("should drop all values until the predicate is true (finite)", function () {
            const r0 = [...this.fin.dropWhile(x => x !== "D")].join("");
            expect(r0).to.be.empty;
        });

        it("should drop all values until the predicate is true (iterable)", function () {
            const r0 = [...this.iterable.dropWhile(x => x !== "e")].join("");
            expect(r0).to.equal("ello");
        });

        it("should drop all values until the predicate is true (iterator)", function () {
            const r0 = [...this.iterator.dropWhile(x => x !== "d")].join("");
            expect(r0).to.equal("d");

            const r1 = [...this.iterator.dropWhile(x => x !== "d")].join("");
            expect(r1).to.equal("d");
        });
    });

    describe("#take", function () {
        it("should yield only the first n values (infinite)", function () {
            const r0 = [...this.inf.take(5)];
            expect(r0).to.eql([0, 1, 2, 3, 4]);
        });

        it("should yield only the first n values (finite)", function () {
            const r0 = [...this.fin.take(5)].join("");
            expect(r0).to.equal("ABC");
        });

        it("should yield only the first n values (iterable)", function () {
            const r0 = [...this.iterable.take(4)].join("");
            expect(r0).to.equal("Hell");
        });

        it("should yield only the first n values (iterator)", function () {
            const r0 = [...this.iterator.take(5)].join("");
            expect(r0).to.equal("world");

            const r1 = [...this.iterator.take(5)].join("");
            expect(r1).to.equal("world");
        });
    });

    describe("#takeWhile", function () {
        it("should yield only the first value until the predicate is false (infinite)", function () {
            const r0 = [...this.inf.takeWhile(x => x < 5)];
            expect(r0).to.eql([0, 1, 2, 3, 4]);
        });

        it("should yield only the first value until the predicate is false (finite)", function () {
            const r0 = [...this.fin.takeWhile(x => x !== "D")].join("");
            expect(r0).to.equal("ABC");
        });

        it("should yield only the first value until the predicate is false (iterable)", function () {
            const r0 = [...this.iterable.takeWhile(x => x !== "D")].join("");
            expect(r0).to.equal("Hello");
        });

        it("should yield only the first value until the predicate is false (iterator)", function () {
            const r0 = [...this.iterator.takeWhile(x => x !== "w")].join("");
            expect(r0).to.be.empty;

            const r1 = [...this.iterator.takeWhile(x => x !== "w")].join("");
            expect(r1).to.be.empty;
        });
    });

    describe("filter", function () {
        it("should yield only matching values (infinite)", function () {
            const r0 = this.inf.filter(x => x > 3).head();
            expect(r0).to.equal(4);
        });

        it("should yield only matching values (finite)", function () {
            const r0 = [...this.fin.filter(x => x !== "B")].join("");
            expect(r0).to.equal("AC");
        });

        it("should yield only matching values (iterable)", function () {
            const r0 = [...this.iterable.filter(x => x !== "o")].join("");
            expect(r0).to.equal("Hell");
        });

        it("should yield only matching values (iterator)", function () {
            const r0 = [...this.iterator.filter(x => x === "d")].join("");
            expect(r0).to.equal("d");

            const r1 = [...this.iterator.filter(x => x === "d")].join("");
            expect(r1).to.equal("d");
        });
    });

    describe("reject", function () {
        it("should yield only matching values (infinite)", function () {
            const r0 = this.inf.reject(x => x <= 3).head();
            expect(r0).to.equal(4);
        });

        it("should yield only matching values (finite)", function () {
            const r0 = [...this.fin.reject(x => x === "B")].join("");
            expect(r0).to.equal("AC");
        });

        it("should yield only matching values (iterable)", function () {
            const r0 = [...this.iterable.reject(x => x === "H")].join("");
            expect(r0).to.equal("ello");
        });

        it("should yield only matching values (iterator)", function () {
            const r0 = [...this.iterator.reject(x => x === "d")].join("");
            expect(r0).to.equal("worl");

            const r1 = [...this.iterator.reject(x => x === "d")].join("");
            expect(r1).to.equal("worl");
        });
    });

    describe("map", function () {
        it("should apply the function on each value and yield the results (infinite)", function () {
            const r0 = this.inf.map(x => x * 3).head();
            expect(r0).to.equal(0);
        });

        it("should apply the function on each value and yield the results (finite)", function () {
            const r0 = [...this.fin.map(x => x.toLowerCase())].join("");
            expect(r0).to.equal("abc");
        });

        it("should apply the function on each value and yield the results (iterable)", function () {
            const r0 = [...this.iterable.map(x => x.toLowerCase())].join("");
            expect(r0).to.equal("hello");
        });

        it("should apply the function on each value and yield the results (iterator)", function () {
            const r0 = [...this.iterator.map(x => x.toLowerCase())].join("");
            expect(r0).to.equal("world");

            const r1 = [...this.iterator.map(x => x.toLowerCase())].join("");
            expect(r1).to.equal("world");
        });
    });

    describe("flatten", function () {
        it("should yield the values of arrays separately (infinite)", function () {
            const r0 = this.inf.chunk(3).flatten().head();
            expect(r0).to.equal(0);
        });

        it("should yield the values of arrays separately (finite)", function () {
            const r0 = [...this.fin.chunk(3).flatten()].join("");
            expect(r0).to.equal("ABC");
        });

        it("should yield the values of arrays separately (iterable)", function () {
            const r0 = [...this.iterable.chunk(3).flatten()].join("");
            expect(r0).to.equal("Hello");
        });

        it("should yield the values of arrays separately (iterator)", function () {
            const r0 = [...this.iterator.chunk(3).flatten()].join("");
            expect(r0).to.equal("world");

            const r1 = [...this.iterator.chunk(3).flatten()].join("");
            expect(r1).to.equal("world");
        });
    });

    describe("apply", function () {
        it("should partially apply the given parameters (generator function)", function () {
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
