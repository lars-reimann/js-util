/* global describe */
/* global it */
import chai, {expect} from "chai";
import chaiSinon      from "sinon-chai";
chai.use(chaiSinon);

import sinon from "sinon";

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
            const o   = Object.assign({}, extensibleMixin),
                  spy = sinon.spy();
            
            o[addPlugin]({register: spy});
            expect(spy).to.have.been.calledOnce;
            expect(spy).to.have.been.calledWith(o);
        });

        it("should offer a removePlugin method as a mixin", function () {
            const o      = Object.assign({}, extensibleMixin),
                  spy    = sinon.spy(),
                  plugin = {register: () => true, unregister: spy};
            
            o[addPlugin](plugin);
            o[removePlugin](plugin);
            expect(spy).to.have.been.calledOnce;
            expect(spy).to.have.been.calledWith(o);
        });
    });
}
