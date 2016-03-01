import chai, {expect} from "chai";
import chaiSinon      from "sinon-chai";
chai.use(chaiSinon);

import sinon from "sinon";

import {GumpMap} from "../src/util.js";
import {GumpSet} from "../src/util.js";

describe("GumpSet", function () {
    beforeEach(function () {
        this.map = new GumpMap([
            ["this", 3],
            ["this", 3],
            ["this", 4],
            ["is.a", "test"],
            ["is.a", "try"]
        ]);
    });

    describe("#add", function () {
        it("should add a given value on the same level", function () {
            this.map.add("this", 5);
            const s0 = this.map.get("this");
            expect(s0.has(3)).to.be.true;
            expect(s0.has(4)).to.be.true;
            expect(s0.has(5)).to.be.true;
            expect(s0.size).to.equal(3);

            this.map.add(42, "the answer");
            const s1 = this.map.get(42);
            expect(s1.has("the answer")).to.be.true;
            expect(s1.size).to.equal(1);
        });

        it("should add a given value on deeper levels", function () {
            this.map.add("is.a", "trick");
            expect(this.map.get("is")).to.be.an.instanceof(GumpMap);
            const s = this.map.get("is.a");
            expect(s.has("test")).to.be.true;
            expect(s.has("trick")).to.be.true;
            expect(s.has("try")).to.be.true;
            expect(s.size).to.equal(3);
        });

        it("should fire an event", function () {
            for (let key of this.map.keys()) {
                console.log("" + key);
            }
            for (let value of this.map.values()) {
                console.log("" + value);
            }
            for (let [key, value] of this.map.entries()) {
                console.log("" + key, "" + value);
            }
            // const spy = sinon.spy();
            // this.s.addListener(spy, "add");
            // this.s.add(3);

            // expect(spy).to.have.been.calledOnce;
            // const e = spy.args[0][0];
            // expect(e.source).to.equal(this.s);
            // expect(e.type).to.equal("add");
            // expect(e.data).to.equal(3);
        });
    });

    describe("#delete", function () {
        it("should remove a value on the same level (given value parameter)", function () {
            this.map.delete("this", 3);
            const s0 = this.map.get("this");
            expect(s0.has(4)).to.be.true;
            expect(s0.size).to.equal(1);
        });

        it("should remove all values on the same level ", function () {
            this.map.delete("this");
            expect(this.map.has("this")).to.be.false;
        });

        it("should remove a value on a deeper level (given value parameter)", function () {
            this.map.delete("is.a", "test");
            const s0 = this.map.get("is.a");
            expect(s0.has("try")).to.be.true;
            expect(s0.size).to.equal(1);
        });

        it("should remove all values on a deeper level", function () {
            this.map.delete("is.a");
            expect(this.map.has("is.a")).to.be.false;
        });

        it("should fire an event", function () {

        });
    });

    describe("#get", function () {
        it("should return a value if it exists", function () {
            const s0 = this.map.get("this");
            expect(s0.has(3)).to.be.true;
            expect(s0.has(4)).to.be.true;
            expect(s0.size).to.equal(2);

            const s1 = this.map.get("is.a");
            expect(s1.has("test")).to.be.true;
            expect(s1.has("try")).to.be.true;
            expect(s1.size).to.equal(2);
        });

        it("should return undefined if the path leads nowhere", function () {
            expect(this.map.get([])).to.be.undefined;
            expect(this.map.get(42)).to.be.undefined;
            expect(this.map.get("for.real")).to.be.undefined;
        });
    });

    describe("#has", function () {
        it("should return true if a value exists", function () {
            expect(this.map.has("this")).to.be.true;
            expect(this.map.has("is.a")).to.be.true;
            expect(this.map.has("this", 3)).to.be.true;
        });

        it("should return false if a value does not exist", function () {
            expect(this.map.has(42)).to.be.false;
            expect(this.map.has("is.a", "trick")).to.be.false;
        });
    });

    describe("#entries", function () {
        it("should return the top level entries (deep = false)", function () {
            const entries = [...this.map.entries(false)];
            const keys    = entries.map(e => e[0].toString());
            const values  = entries.map(e => e[1]);
            expect(keys).to.have.members(["this", "is"]);
            expect(values[0]).to.be.an.instanceof(GumpSet);
            expect(values[1]).to.be.an.instanceof(GumpMap);
            expect(values.length).to.equal(2);
        });

        it("should return all entries (deep = true)", function () {
            const entries = [...this.map.entries(true)];
            const keys    = entries.map(e => e[0].toString());
            const values  = entries.map(e => e[1]);
            expect(keys).to.have.members(["this", "is.a"]);
            expect(values[0]).to.be.an.instanceof(GumpSet);
            expect(values[1]).to.be.an.instanceof(GumpSet);
            expect(values.length).to.equal(2);
        });
    });

    describe("#keys", function () {
        it("should return the top level keys (deep = false)", function () {
            const keys = [...this.map.keys(false)].map(p => p.toString());
            expect(keys).to.have.members(["this", "is"]);
        });

        it("should return all keys (deep = true)", function () {
            const keys = [...this.map.keys(true)].map(p => p.toString());
            expect(keys).to.have.members(["this", "is.a"]);
        });
    });

    describe("#values", function () {
        it("should return the top level values (deep = false)", function () {
            const values = [...this.map.values(false)];
            expect(values[0]).to.be.an.instanceof(GumpSet);
            expect(values[1]).to.be.an.instanceof(GumpMap);
            expect(values.length).to.equal(2);
        });

        it("should return all values (deep = true)", function () {
            const values = [...this.map.values(true)];
            expect(values[0]).to.be.an.instanceof(GumpSet);
            expect(values[1]).to.be.an.instanceof(GumpSet);
            expect(values.length).to.equal(2);
        });
    });

    after(function () {
        delete this.map;
    });
});
