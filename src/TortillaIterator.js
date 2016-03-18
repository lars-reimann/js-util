import "babel-regenerator-runtime"; // babel bug

import TortillaWrapper from "./TortillaWrapper.js";

/**
 * A wrapper for iterators.
 */
export default class TortillaIterator extends TortillaWrapper {

    /**
     * @param {Iterator} iterator
     * The iterator to wrap.
     */
    constructor(iterator) {
        super();

        /**
         * Collects the values yielded by the iterator.
         *
         * @type {Array}
         * @private
         */
        this.before = [];

        /**
         * The wrapped iterator.
         *
         * @type {Iterator}
         * @private
         */
        this.iterator = iterator;
    }

    /**
     * Turns this wrapper into an iterator.
     */
    * [Symbol.iterator]() {
        yield* this.before;
        for (let value of this.iterator) {
            this.before.push(value);
            yield value;
        }
    }
}