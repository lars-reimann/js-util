import "babel-regenerator-runtime"; // babel bug

import TortillaWrapper from "./TortillaWrapper.js";

export default class TortillaIterator extends TortillaWrapper {
    constructor(iterator) {
        super();

        this.before = [];
        this.iterator = iterator;
    }

    * [Symbol.iterator]() {
        yield* this.before();
        for (let value of this.iterator) {
            this.before.push(value);
            yield value;
        }
    }
}