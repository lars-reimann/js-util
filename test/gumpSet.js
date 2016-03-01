import chai, {expect} from "chai";
import chaiSinon      from "sinon-chai";
chai.use(chaiSinon);

import sinon from "sinon";

import {GumpSet} from "../src/util.js";

describe("GumpSet", function () {
    beforeEach(function () {
        this.s = new GumpSet([1, 2]);
    });

    describe("#add", function () {
        it("should add a given value to the set if it does not exist already", function () {
            this.s.add(3);
            expect(this.s.has(3)).to.be.true;
            expect(this.s.size).to.equal(3);
        });

        it("should leave the set unchanged if the value exists already", function () {
            this.s.add(2);
            expect(this.s.size).to.equal(2);
        });

        it("should fire an event", function () {
            const spy = sinon.spy();
            this.s.addListener(spy, "add");
            this.s.add(3);

            expect(spy).to.have.been.calledOnce;
            const e = spy.args[0][0];
            expect(e.source).to.equal(this.s);
            expect(e.type).to.equal("add");
            expect(e.data).to.equal(3);
        });
    });

    describe("#clear", function () {
        it("should remove all values from the set", function () {
            this.s.clear();
            expect(this.s.size).to.equal(0);
        });

        it("should fire an event", function () {
            const spy = sinon.spy();
            this.s.addListener(spy, "clear");
            this.s.clear();

            expect(spy).to.have.been.calledOnce;
            const e = spy.args[0][0];
            expect(e.source).to.equal(this.s);
            expect(e.type).to.equal("clear");
            expect(e.data).to.have.members([1, 2]);
        });
    });

    describe("#delete", function () {
        it("should delete a given value from the set", function () {
            this.s.delete(1);
            expect(this.s.has(2)).to.be.true;
            expect(this.s.size).to.equal(1);
        });

        it("should leave the set unchanged if the value does not exist", function () {
            this.s.delete(3);
            expect(this.s.size).to.equal(2);
        });

        it("should fire an event", function () {
            const spy = sinon.spy();
            this.s.addListener(spy, "delete");
            this.s.delete(2);

            expect(spy).to.have.been.calledOnce;
            const e = spy.args[0][0];
            expect(e.source).to.equal(this.s);
            expect(e.type).to.equal("delete");
            expect(e.data).to.equal(2);
        });
    });

    describe("#updateWithLiteral", function () {
        it("should replace a value with another value", function () {
            this.s.updateWithLiteral(3, 2);
            expect(this.s.has(2)).to.be.false;
            expect(this.s.has(3)).to.be.true;
            expect(this.s.size).to.equal(2);
        });

        it("should leave the set unchanged if the value does not exist", function () {
            this.s.updateWithLiteral(4, 3);
            expect(this.s.has(1)).to.be.true;
            expect(this.s.has(2)).to.be.true;
            expect(this.s.size).to.equal(2);
        });
    });

    describe("#updateWithFunction", function () {
        it("should replace a value with the result of calling a function on this value", function () {
            this.s.updateWithFunction(x => x + 1, 2);
            expect(this.s.has(2)).to.be.false;
            expect(this.s.has(3)).to.be.true;
            expect(this.s.size).to.equal(2);
        });

        it("should leave the set unchanged if the value does not exist", function () {
            this.s.updateWithFunction(x => x + 1, 3);
            expect(this.s.has(1)).to.be.true;
            expect(this.s.has(2)).to.be.true;
            expect(this.s.size).to.equal(2);
        });


    });

    describe("#toString", function () {
        it("should return a string representation of the set", function () {
            const s = new GumpSet(["a", 1]).toString();
            expect(s).to.be.a("string");
        });
    });

    after(function () {
        delete this.s;
    });
});
