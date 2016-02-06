import {expect} from "chai";

import {cloneSym, cloneableMixin} from "@ignavia/util";

export default function() {

    /** @test {cloneableMixin} */
    describe("cloneableMixin", function () {
        it("should offer Cloneable behavior as a mixin", function () {
            const o = Object.assign({s: "Hi"}, cloneableMixin),
                  r = o[cloneSym]();
            expect(r.s).to.equal("Hi");
            expect(r).to.not.equal(o);
        });
    });
}
