import {expect} from "chai";

import {Tolkien1To1Map, Tolkien1ToNMap, TolkienMToNMap, compose} from "../src/util.js";

describe("tolkien", function () {
    beforeEach(function () {
        this._1To1 = new Tolkien1To1Map([
            [5, 6],
            [6, 7],
            [7, 8]
        ]);

        this._1ToN = new Tolkien1ToNMap([
            [6, 5],
            [5, 6],
            [6, 7],
            [7, 8]
        ]);

        this._MToN = new TolkienMToNMap([
            [6, 5],
            [5, 6],
            [6, 7],
            [7, 8],
            [8, 8]
        ]);
    });

    describe("#compose", function () {
        it("should compose two 1 to 1 maps correctly", function () {
            const r = compose([this._1To1, this._1To1]);
            expect(r.hasPair(5, 7)).to.be.true;
            expect(r.hasPair(6, 8)).to.be.true;
            expect(r.size).to.equal(2);
        });

        it("should compose a 1 to 1 map and a 1 to N map correctly", function () {
            const r = compose([this._1To1, this._1ToN]);
            expect(r.hasPair(5, 7)).to.be.true;
            expect(r.hasPair(5, 5)).to.be.true;
            expect(r.hasPair(6, 8)).to.be.true;
            expect(r.size).to.equal(3);
        });

        it("should compose a 1 to 1 map and an M to N map correctly", function () {
            const r = compose([this._1To1, this._MToN]);
            expect(r.hasPair(5, 7)).to.be.true;
            expect(r.hasPair(5, 5)).to.be.true;
            expect(r.hasPair(6, 8)).to.be.true;
            expect(r.hasPair(7, 8)).to.be.true;
            expect(r.size).to.equal(4);
        });

        it("should compose a 1 to N map and a 1 to 1 map correctly", function () {
            const r = compose([this._1ToN, this._1To1]);
            expect(r.hasPair(6, 6)).to.be.true;
            expect(r.hasPair(5, 7)).to.be.true;
            expect(r.hasPair(6, 8)).to.be.true;
            expect(r.size).to.equal(3);
        });

        it("should compose two 1 to N maps correctly", function () {
            const r = compose([this._1ToN, this._1ToN]);
            expect(r.hasPair(6, 6)).to.be.true;
            expect(r.hasPair(5, 5)).to.be.true;
            expect(r.hasPair(5, 7)).to.be.true;
            expect(r.hasPair(6, 8)).to.be.true;
            expect(r.size).to.equal(4);
        });

        it("should compose a 1 to N map and an M to N map correctly", function () {
            const r = compose([this._1ToN, this._MToN]);
            expect(r.hasPair(6, 6)).to.be.true;
            expect(r.hasPair(5, 5)).to.be.true;
            expect(r.hasPair(5, 7)).to.be.true;
            expect(r.hasPair(7, 8)).to.be.true;
            expect(r.hasPair(6, 8)).to.be.true;
            expect(r.size).to.equal(5);
        });

        it("should compose an M to N map and a 1 to 1 map correctly", function () {
            const r = compose([this._MToN, this._1To1]);
            expect(r.hasPair(6, 6)).to.be.true;
            expect(r.hasPair(5, 7)).to.be.true;
            expect(r.hasPair(6, 8)).to.be.true;
            expect(r.size).to.equal(3);
        });

        it("should compose an M to N map and a 1 to N map correctly", function () {
            const r = compose([this._MToN, this._1ToN]);
            expect(r.hasPair(6, 6)).to.be.true;
            expect(r.hasPair(5, 5)).to.be.true;
            expect(r.hasPair(5, 7)).to.be.true;
            expect(r.hasPair(6, 8)).to.be.true;
            expect(r.size).to.equal(4);
        });

        it("should compose two M to N maps correctly", function () {
            const r = compose([this._MToN, this._MToN]);
            expect(r.hasPair(6, 6)).to.be.true;
            expect(r.hasPair(5, 5)).to.be.true;
            expect(r.hasPair(5, 7)).to.be.true;
            expect(r.hasPair(6, 8)).to.be.true;
            expect(r.hasPair(8, 8)).to.be.true;
            expect(r.hasPair(7, 8)).to.be.true;
            expect(r.size).to.equal(6);
        });
    });

    after(function () {
        delete this._1To1;
        delete this._1ToN;
        delete this._MToN;
    });
});