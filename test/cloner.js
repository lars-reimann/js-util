import {expect} from "chai";

import {cloner} from "@ignavia/util";

export default function() {
    
    /** @test {Cloner} */
    describe("Cloner", function () {

        /** @test {Cloner#clone} */
        describe("#clone", function() {
            it("should clone undefined", function () {
                let v = undefined,
                    r = cloner.clone(v);
                expect(r).to.equal(v);
            });

            it("should clone null", function () {
                let v = null,
                    r = cloner.clone(v);
                expect(r).to.equal(v);
            });

            it("should clone booleans", function () {
                let v = true,
                    r = cloner.clone(v);
                expect(r).to.equal(v);
            });

            it("should clone numbers", function () {
                let v = 42,
                    r = cloner.clone(v);
                expect(r).to.equal(v);
            });

            it("should clone strings", function () {
                let v = "Hi",
                    r = cloner.clone(v);
                expect(r).to.equal(v);
            });
             
            it("should clone symbols", function () {
                let v = Symbol(),
                    r = cloner.clone(v);
                expect(r).to.equal(v);
            });

            it("should clone Date objects", function () {
                let v = new Date(),
                    r = cloner.clone(v);
                expect(v.getTime()).to.equal(r.getTime());
                expect(v).to.not.equal(r);
            });

            it("should clone RegExp objects", function () {
                let v = new RegExp(/[a-zA-Z0-9]/),
                    r = cloner.clone(v);
                expect(v.toString()).to.equal(r.toString());
                expect(v).to.not.equal(r);
            });
        });
    });
}
