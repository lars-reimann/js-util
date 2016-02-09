/* global describe */
/* global it */
import {expect} from "chai";

import {cloneableSymbols, Cloner} from "../src/util.js";

export default function() {

    /** @test {Cloner} */
    describe("Cloner", function () {
        const cloner = new Cloner();

        /** @test {Cloner#clone} */
        describe("#clone", function() {
            it("should clone undefined", function () {
                const v = undefined,
                      r = cloner.clone(v);
                expect(r).to.equal(v);
            });

            it("should clone null", function () {
                const v = null,
                      r = cloner.clone(v);
                expect(r).to.equal(v);
            });

            it("should clone booleans", function () {
                const v = true,
                      r = cloner.clone(v);
                expect(r).to.equal(v);
            });

            it("should clone numbers", function () {
                const v = 42,
                      r = cloner.clone(v);
                expect(r).to.equal(v);
            });

            it("should clone strings", function () {
                const v = "Hi",
                      r = cloner.clone(v);
                expect(r).to.equal(v);
            });

            it("should clone symbols", function () {
                const v = Symbol(),
                      r = cloner.clone(v);
                expect(r).to.equal(v);
            });

            it("should clone functions", function () {
                const v = (n) => n < 42,
                      r = cloner.clone(v);
                expect(r).to.equal(v);
            });

            it("should clone Date objects", function () {
                const v = new Date(),
                      r = cloner.clone(v);
                expect(v.getTime()).to.equal(r.getTime());
                expect(v).to.not.equal(r);
            });

            it("should clone RegExp objects", function () {
                const v = new RegExp("[a-zA-Z0-9]"),
                      r = cloner.clone(v);
                expect(v.toString()).to.equal(r.toString());
                expect(v).to.not.equal(r);
            });

            it("should clone acyclic arrays", function () {
                const v = [42, [42], {n: 42}],
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
                const v = [42]; v[1] = v;
                const r = cloner.clone(v);
                expect(v[0]).to.equal(r[0]);
                expect(v.length).to.equal(r.length);
                expect(r[1]).to.equal(r);
            });

            it("should clone acyclic objects", function () {
                const v = {n: 42, a: [42], o: {n: 42}},
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
                const v = {n: 42}; v.o = v;
                const r = cloner.clone(v);
                expect(v.n).to.equal(r.n);
                expect(r.o).to.equal(r);
            });

            it("should clone Cloneable childs using the [cloneableSymbols.clone] method", function () {
               let v = {o: {
                   [cloneableSymbols.clone]: () => "no-clone"
               }};
               let r = cloner.clone(v);
               expect(r.o).to.equal("no-clone");
               expect(v).to.not.equal(r);
            });

            it("should share equal child objects", function () {
                let o = {}, v = {o1: o, o2: o},
                    r = cloner.clone(v);
                expect(r.o1).to.equal(r.o2);
            });
        });
    });
}
