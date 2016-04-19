import chai, {expect} from "chai";
import chaiString     from "chai-string";
chai.use(chaiString);

import {IDGenerator} from "../src/util.js";

describe("IDGenerator", function () {

    describe("#next", function() {
        const g = new IDGenerator("p");

        it("should prefix IDs", function () {
            const id = g.next();
            expect(id).to.startWith("p");
        });

        it("should return unique IDs", function () {
            const id0 = g.next(),
                  id1 = g.next();

            expect(id0).to.not.equal(id1);
        });
    });

    describe("#increaseToAtLeast", function() {
        const g = new IDGenerator("p");

        it("should set to the maximum of the current value and the given one", function () {
            g.increaseToAtLeast(10);
            const id0 = g.next();
            expect(id0).to.equal("p10");

            g.increaseToAtLeast(5);
            const id1 = g.next();
            expect(id1).to.equal("p11");
        });
    });
});
