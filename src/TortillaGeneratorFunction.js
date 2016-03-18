import _ from "lodash/fp";

import TortillaWrapper from "./TortillaWrapper.js";

/**
 * A wrapper for generator functions.
 */
export default class TortillaGeneratorFunction extends TortillaWrapper {

    /**
     * @param {GeneratorFunction} f
     * The function to wrap.
     */
    constructor(f) {
        super();

        /**
         * The wrapped function.
         *
         * @type {GeneratorFunction}
         * @private
         */
        this.f = f;
    }

    /**
     * Partially applies the given parameters to the wrapped generator function.
     *
     * @param {...*} outer
     * The parameters to apply.
     *
     * @return {TortillaGeneratorFunction}
     * The new wrapper.
     */
    apply(...outer) {
        const that = this;
        return new TortillaGeneratorFunction(function* (...inner) {
            const params = outer.concat(inner);
            yield* that.f(...params);
        });
    }

    /**
     * Turns this wrapper into an iterator. For this to work, the wrapped
     * function must not expect any more parameters.
     */
    [Symbol.iterator]() {
        return this.f();
    }
}