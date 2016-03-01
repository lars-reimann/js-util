/**
 * Represents paths for nested map/set structures.
 */
export default class GumpPath {

    /**
     * Creates a GumpPath from a string.
     *
     * @param {String} s
     * The string describing the path. If s is empty the resulting path is not
     * going to be empty. It has length 1 and contains the empty string as key.
     *
     * @param {String} [separator="."]
     * The string used to split s into keys.
     */
    static fromString(s, separator = ".") {
        const keys = s.split(separator);
        return new GumpPath(keys);
    }

    /**
     * @param {Iterable} keys
     * Yields the keys the path is made of.
     */
    constructor(keys) {

        /**
         * The keys of this path.
         *
         * @type {Array<*>}
         * @private
         */
        this.keys = [...keys];
    }

    /**
     * The number of keys of this path.
     *
     * @type {Number}
     */
    get length() {
        return this.keys.length;
    }

    /**
     * Returns the first key of this path.
     *
     * @return {*}
     * The first key of this path.
     */
    head() {
        return this.keys[0];
    }


    /**
     * Returns the remaining path, i. e. everything but the first key.
     *
     * @return {GumpPath}
     * The remaining path.
     */
    tail() {
        return new GumpPath(this.keys.slice(1));
    }

    /**
     * Returns the key at the given position.
     *
     * @param {Number} index
     * The index of the key.
     *
     * @return {*}
     * The key at the given position.
     */
    keyAt(index) {
        return this.keys[index];
    }

    /**
     * Tests if this path has length 0.
     *
     * @return {Boolean}
     * If this path has length 0.
     */
    isEmpty() {
        return this.keys.length === 0;
    }

    /**
     * Returns a string representing this path.
     *
     * @return {String}
     * A string representation of this path.
     */
    toString() {
        return this.keys.join(".");
    }
}