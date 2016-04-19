/**
 * A class to generate IDs.
 */
export default class IDGenerator {

    /**
     * @param {String} [prefix=""]
     * The prefix IDs should use.
     */
    constructor(prefix = "") {

        /**
         * The prefix IDs should use.
         *
         * @type {String}
         */
        this.prefix = prefix;

        /**
         * An automatically incremented counter used to generate IDs.
         *
         * @type {Number}
         * @private
         */
        this.counter = 0;
    }

    /**
     * Returns an ID.
     *
     * @return {String}
     * An ID.
     */
    next() {
        return this.prefix + (this.counter++);
    }

    /**
     * Sets the counter to the given value.
     *
     * @param {Number} n
     * The new value of the counter.
     */
    setCounter(n) {
        this.counter = n;
    }
}
