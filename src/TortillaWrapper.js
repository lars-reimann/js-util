import _ from "lodash/fp";

import TortillaGeneratorFunction from "./TortillaGeneratorFunction.js";

/**
 * A wrapper for iterables, iterators and generator functions.
 */
export default class TortillaWrapper {

    /**
     *
     */
    constructor() {}

    /**
     * Returns the first value.
     *
     * @return {*}
     * The first value.
     */
    head() {
        const [value] = this[Symbol.iterator]();
        return value;
    }

    /**
     * Drops the first value.
     *
     * @return {TortillaWrapper}
     * The new wrapper.
     */
    tail() {
        return this.drop(1);
    }

    /**
     * Bundles n values at a time in an array.
     *
     * @param {Number} n
     * How many values to wrap.
     *
     * @return {TortillaWrapper}
     * The new wrapper.
     */
    chunk(n) {
        const that = this;
        return new TortillaGeneratorFunction(function* () {
            const iterator = that[Symbol.iterator]();
            while (true) {
                const chunk = [];
                for (let i = 0; i < n; i++) {
                    const {value, done} = iterator.next();
                    if (done) break;
                    chunk.push(value);
                }
                if (chunk.length === 0) return;
                yield chunk;
            }
        });
    }

    /**
     * Removes all values matching the given values.
     *
     * @param {*} values
     * The values to remove.
     *
     * @return {TortillaWrapper}
     * The new wrapper.
     */
    without(values) {
        return this.reject(x => values.includes(x));
    }

    /**
     * Removes all falsy values.
     *
     * @return {TortillaWrapper}
     * The new wrapper.
     */
    compact() {
        return this.filter(x => x);
    }

    /**
     * Keeps only the values in the given range.
     *
     * @param {Number} start
     * The index of the first value to keep.
     *
     * @param {Number} end
     * The index of the first value to drop again.
     *
     * @return {TortillaWrapper}
     * The new wrapper.
     */
    slice(start, end) {
        return this.drop(start).take(end - start);
    }

    /**
     * Drops the first n values.
     *
     * @param {Number} n
     * How many values to drop.
     *
     * @return {TortillaWrapper}
     * The new wrapper.
     */
    drop(n) {
        const that = this;
        return new TortillaGeneratorFunction(function* () {
            const iterator = that[Symbol.iterator]();
            for (let i = 0; i < n; i++) {
                const {done} = iterator.next();
                if (done) return;
            }
            yield* iterator;
        });
    }

    /**
     * Drops the values until the predicate is false.
     *
     * @param {Function} predicate
     * The testing function.
     *
     * @return {TortillaWrapper}
     * The new wrapper.
     */
    dropWhile(predicate) {
        const that = this;
        return new TortillaGeneratorFunction(function* () {
            const iterator = that[Symbol.iterator]();
            let value, done;
            do {
                ({value, done} = iterator.next());
                if (done) return;
            } while (predicate(value));
            yield value;
            yield* iterator;
        });
    }

    /**
     * Keeps only the first n values.
     *
     * @param {Number} n
     * How many values to keep.
     *
     * @return {TortillaWrapper}
     * The new wrapper.
     */
    take(n) {
        const that = this;
        return new TortillaGeneratorFunction(function* () {
            const iterator = that[Symbol.iterator]();
            for (let i = 0; i < n; i++) {
                const {value, done} = iterator.next();
                if (done) return;
                yield value;
            }
        });
    }

    /**
     * Keeps the values until the predicate is false.
     *
     * @param {Function} predicate
     * The testing function.
     *
     * @return {TortillaWrapper}
     * The new wrapper.
     */
    takeWhile(predicate) {
        const that = this;
        return new TortillaGeneratorFunction(function* () {
            const iterator = that[Symbol.iterator]();
            while (true) {
                const {value, done} = iterator.next();
                if (done || !predicate(value)) return;
                yield value;
            }
        });
    }

    /**
     * Keeps only value for which the predicate is true.
     *
     * @param {Function} predicate
     * The testing function.
     *
     * @return {TortillaWrapper}
     * The new wrapper.
     */
    filter(predicate) {
        const that = this;
        return new TortillaGeneratorFunction(function* () {
            for (let value of that) {
                if (predicate(value)) {
                    yield value;
                }
            }
        });
    }

    /**
     * Drops all values for which the predicate is true.
     *
     * @param {Function} predicate
     * The testing function.
     *
     * @return {TortillaWrapper}
     * The new wrapper.
     */
    reject(predicate) {
        return this.filter(_.negate(predicate));
    }

    /**
     * Applies the given function to a value before yielding it.
     *
     * @param {Function} iteratee
     * The mapping function.
     *
     * @return {TortillaWrapper}
     * The new wrapper.
     */
    map(iteratee) {
        const that = this;
        return new TortillaGeneratorFunction(function* () {
            for (let value of that) {
                yield iteratee(value);
            }
        });
    }

    /**
     * Yields values of an array separately.
     *
     * @return {TortillaWrapper}
     * The new wrapper.
     */
    flatten() {
        const that = this;
        return new TortillaGeneratorFunction(function* () {
            for (let value of that) {
                yield* _.castArray(value);
            }
        });
    }

    /**
     * Turns this wrapper into an iterator.
     *
     * @abstract
     */
    [Symbol.iterator]() {
        throw new Error("Calling an abstract function.");
    }

    /*
    TODO

    concat
    zip
    unzip
    zipWith
    unzipWith
    */
}
