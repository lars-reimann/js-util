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

            it("should clone functions", function () {
                let v = (n) => n < 42,
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

            it("should clone acyclic arrays", function () {
                let v = [42, [42], {n: 42}],
                    r = cloner.clone(v);
                expect(v[0]).to.equal(r[0]);
                expect(v[1][0]).to.equal(r[1][0]);
                expect(v[1].length).to.equal(r[1].length);
                expect(v[1]).to.not.equal(r[1]);
                expect(v[2].n).to.equal(r[2].n);
                expect(v[2]).to.not.equal(r[2]);
                expect(v.length).to.equal(r.length);
                expect(v).to.not.equal(r);
            });

            it("should clone cyclic arrays", function () {
                let v = [42]; v[1] = v;
                let r = cloner.clone(v);
                expect(v[0]).to.equal(r[0]);
                expect(v.length).to.equal(r.length);
                expect(r[1]).to.equal(r);
            });

            it("should clone acyclic objects", function () {
                let v = {n: 42, a: [42], o: {n: 42}},
                    r = cloner.clone(v);
                expect(v.n).to.equal(r.n);
                expect(v.a[0]).to.equal(r.a[0]);
                expect(v.a.length).to.equal(r.a.length);
                expect(v.a).to.not.equal(r.a);
                expect(v.o.n).to.equal(r.o.n);
                expect(v.o).to.not.equal(r.o);
                expect(v).to.not.equal(r);
            });

            it("should clone cyclic objects", function () {
                let v = {n: 42}; v.o = v;
                let r = cloner.clone(v);console.log(v,r);
                expect(v.n).to.equal(r.n);
                expect(r.o).to.equal(r);
            });
        });
    });
}
