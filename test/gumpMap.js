import chai, {expect} from "chai";
import chaiSinon      from "sinon-chai";
chai.use(chaiSinon);

import sinon from "sinon";

import {GumpMap} from "../src/util.js";
import {GumpSet} from "../src/util.js";

describe("GumpMap", function () {
    beforeEach(function () {
        this.map = new GumpMap({ initialValues: [
            ["this", 3],
            ["this", 3],
            ["this", 4],
            ["is.a", "test"],
            ["is.a", "try"]
        ] });
    });

    describe("fromObject", function () {
        it("should convert a plain object to a GumpMap", function () {
            const m0 = GumpMap.fromObject({
                this: {
                    is: "just",
                    a:  "test"
                }
            });
            const s0 = m0.get("this.is");
            expect(s0.has("just")).to.be.true;
            const s1 = m0.get("this.a");
            expect(s1.has("test")).to.be.true;
        });

        it("should convert nested arrays to GumpSets", function () {
            const m0 = GumpMap.fromObject({
                this: {
                    is: ["just", "a", "test"]
                }
            });
            const s0 = m0.get("this.is");
            expect([...s0]).to.have.members(["just", "a", "test"]);
        });
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

        it("should update the size property", function () {
            expect(this.map.size).to.equal(4);

            this.map.add("this", 3);
            expect(this.map.size).to.equal(4);

            this.map.add("this", 1);
            expect(this.map.size).to.equal(5);

            this.map.add("that", 42);
            expect(this.map.size).to.equal(6);

            this.map.add("another.map", new GumpMap({ initialValues: [
                ["one", "entry"],
                ["two", "entries"]
            ] }));
            expect(this.map.size).to.equal(8);

            this.map.add("a_set", new GumpSet([1, 2]));
            expect(this.map.size).to.equal(10);
        });

        it("should fire an event", function () {
            const spy = sinon.spy();
            this.map.addListener(spy, "add");
            this.map.add("hi", 3);

            expect(spy).to.have.been.calledOnce;
            const e0 = spy.args[0][0];
            expect(e0.source).to.equal(this.map);
            expect(e0.type).to.equal("add");
            expect(e0.data.path.keyAt(0)).to.equal("hi");
            expect(e0.data.path.length).to.equal(1);
            expect(e0.data.value).to.equal(3);

            spy.reset();
            this.map.add("hey.there", 4);

            expect(spy).to.have.been.calledOnce;
            const e1 = spy.args[0][0];
            expect(e1.source).to.equal(this.map);
            expect(e1.type).to.equal("add");
            expect(e1.data.path.keyAt(0)).to.equal("hey");
            expect(e1.data.path.keyAt(1)).to.equal("there");
            expect(e1.data.path.length).to.equal(2);
            expect(e1.data.value).to.equal(4);
        });

        it("should fail if a path is too short and ends on a GumpMap", function () {
            const f = () => this.map.add("is", 5);
            expect(f).to.throw();
        });

        it("should fail id a path is too long and extends past a GumpSet", function () {
            const f = () => this.map.add("this.throws", 10);
            expect(f).to.throw();
        });
    });

    describe("#clear", function () {
        it("should empty the map completely (empty path)", function () {
            this.map.clear();
            expect(this.map.size).to.equal(0);
        });

        it("should clear the nested map/set (given path)", function () {
            this.map.add("hey", new GumpSet([1, 2]));
            this.map.clear("hey");
            expect(this.map.has("hey")).to.be.true;
            expect(this.map.size).to.equal(4);
        });

        it("should fire an event", function () {
            const spy = sinon.spy();
            this.map.addListener(spy, "clear");
            this.map.clear();

            expect(spy).to.have.been.calledOnce;
            const e = spy.args[0][0];
            expect(e.source).to.equal(this.map);
            expect(e.type).to.equal("clear");
            expect(e.data.path.length).to.equal(0);
            const paths   = e.data.deleted.map(e => e[0].toString());
            const values  = e.data.deleted.map(e => e[1]);
            expect(paths).to.have.members(["this", "this", "is.a", "is.a"]);
            expect(values).to.have.members([3, 4, "test", "try"]);
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

        it("should return whether the map changed", function () {
            expect(this.map.delete([])).to.be.false;
            expect(this.map.delete("that")).to.be.false;
            expect(this.map.delete("this", 10)).to.be.false;
            expect(this.map.delete("this")).to.be.true;
        });

        it("should remove containers when they become empty and the corresponding flag is set", function () {
            const map = new GumpMap({
                initialValues:            [["this", 3], ["this", 4]],
                autoPurgeEmptyContainers: true
            });
            map.delete("this", 3);
            expect(map.has("this")).to.be.true;

            map.delete("this", 4);
            expect(map.has("this")).to.be.false;
        });

        it("should fire an event", function () {
            const spy = sinon.spy();
            this.map.addListener(spy, "delete");
            this.map.add("hi", 3);
            this.map.delete("hi");

            expect(spy).to.have.been.calledOnce;
            const e0 = spy.args[0][0];
            expect(e0.source).to.equal(this.map);
            expect(e0.type).to.equal("delete");
            expect(e0.data.path.keyAt(0)).to.equal("hi");
            expect(e0.data.path.length).to.equal(1);
            expect(e0.data.deleted).to.have.members([3]);

            spy.reset();
            this.map.add("hey.there", 4);
            this.map.delete("hey.there", 4);

            expect(spy).to.have.been.calledOnce;
            const e1 = spy.args[0][0];
            expect(e1.source).to.equal(this.map);
            expect(e1.type).to.equal("delete");
            expect(e1.data.path.keyAt(0)).to.equal("hey");
            expect(e1.data.path.keyAt(1)).to.equal("there");
            expect(e1.data.path.length).to.equal(2);
            expect(e1.data.deleted).to.have.members([4]);
        });
    });

    describe("#purgeEmptyContainers", function () {
        it("should remove all nested maps and sets with size 0", function () {
            this.map.add("hey", new GumpSet([1, 2]));
            this.map.add("yo",  new GumpMap());
            this.map.clear("hey");
            this.map.purgeEmptyContainers();
            expect(this.map.has("hey")).to.be.false;
            expect(this.map.has("yo")).to.be.false;
        });
    });

    describe("#get", function () {
        it("should return a value if it exists", function () {
            expect(this.map.get([])).to.equal(this.map);

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
            expect(this.map.get(42)).to.be.undefined;
            expect(this.map.get("for.real")).to.be.undefined;
        });
    });

    describe("#has", function () {
        it("should return true if an entry exists", function () {
            expect(this.map.has("this")).to.be.true;
            expect(this.map.has("is.a")).to.be.true;
            expect(this.map.has("this", 3)).to.be.true;
        });

        it("should return false if an entry does not exist", function () {
            expect(this.map.has(42)).to.be.false;
            expect(this.map.has("is.a", "trick")).to.be.false;
            expect(this.map.has("this.fails", 3)).to.be.false;
        });
    });

    describe("#entries", function () {
        it("should return the top-level entries (resolveMaps = resolveSets = false)", function () {
            const entries = [...this.map.entries({resolveMaps: false, resolveSets: false})];
            const keys    = entries.map(e => e[0].toString());
            const values  = entries.map(e => e[1]);
            expect(keys).to.have.members(["this", "is"]);
            expect(values[0]).to.be.an.instanceof(GumpSet);
            expect(values[1]).to.be.an.instanceof(GumpMap);
            expect(values.length).to.equal(2);
        });

        it("should resolve maps (resolveMaps = true)", function () {
            const entries = [...this.map.entries()];
            const keys    = entries.map(e => e[0].toString());
            expect(keys).to.have.members(["this", "is.a"]);
        });

        it("should resolve sets (resolveSets = true)", function () {
            const entries = [...this.map.entries()];
            const values  = entries.map(e => e[1]);
            expect(values).to.have.members(["test", "try", 3, 4]);
        });
    });

    describe("#keys", function () {
        it("should return the keys of the top-level map", function () {
            const keys = [...this.map.keys()];
            expect(keys).to.have.members(["this", "is"]);
        });
    });

    describe("#paths", function () {
        it("should return the top-level paths (resolveMaps = false)", function () {
            const paths = [...this.map.paths(false)].map(p => p.toString());
            expect(paths).to.have.members(["this", "is"]);
        });

        it("should return all paths (resolveMaps = true)", function () {
            const paths = [...this.map.paths(true)].map(p => p.toString());
            expect(paths).to.have.members(["this", "is.a"]);
        });
    });

    describe("#values", function () {
        it("should return the top-level values (resolveMaps = resolveSets = false)", function () {
            const values = [...this.map.values({resolveMaps: false, resolveSets: false})];
            expect(values[0]).to.be.an.instanceof(GumpSet);
            expect(values[1]).to.be.an.instanceof(GumpMap);
            expect(values.length).to.equal(2);
        });

        it("should resolve maps (resolveMaps = true)", function () {
            const values = [...this.map.values({resolveMaps: true, resolveSets: false})];
            expect(values[0]).to.be.an.instanceof(GumpSet);
            expect(values[1]).to.be.an.instanceof(GumpSet);
            expect(values.length).to.equal(2);
        });

        it("should resolve sets (resolveSets = true)", function () {
            const values = [...this.map.values({resolveMaps: true, resolveSets: true})];
            expect(values).to.have.members(["test", "try", 3, 4]);
        });
    });

    describe("#updateWithLiteral", function () {
        it("should replace a value with another value", function () {
            this.map.updateWithLiteral(2, "this", 3);
            const s0 = this.map.get("this");
            expect(s0.has(3)).to.be.false;
            expect(s0.has(2)).to.be.true;
            expect(s0.size).to.equal(2);
        });

        it("should leave the set unchanged if the value does not exist", function () {
            this.map.updateWithLiteral(2, "this", 1);
            const s0 = this.map.get("this");
            expect(s0.has(3)).to.be.true;
            expect(s0.has(4)).to.be.true;
            expect(s0.size).to.equal(2);
        });
    });

    describe("#updateWithFunction", function () {
        it("should replace a value with the result of calling a function on this value", function () {
            this.map.updateWithFunction(x => x - 1, "this", 3);
            const s0 = this.map.get("this");
            expect(s0.has(3)).to.be.false;
            expect(s0.has(2)).to.be.true;
            expect(s0.size).to.equal(2);
        });

        it("should leave the set unchanged if the value does not exist", function () {
            this.map.updateWithFunction(x => x - 1, "this", 1);
            const s0 = this.map.get("this");
            expect(s0.has(3)).to.be.true;
            expect(s0.has(4)).to.be.true;
            expect(s0.size).to.equal(2);
        });
    });

    describe("#set", function () {
        it("should replace an existing value", function () {
            this.map.set("this", 1);
            const s0 = this.map.get("this");
            expect(s0.has(1)).to.be.true;
            expect(s0.size).to.equal(1);
        });

        it("should add a new entry if no value exists at this location", function () {
            this.map.set("hello", "world");
            const s0 = this.map.get("hello");
            expect(s0.has("world")).to.be.true;
            expect(s0.size).to.equal(1);
        });
    });

    after(function () {
        delete this.map;
    });
});
