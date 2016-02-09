/* global describe */
/* global it */
import {expect} from "chai";

import {Color, predefinedColors} from "../src/util.js";

export default function() {

    /** @test {Color} */
    describe("Color", function () {

        /** @test {Color#fromRGBA} */
        describe("#fromRGBA", function () {
            it("should create a Color object for an RGBA color", function () {
                const r0 = Color.fromRGBA(0, 0, 0, 1); // black
                expect(r0.hex).to.equal(0);
                expect(r0.alpha).to.equal(1);

                const r1 = Color.fromRGBA(255, 0, 0, 1); // red
                expect(r1.hex).to.equal(255 << 16);
                expect(r1.alpha).to.equal(1);

                const r2 = Color.fromRGBA(0, 255, 0, 1); // green
                expect(r2.hex).to.equal(255 << 8);
                expect(r2.alpha).to.equal(1);

                const r3 = Color.fromRGBA(0, 0, 255, 1); // blue
                expect(r3.hex).to.equal(255);
                expect(r3.alpha).to.equal(1);

                const r4 = Color.fromRGBA(0, 0, 0, 0); // transparent
                expect(r4.hex).to.equal(0);
                expect(r4.alpha).to.equal(0);
            });
        });

        /** @test {Color#fromHSLA} */
        describe("#fromHSLA", function () {
            it("should create a Color object for an HSLA color", function () {
                const r0 = Color.fromHSLA(0, 0, 0, 1); // black
                expect(r0.hex).to.equal(0);
                expect(r0.alpha).to.equal(1);

                const r1 = Color.fromHSLA(0, 1, 0.5, 1); // red
                expect(r1.hex).to.equal(255 << 16);
                expect(r1.alpha).to.equal(1);

                const r2 = Color.fromHSLA(120, 1, 0.5, 1); // green
                expect(r2.hex).to.equal(255 << 8);
                expect(r2.alpha).to.equal(1);

                const r3 = Color.fromHSLA(240, 1, 0.5, 1); // blue
                expect(r3.hex).to.equal(255);
                expect(r3.alpha).to.equal(1);

                const r4 = Color.fromHSLA(0, 0, 0, 0); // transparent
                expect(r4.hex).to.equal(0);
                expect(r4.alpha).to.equal(0);
            });
        });

        /** @test {Color#toRGBA} */
        describe("#toRGBA", function () {
            it("should create an RGBA color from a Color object", function () {

                const r0 = predefinedColors.black.toRGBA(); // black
                expect(r0.r).to.equal(0);
                expect(r0.g).to.equal(0);
                expect(r0.b).to.equal(0);
                expect(r0.a).to.equal(1);

                const r1 = predefinedColors.red.toRGBA(); // red
                expect(r1.r).to.equal(255);
                expect(r1.g).to.equal(0);
                expect(r1.b).to.equal(0);
                expect(r1.a).to.equal(1);

                const r2 = predefinedColors.lime.toRGBA(); // green [sic!]
                expect(r2.r).to.equal(0);
                expect(r2.g).to.equal(255);
                expect(r2.b).to.equal(0);
                expect(r2.a).to.equal(1);

                const r3 = predefinedColors.blue.toRGBA(); // blue
                expect(r3.r).to.equal(0);
                expect(r3.g).to.equal(0);
                expect(r3.b).to.equal(255);
                expect(r3.a).to.equal(1);

                const r4 = predefinedColors.transparent.toRGBA(); // transparent
                expect(r4.r).to.equal(0);
                expect(r4.g).to.equal(0);
                expect(r4.b).to.equal(0);
                expect(r4.a).to.equal(0);
            });
        });

        /** @test {Color#toHSLA} */
        describe("#toHSLA", function () {
            it("should create an HSLA color from a Color object", function () {

                const r0 = predefinedColors.black.toHSLA(); // black
                expect(r0.h).to.equal(0);
                expect(r0.s).to.equal(0);
                expect(r0.l).to.equal(0);
                expect(r0.a).to.equal(1);

                const r1 = predefinedColors.red.toHSLA(); // red
                expect(r1.h).to.equal(0);
                expect(r1.s).to.equal(1);
                expect(r1.l).to.equal(0.5);
                expect(r1.a).to.equal(1);

                const r2 = predefinedColors.lime.toHSLA(); // green [sic!]
                expect(r2.h).to.equal(120);
                expect(r2.s).to.equal(1);
                expect(r2.l).to.equal(0.5);
                expect(r2.a).to.equal(1);

                const r3 = predefinedColors.blue.toHSLA(); // blue
                expect(r3.h).to.equal(240);
                expect(r3.s).to.equal(1);
                expect(r3.l).to.equal(0.5);
                expect(r3.a).to.equal(1);

                const r4 = predefinedColors.transparent.toHSLA(); // transparent
                expect(r4.h).to.equal(0);
                expect(r4.s).to.equal(0);
                expect(r4.l).to.equal(0);
                expect(r4.a).to.equal(0);
            });
        });

        /** @test {Color#toString} */
        describe("#toString", function () {
            it("should print a hex string for a Color object", function () {
                const r0 = predefinedColors.black.toString(); // black
                expect(r0).to.equal("#000000");

                const r1 = predefinedColors.red.toString(); // red
                expect(["#ff0000", "#FF0000"]).to.include(r1);

                const r2 = predefinedColors.lime.toString(); // green [sic!]
                expect(["#00ff00", "#00FF00"]).to.include(r2);

                const r3 = predefinedColors.blue.toString(); // blue
                expect(["#0000ff", "#0000FF"]).to.include(r3);

                const r4 = predefinedColors.transparent.toString(); // transparent
                expect(r4).to.equal("#000000");
            });
        });
    });
}
