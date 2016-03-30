import chai, {expect} from "chai";
import chaiSinon      from "sinon-chai";
chai.use(chaiSinon);

import sinon from "sinon";

import {Tolkien1To1Map} from "../src/util.js";

describe("Tolkien1To1Map", function () {
    beforeEach(function () {
        this.map = new Tolkien1To1Map([
            ["x", "z"],
            ["x", "y"],
            ["answer", 42],
            ["number", 42],
            ["key", "value"]
        ]);
    });

    describe("#add", function () {
        it("should add new entries if the key was not used before", function () {
            const r = this.map.has({x: "key", y: "value"});
            expect(r).to.be.true;
        });

        it("should override existing entries", function () {
            const r0 = this.map.has({x: "x", y: "z"});
            expect(r0).to.be.false;

            const r1 = this.map.has({x: "x", y: "y"});
            expect(r1).to.be.true;

            const r2 = this.map.has({x: "answer", y: 42});
            expect(r2).to.be.false;

            const r3 = this.map.has({x: "number", y: 42});
            expect(r3).to.be.true;
        });

        it("should fire an event", function () {
            const spy = sinon.spy();
            this.map.addListener(spy, "add");
            this.map.add("a", "b");

            expect(spy).to.have.been.calledOnce;
            const e = spy.args[0][0];
            expect(e.source).to.equal(this.map);
            expect(e.type).to.equal("add");
            expect(e.data.x).to.equal("a");
            expect(e.data.y).to.equal("b");
        });
    });

    describe("#clear", function () {
        it("should remove all elements from the map", function () {
            this.map.clear();
            expect(this.map.size).to.equal(0);
        });

        it("should fire an event", function () {
            const spy = sinon.spy();
            this.map.addListener(spy, "clear");
            this.map.clear();

            expect(spy).to.have.been.calledOnce;
            const e = spy.args[0][0];
            expect(e.source).to.equal(this.map);
            expect(e.type).to.equal("clear");

            const keys   = e.data.map(entry => entry[0]);
            const values = e.data.map(entry => entry[1]);
            expect(keys).to.have.members(["x", "number", "key"]);
            expect(values).to.have.members(["y", 42, "value"]);
        });
    });

    describe("#delete", function () {
        it("should remove entries with the given x-value", function () {
            this.map.delete({x: "x"});

            const r = this.map.has({x: "x"});
            expect(r).to.be.false;
        });

        it("should remove entries with the given y-value", function () {
            this.map.delete({y: "y"});

            const r = this.map.has({y: "y"});
            expect(r).to.be.false;
        });

        it("should remove entries with the given x- and y-values", function () {
            this.map.delete({x: "x", y: "y"});

            const r = this.map.has({x: "x", y: "y"});
            expect(r).to.be.false;
        });

        it("should fire an event", function () {
            const spy = sinon.spy();
            this.map.addListener(spy, "delete");
            this.map.delete({x: "x"});

            expect(spy).to.have.been.calledOnce;
            const e = spy.args[0][0];
            expect(e.source).to.equal(this.map);
            expect(e.type).to.equal("delete");

            const keys   = e.data.deleted.map(entry => entry[0]);
            const values = e.data.deleted.map(entry => entry[1]);
            expect(keys).to.have.members(["x"]);
            expect(values).to.have.members(["y"]);
        });
    });

    describe("#convertXToY", function () {
        it("should return an array with the corresponding y-values", function () {
            const r0 = this.map.convertXToY("x");
            expect(r0).to.have.members(["y"]);

            const r1 = this.map.convertXToY("number");
            expect(r1).to.have.members([42]);

            const r2 = this.map.convertXToY("1");
            expect(r2).to.be.empty;
        });
    });

    describe("#convertYToX", function () {
        it("should return an array with the corresponding x-values", function () {
            const r0 = this.map.convertYToX("y");
            expect(r0).to.have.members(["x"]);

            const r1 = this.map.convertYToX(42);
            expect(r1).to.have.members(["number"]);

            const r2 = this.map.convertYToX("1");
            expect(r2).to.be.empty;
        });
    });

    describe("#has", function () {
        it("should test if an entry with a given x-value exists", function () {
            const r0 = this.map.has({x: "x"});
            expect(r0).to.be.true;

            const r1 = this.map.has({x: "money"});
            expect(r1).to.be.false;
        });

        it("should test if an entry with a given y-value exists", function () {
            const r0 = this.map.has({y: "y"});
            expect(r0).to.be.true;

            const r1 = this.map.has({y: 43});
            expect(r1).to.be.false;
        });

        it("should test if an entry with a given x- and y-value exists", function () {
            const r0 = this.map.has({x: "x", y: "y"});
            expect(r0).to.be.true;

            const r1 = this.map.has({x: "x", y: "z"});
            expect(r1).to.be.false;
        });
    });

    describe("#set", function () {
        it("should add new entries if the key was not used before", function () {
            this.map.set("hello", "world");
            const r = this.map.has({x: "hello", y: "world"});
            expect(r).to.be.true;
        });

        it("should override existing entries", function () {
            this.map.set("x", "ex");
            this.map.set("bad joke", 42);

            const r0 = this.map.has({x: "x", y: "y"});
            expect(r0).to.be.false;

            const r1 = this.map.has({x: "x", y: "ex"});
            expect(r1).to.be.true;

            const r2 = this.map.has({x: "number", y: 42});
            expect(r2).to.be.false;

            const r3 = this.map.has({x: "bad joke", y: 42});
            expect(r3).to.be.true;
        });
    });

    describe("#xs", function () {
        it("should yield all x-values in the map", function () {
            const r = [...this.map.xs()];
            expect(r).to.have.members(["x", "number", "key"]);
        });
    });

    describe("#ys", function () {
        it("should yield all y-values in the map", function () {
            const r = [...this.map.ys()];
            expect(r).to.have.members(["y", 42, "value"]);
        });
    });

    describe("#entries", function () {
        it("should yield all x-y-entries in the map", function () {
            const r = [...this.map.entries()];
            const keys   = r.map(entry => entry[0]);
            const values = r.map(entry => entry[1]);
            expect(keys).to.have.members(["x", "number", "key"]);
            expect(values).to.have.members(["y", 42, "value"]);
        });
    });

    after(function () {
        delete this.map;
    });
});