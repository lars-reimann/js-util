/* global describe */
/* global it */
import {expect} from "chai";

import {IDGenerator} from "@ignavia/util";

export default function() {

    /** @test {IDGenerator} */
    describe("IDGenerator", function () {

        /** @test {IDGenerator#next} */
        describe("#next", function() {
            const g = new IDGenerator("p");

            it("should prefix IDs", function () {
                const id0 = g.next();

                expect(id0.startsWith("p")).to.equal(true);
            });

            it("should return unique IDs", function () {
                const id0 = g.next(),
                      id1 = g.next();

                expect(id0).to.not.equal(id1);
            });
        });
    });
}
