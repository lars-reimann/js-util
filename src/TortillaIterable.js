import _ from "lodash/fp";

import TortillaWrapper from "./TortillaWrapper.js";

/**
 * A wrapper for iterables.
 */
export default class TortillaIterable {

    /**
     * @param {Iterable} iterable
     * The iterable to wrap.
     */
    constructor(iterable) {
       // super();

        /**
         * The wrapped iterable.
         *
         * @type {Iterable}
         * @private
         */
        this.iterable = iterable;
    }

    /**
     * Returns the first value.
     *
     * @return {*}
     * The first value.
     */
    head() {
        const [value] = this.iterable;
        return value;
    }

    /**
     * Drops the first value.
     *
     * @return {TortillaGeneratorFunction}
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
     * @return {TortillaGeneratorFunction}
     * The new wrapper.
     */
    chunk(n) {
        const that = this;
        return new TortillaGeneratorFunction(function* () {
            const iterator = that.iterable[Symbol.iterator]();
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
     * @return {TortillaGeneratorFunction}
     * The new wrapper.
     */
    without(values) {
        return this.reject(x => values.includes(x));
    }

    /**
     * Removes all falsy values.
     *
     * @return {TortillaGeneratorFunction}
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
     * @return {TortillaGeneratorFunction}
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
     * @return {TortillaGeneratorFunction}
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
     * @return {TortillaGeneratorFunction}
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
     * @return {TortillaGeneratorFunction}
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
     * @return {TortillaGeneratorFunction}
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
     * @return {TortillaGeneratorFunction}
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
     * @return {TortillaGeneratorFunction}
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
     * @return {TortillaGeneratorFunction}
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
     * @return {TortillaGeneratorFunction}
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
     * Turns this wrapper into an iterator. For this to work, the wrapped
     * function must not expect any more parameters.
     */
    [Symbol.iterator]() {
        return this[Symbol.iterator]();
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