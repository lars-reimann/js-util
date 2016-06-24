import chai, {expect} from "chai";
import chaiString     from "chai-string";
chai.use(chaiString);

import {IDGenerator} from "../src/util.js";

describe("IDGenerator", function () {

    beforeEach(function () {
        this.gen = new IDGenerator("p");
    });

    describe("#next", function() {
        it("should prefix IDs", function () {
            const id = this.gen.next();
            expect(id).to.startWith("p");
        });

        it("should return unique IDs", function () {
            const id0 = this.gen.next(),
                  id1 = this.gen.next();

            expect(id0).to.not.equal(id1);
        });
    });

    describe("#avoid", function() {
        it("should prevent the generator from generating the given ID", function () {
            this.gen.avoid("p0");
            const id = this.gen.next();
            expect(id).to.equal("p1");
        });
    });


    describe("#increaseToAtLeast", function() {
        it("should set to the maximum of the current value and the given one", function () {
            this.gen.increaseToAtLeast(10);
            const id0 = this.gen.next();
            expect(id0).to.equal("p10");

            this.gen.increaseToAtLeast(5);
            const id1 = this.gen.next();
            expect(id1).to.equal("p11");
        });
    });

    after(function () {
        delete this.gen;
    });
});
