/* global describe */
/* global it */
import chai, {expect} from "chai";
import chaiString     from "chai-string";
chai.use(chaiString);

import {IDGenerator} from "../src/util.js";

/** @test {IDGenerator} */
describe("IDGenerator", function () {

    /** @test {IDGenerator#next} */
    describe("#next", function() {
        const g = new IDGenerator("p");

        it("should prefix IDs", function () {
            const id0 = g.next();
            expect(id0).to.startWith("p");
        });

        it("should return unique IDs", function () {
            const id0 = g.next(),
                  id1 = g.next();

            expect(id0).to.not.equal(id1);
        });
    });
});
