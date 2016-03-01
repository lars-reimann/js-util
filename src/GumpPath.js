/**
 * Represents paths for nested map/set structures.
 */
export default class GumpPath {

    /**
     * Normalizes the given path. If it is already an instance of GumpPath, it
     * is returned unchanged. If it is a string, it is converted to a GumpPath.
     *
     * @param {String|GumpPath} path
     * A representation of the path.
     *
     * @return {GumpPath}
     * The normalized path.
     */
    static toGumpPath(path) {
        if (typeof path === "string") {
            return GumpPath.fromString(path);
        } else if (path instanceof GumpPath) {
            return path;
        }
    }

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
     * Returns path with every key of this path but the first.
     *
     * @return {GumpPath}
     * The created path.
     */
    tail() {
        return new GumpPath(this.keys.slice(1));
    }

    /**
     * Returns the last key of this path.
     *
     * @return {*}
     * The last key of this path.
     */
    last() {
        return this.keys[this.keys.length - 1];
    }

    /**
     * Returns path with every key of this path but the last.
     *
     * @return {GumpPath}
     * The remaining path.
     */
    init() {
        return new GumpPath(this.keys.slice(0, -1));
    }

    /**
     * Returns a new path with the given key added to the end of this path.
     *
     * @param {*} key
     * The key to add.
     *
     * @return {GumpPath}
     * The created path.
     */
    append(key) {
        return new GumpPath([...this.keys, key]);
    }

    /**
     * Returns a new path with the given key added to the beginning of this
     * path.
     *
     * @param {*} key
     * The key to add.
     *
     * @return {GumpPath}
     * The created path.
     */
    prepend(key) {
        return new GumpPath([key, ...this.keys]);
    }

    /**
     * Returns a new path with the given key at the specified position. The
     * keys of this path are placed around it.
     *
     * @param {*} key
     * The key to add.
     *
     * @param {Number} index
     * The position of the new key.
     *
     * @return {GumpPath}
     * The created path.
     */
    insertAt(key, index) {
        return new GumpPath([
            ...this.keys.slice(0, index),
            key,
            ...this.keys.slice(index)
        ]);
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