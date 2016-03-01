import {expect} from "chai";

import {cloneableExtendedMixin} from "../src/util.js";

describe("cloneableMixin", function () {
    it("should offer a clone method as a mixin", function () {
        const o = Object.assign({s: "Hi"}, cloneableExtendedMixin),
              r = o.clone();
        expect(r.s).to.equal("Hi");
        expect(r).to.not.equal(o);
    });
});

