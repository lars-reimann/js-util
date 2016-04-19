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

    describe("#setCounter", function() {
        const g = new IDGenerator("p");

        it("should set the counter to the given value", function () {
            g.setCounter(10);
            const id = g.next();
            expect(id).to.equal("p10");
        });
    });
});
