/* global describe */
/* global it */
import {expect} from "chai";

import {extensibleSymbols, extensibleMixin} from "@ignavia/util";
const addMethod    = extensibleSymbols.addMethod,
      removeMethod = extensibleSymbols.removeMethod,
      addPlugin    = extensibleSymbols.addPlugin,
      removePlugin = extensibleSymbols.removePlugin;

export default function() {

    /** @test {extensibleMixin} */
    describe("extensibleMixin", function () {
        it("should offer an addMethod method as a mixin", function () {
            const o = Object.assign({}, extensibleMixin);
            o[addMethod]("toString", () => "Hi");
            expect(o.toString()).to.equal("Hi");
        });

        it("should offer a removeMethod method as a mixin", function () {
            const o = Object.assign({}, extensibleMixin);
            o[addMethod]("toString", () => "Hi");
            o[removeMethod]("toString");
            expect(o.hasOwnProperty("toString")).to.equal(false);
        });

        it("should offer an addPlugin method as a mixin", function () {
            const plugin = {
                register:   (o) => o[addMethod]("toString", () => "Hi"),
                unregister: (o) => o[removeMethod]("toString")
            };
            const o = Object.assign({}, extensibleMixin);
            o[addPlugin](plugin);
            expect(o.toString()).to.equal("Hi");
        });

        it("should offer a removePlugin method as a mixin", function () {
            const plugin = {
                register:   (o) => o[addMethod]("toString", () => "Hi"),
                unregister: (o) => o[removeMethod]("toString")
            };
            const o = Object.assign({}, extensibleMixin);
            o[addPlugin](plugin);
            o[removePlugin](plugin);
            expect(o.hasOwnProperty("toString")).to.equal(false);
        });
    });
}
