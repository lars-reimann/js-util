import chai, {expect} from "chai";
import chaiSinon      from "sinon-chai";
chai.use(chaiSinon);

import sinon from "sinon";

import {GumpMap} from "../src/util.js";

describe("GumpSet", function () {
    beforeEach(function () {
        this.m = new GumpMap([
            ["this", 3],
            ["this", 3],
            ["this", 4],
            ["is.a", "test"]
        ]);
    });

    describe("#set", function () {
        it("should add a given value on the same level without overriding previous values (addToExisting = true)", function () {
            this.m.set("this", 5, true);
            const s = this.m.get("this");
            expect(s.has(3)).to.be.true;
            expect(s.has(4)).to.be.true;
            expect(s.has(5)).to.be.true;
            expect(s.size).to.equal(3);
        });

        it("should add a given value on the same level while overriding previous values (addToExisting = false)", function () {
            this.m.set("this", 5, false);
            expect(this.m.get("this")).to.equal(5);
        });

        it("should add a given value on deeper levels without overriding previous values (addToExisting = true)", function () {
            this.m.set("is.a", "trick", true);
            expect(this.m.get("is")).to.be.an.instanceof(GumpMap);
            const s = this.m.get("is.a");
            expect(s.has("test")).to.be.true;
            expect(s.has("trick")).to.be.true;
            expect(s.size).to.equal(2);
        });

        it("should add a given value on deeper levels while overriding previous values (addToExisting = false)", function () {
            this.m.set("is.a", "trick", false);
            expect(this.m.get("is")).to.be.an.instanceof(GumpMap);
            expect(this.m.get("is.a")).to.equal("trick");
        });

        it("should fire an event", function () {
            for (let key of this.m.keys()) {
                console.log("" + key);
            }
            for (let value of this.m.values()) {
                console.log("" + value);
            }
            for (let [key, value] of this.m.entries()) {
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

    // describe("#clear", function () {
    //     it("should remove all values from the set", function () {
    //         this.s.clear();
    //         expect(this.s.size).to.equal(0);
    //     });

    //     it("should fire an event", function () {
    //         const spy = sinon.spy();
    //         this.s.addListener(spy, "clear");
    //         this.s.clear();

    //         expect(spy).to.have.been.calledOnce;
    //         const e = spy.args[0][0];
    //         expect(e.source).to.equal(this.s);
    //         expect(e.type).to.equal("clear");
    //         expect(e.data).to.have.members([1, 2]);
    //     });
    // });

    // describe("#delete", function () {
    //     it("should delete a given value from the set", function () {
    //         this.s.delete(1);
    //         expect(this.s.has(2)).to.be.true;
    //         expect(this.s.size).to.equal(1);
    //     });

    //     it("should leave the set unchanged if the value does not exist", function () {
    //         this.s.delete(3);
    //         expect(this.s.size).to.equal(2);
    //     });

    //     it("should fire an event", function () {
    //         const spy = sinon.spy();
    //         this.s.addListener(spy, "delete");
    //         this.s.delete(2);

    //         expect(spy).to.have.been.calledOnce;
    //         const e = spy.args[0][0];
    //         expect(e.source).to.equal(this.s);
    //         expect(e.type).to.equal("delete");
    //         expect(e.data).to.equal(2);
    //     });
    // });

    // describe("#updateWithLiteral", function () {
    //     it("should replace a value with another value", function () {
    //         this.s.updateWithLiteral(2, 3);
    //         expect(this.s.has(2)).to.be.false;
    //         expect(this.s.has(3)).to.be.true;
    //         expect(this.s.size).to.equal(2);
    //     });

    //     it("should leave the set unchanged if the value does not exist", function () {
    //         this.s.updateWithLiteral(3, 4);
    //         expect(this.s.has(1)).to.be.true;
    //         expect(this.s.has(2)).to.be.true;
    //         expect(this.s.size).to.equal(2);
    //     });
    // });

    // describe("#updateWithFunction", function () {
    //     it("should replace a value with the result of calling a function on this value", function () {
    //         this.s.updateWithFunction(x => x + 1, 2);
    //         expect(this.s.has(2)).to.be.false;
    //         expect(this.s.has(3)).to.be.true;
    //         expect(this.s.size).to.equal(2);
    //     });

    //     it("should leave the set unchanged if the value does not exist", function () {
    //         this.s.updateWithFunction(x => x + 1, 3);
    //         expect(this.s.has(1)).to.be.true;
    //         expect(this.s.has(2)).to.be.true;
    //         expect(this.s.size).to.equal(2);
    //     });


    // });

    // describe("#toString", function () {
    //     it("should return a string representation of the set", function () {
    //         const s = new GumpSet(["a", 1]).toString();
    //         expect(s).to.be.a("string");
    //     });
    // });

    after(function () {
        delete this.m;
    });
});
