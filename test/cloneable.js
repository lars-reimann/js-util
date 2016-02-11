/* global describe */
/* global it */
import {expect} from "chai";

import {cloneableSymbols, cloneableMixin} from "../src/util.js";
const clone = cloneableSymbols.clone;

/** @test {cloneableMixin} */
describe("cloneableMixin", function () {
    it("should offer a clone method as a mixin", function () {
        const o = Object.assign({s: "Hi"}, cloneableMixin),
              r = o[clone]();
        expect(r.s).to.equal("Hi");
        expect(r).to.not.equal(o);
    });
});

