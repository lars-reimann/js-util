import chai, {expect} from "chai";
import chaiSinon      from "sinon-chai";
chai.use(chaiSinon);

import sinon from "sinon";

import {GumpSet} from "../src/util.js";

describe("GumpSet", function () {
    beforeEach(function () {
        this.set = new GumpSet([1, 2]);
    });

    describe("#add", function () {
        it("should add a given value to the set if it does not exist already", function () {
            this.set.add(3);
            expect(this.set.has(3)).to.be.true;
            expect(this.set.size).to.equal(3);
        });

        it("should leave the set unchanged if the value exists already", function () {
            this.set.add(2);
            expect(this.set.size).to.equal(2);
        });

        it("should fire an event", function () {
            const spy = sinon.spy();
            this.set.addListener(spy, "add");
            this.set.add(3);

            expect(spy).to.have.been.calledOnce;
            const e = spy.args[0][0];
            expect(e.source).to.equal(this.set);
            expect(e.type).to.equal("add");
            expect(e.data.value).to.equal(3);
        });
    });

    describe("#clear", function () {
        it("should remove all values from the set", function () {
            this.set.clear();
            expect(this.set.size).to.equal(0);
        });

        it("should fire an event", function () {
            const spy = sinon.spy();
            this.set.addListener(spy, "clear");
            this.set.clear();

            expect(spy).to.have.been.calledOnce;
            const e = spy.args[0][0];
            expect(e.source).to.equal(this.set);
            expect(e.type).to.equal("clear");
            expect(e.data.value).to.have.members([1, 2]);
        });
    });

    describe("#delete", function () {
        it("should delete a given value from the set", function () {
            this.set.delete(1);
            expect(this.set.has(2)).to.be.true;
            expect(this.set.size).to.equal(1);
        });

        it("should leave the set unchanged if the value does not exist", function () {
            this.set.delete(3);
            expect(this.set.size).to.equal(2);
        });

        it("should fire an event", function () {
            const spy = sinon.spy();
            this.set.addListener(spy, "delete");
            this.set.delete(2);

            expect(spy).to.have.been.calledOnce;
            const e = spy.args[0][0];
            expect(e.source).to.equal(this.set);
            expect(e.type).to.equal("delete");
            expect(e.data.value).to.equal(2);
        });
    });

    describe("#updateWithLiteral", function () {
        it("should replace a value with another value", function () {
            this.set.updateWithLiteral(3, 2);
            expect(this.set.has(2)).to.be.false;
            expect(this.set.has(3)).to.be.true;
            expect(this.set.size).to.equal(2);
        });

        it("should leave the set unchanged if the value does not exist", function () {
            this.set.updateWithLiteral(4, 3);
            expect(this.set.has(1)).to.be.true;
            expect(this.set.has(2)).to.be.true;
            expect(this.set.size).to.equal(2);
        });
    });

    describe("#updateWithFunction", function () {
        it("should replace a value with the result of calling a function on this value", function () {
            this.set.updateWithFunction(x => x + 1, 2);
            expect(this.set.has(2)).to.be.false;
            expect(this.set.has(3)).to.be.true;
            expect(this.set.size).to.equal(2);
        });

        it("should leave the set unchanged if the value does not exist", function () {
            this.set.updateWithFunction(x => x + 1, 3);
            expect(this.set.has(1)).to.be.true;
            expect(this.set.has(2)).to.be.true;
            expect(this.set.size).to.equal(2);
        });
    });

    describe("#toString", function () {
        it("should return a string representation of the set", function () {
            const s = new GumpSet(["a", 1]).toString();
            expect(s).to.be.a("string");
        });
    });

    after(function () {
        delete this.set;
    });
});
