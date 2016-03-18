import _ from "lodash";

/**
 * A wrapper for generator functions.
 */
export default class TortillaGeneratorFunction {

    /**
     * Does not yield any values.
     *
     * @type {TortillaGeneratorFunction}
     */
    static empty = new TortillaGeneratorFunction(function* () {});

    /**
     * An infinite generator that always yields the same value.
     *
     * @param {*} value
     * The value to yield.
     *
     * @return {TortillaGeneratorFunction}
     * The wrapper.
     */
    static constant(value) {
        return new TortillaGeneratorFunction(function* () {
            while (true) {
                yield value;
            }
        });
    }

    /**
     * Yields the values start, start + step, start + 2 * step, ... while they
     * are less than end.
     *
     * @param {Number} [start=0]
     * The starting value.
     *
     * @param {Number} [end=Infinity]
     * The final, not included value.
     *
     * @param {Number} [step=1]
     * The size of each step.
     *
     * @return {TortillaGeneratorFunction}
     * The wrapper.
     */
    static range(start = 0, end = Number.POSITIVE_INFINITY, step = 1) {
        return new TortillaGeneratorFunction(function* () {
            for (let i = start; i < end; i += step) {
                yield i;
            }
        });
    }

    /**
     * @param {GeneratorFunction} f
     * The function to wrap.
     */
    constructor(f) {

        /**
         * The wrapped function.
         *
         * @type {GeneratorFunction}
         * @private
         */
        this.f = f;
    }

    /**
     * Returns the first value of the wrapped generator.
     *
     * @param {...*} params
     * The parameters to pass to the generator function.
     *
     * @return {*}
     * The first value of the wrapped generator.
     */
    head(...params) {
        const [value] = this.f(...params);
        return value;
    }

    /**
     * Drops the first value of the wrapped generator.
     *
     * @param {...*} params
     * The parameters to pass to the generator function.
     *
     * @return {TortillaGeneratorFunction}
     * The new wrapper.
     */
    tail(...params) {
        return this.drop(1, ...params);
    }

    /**
     * Bundles n values at a time in an array.
     *
     * @param {Number} n
     * How many values to wrap.
     *
     * @param {...*} params
     * The parameters to pass to the generator function.
     *
     * @return {TortillaGeneratorFunction}
     * The new wrapper.
     */
    chunk(n, ...params) {
        const that = this;
        return new TortillaGeneratorFunction(function* () {
            const iterator = that.f(...params);
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
     * @param {...*} params
     * The parameters to pass to the generator function.
     *
     * @return {TortillaGeneratorFunction}
     * The new wrapper.
     */
    without(values, ...params) {
        return this.reject(x => values.includes(x), ...params);
    }

    /**
     * Removes all falsy values.
     *
     * @param {...*} params
     * The parameters to pass to the generator function.
     *
     * @return {TortillaGeneratorFunction}
     * The new wrapper.
     */
    compact(...params) {
        return this.filter(x => x, ...params);
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
     * @param {...*} params
     * The parameters to pass to the generator function.
     *
     * @return {TortillaGeneratorFunction}
     * The new wrapper.
     */
    slice(start, end, ...params) {
        return this.apply(...params).drop(start).take(end - start);
    }

    /**
     * Drops the first n values.
     *
     * @param {Number} n
     * How many values to drop.
     *
     * @param {...*} params
     * The parameters to pass to the generator function.
     *
     * @return {TortillaGeneratorFunction}
     * The new wrapper.
     */
    drop(n, ...params) {
        const that = this;
        return new TortillaGeneratorFunction(function* () {
            const iterator = that.f(...params);
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
     * @param {...*} params
     * The parameters to pass to the generator function.
     *
     * @return {TortillaGeneratorFunction}
     * The new wrapper.
     */
    dropWhile(predicate, ...params) {
        const that = this;
        return new TortillaGeneratorFunction(function* () {
            const iterator = that.f(...params);
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
     * @param {...*} params
     * The parameters to pass to the generator function.
     *
     * @return {TortillaGeneratorFunction}
     * The new wrapper.
     */
    take(n, ...params) {
        const that = this;
        return new TortillaGeneratorFunction(function* () {
            const iterator = that.f(...params);
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
     * @param {...*} params
     * The parameters to pass to the generator function.
     *
     * @return {TortillaGeneratorFunction}
     * The new wrapper.
     */
    takeWhile(predicate, ...params) {
        const that = this;
        return new TortillaGeneratorFunction(function* () {
            const iterator = that.f(...params);
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
     * @param {...*} params
     * The parameters to pass to the generator function.
     *
     * @return {TortillaGeneratorFunction}
     * The new wrapper.
     */
    filter(predicate, ...params) {
        const that = this;
        return new TortillaGeneratorFunction(function* () {
            for (let value of that.f(...params)) {
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
     * @param {...*} params
     * The parameters to pass to the generator function.
     *
     * @return {TortillaGeneratorFunction}
     * The new wrapper.
     */
    reject(predicate, ...params) {
        return this.filter(_.negate(predicate), ...params);
    }

    /**
     * Applies the given function to a value before yielding it.
     *
     * @param {Function} iteratee
     * The mapping function.
     *
     * @param {...*} params
     * The parameters to pass to the generator function.
     *
     * @return {TortillaGeneratorFunction}
     * The new wrapper.
     */
    map(iteratee, ...params) {
        const that = this;
        return new TortillaGeneratorFunction(function* () {
            for (let value of that.f(...params)) {
                yield iteratee(value);
            }
        });
    }

    /**
     * Yields values of an array separately.
     *
     * @param {...*} params
     * The parameters to pass to the generator function.
     *
     * @return {TortillaGeneratorFunction}
     * The new wrapper.
     */
    flatten(...params) {
        const that = this;
        return new TortillaGeneratorFunction(function* () {
            for (let value of that.f(...params)) {
                yield* _.castArray(value);
            }
        });
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

    /*
    TODO

    concat
    zip
    unzip
    zipWith
    unzipWith
    */
}