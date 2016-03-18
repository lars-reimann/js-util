import TortillaWrapper from "./TortillaWrapper.js";

/**
 * A wrapper for iterables.
 */
export default class TortillaIterable extends TortillaWrapper {

    /**
     * @param {Iterable} iterable
     * The iterable to wrap.
     */
    constructor(iterable) {
        super();

        /**
         * The wrapped iterable.
         *
         * @type {Iterable}
         * @private
         */
        this.iterable = iterable;
    }

    /**
     * Turns this wrapper into an iterator. For this to work, the wrapped
     * function must not expect any more parameters.
     */
    [Symbol.iterator]() {
        return this[Symbol.iterator]();
    }
}