/* global describe */
/* global it */
import {expect} from "chai";

import {cloneableExtendedMixin} from "../src/util.js";

/** @test {cloneableMixin} */
describe("cloneableMixin", function () {
    it("should offer a clone method as a mixin", function () {
        const o = Object.assign({s: "Hi"}, cloneableExtendedMixin),
              r = o.clone();
        expect(r.s).to.equal("Hi");
        expect(r).to.not.equal(o);
    });
});

