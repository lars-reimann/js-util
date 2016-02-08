import {expect} from "chai";

import {cloneableSymbols, cloneableMixin} from "@ignavia/util";
const clone = cloneableSymbols.clone;

export default function() {

    /** @test {cloneableMixin} */
    describe("cloneableMixin", function () {
        it("should offer a clone method as a mixin", function () {
            const o = Object.assign({s: "Hi"}, cloneableMixin),
                  r = o[clone]();
            expect(r.s).to.equal("Hi");
            expect(r).to.not.equal(o);
        });
    });
}
