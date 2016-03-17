import {expect} from "chai";

import {Iterable} from "../src/util.js";

describe("IDGenerator", function () {

    beforeEach(function () {
        this.up = new Iterable(function* () {
            let n = 1;
            while (true) {
                yield n;
                n++;
            }
        });

        this.down = new Iterable(function* () {
            let n = -1;
            while (true) {
                yield n;
                n--;
            }
        });
    });

    describe("#head", function() {
        it ("should return the first value an iterable yields", function () {
            expect(this.up.head()).to.equal(1);
            expect(this.up.head()).to.equal(1);
        });
    });
});
