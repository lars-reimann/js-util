/**
 * A class to generate IDs.
 */
export default class IDGenerator {

    /**
     * @param {string} [prefix=""]
     * The prefix IDs should use.
     */
    constructor(prefix = "") {

        /**
         * The prefix IDs should use.
         *
         * @type {string}
         */
        this.prefix = prefix;

        /**
         * An automatically incremented counter used to generate IDs.
         *
         * @type {number}
         * @private
         */
        this.counter = 0;
    }

    /**
     * Returns an ID.
     *
     * @return {string}
     * An ID.
     */
    next() {
        return this.prefix + (this.counter++);
    }

    /**
     * Ensures that the given ID is not going to be generated.
     *
     * @param {string} id
     * The ID to avoid.
     */
    avoid(id) {
        const regex = new RegExp(`^${this.prefix}([0-9]+)$`);
        if (id && regex.test(id)) {
            const [, counter] = regex.exec(id);
            this.counter = Math.max(this.counter, counter + 1);
        }
    }

    /**
     * Sets the counter to the maximum of the given value and its current value.
     * This method is going to be removed in favor of the avoid method.
     *
     * @param {number} n
     * The new minimal value of the counter.
     *
     * @deprecated
     */
    increaseToAtLeast(n) {
        this.counter = Math.max(this.counter, n);
    }
}
