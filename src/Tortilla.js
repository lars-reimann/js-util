import TortillaGeneratorFunction from "./TortillaGeneratorFunction.js";
import TortillaIterable          from "./TortillaIterable.js";
import TortillaIterator          from "./TortillaIterator.js";
import TortillaWrapper           from "./TortillaWrapper.js";

/**
 * Tests if the given value is wrapped already.
 *
 * @param {*} v
 * The value to test.
 *
 * @return {Boolean}
 * Whether the given value is wrapped already.
 *
 * @ignore
 */
const isWrapped = function (v) {
    return v instanceof TortillaWrapper;
};

/**
 * Tests if the given value is a function returning an iterator.
 *
 * @param {*} v
 * The value to test.
 *
 * @return {Boolean}
 * Whether the given value is a generator function.
 *
 * @ignore
 */
const isGeneratorFunction = function (v) {
    return typeof v === "function" && v()[Symbol.iterator];
};

/**
 * Tests if the given value is an iterable.
 *
 * @param {*} v
 * The value to test.
 *
 * @return {Boolean}
 * Whether the given value is an iterable.
 *
 * @ignore
 */
const isIterable = function (v) {
    return v[Symbol.iterator] && v[Symbol.iterator]() !== v;
};

/**
 * Tests if the given value is an iterator. While those are usually also
 * iterable, they cannot be reset.
 *
 * @param {*} v
 * The value to test.
 *
 * @return {Boolean}
 * Whether the given value is an iterator.
 *
 * @ignore
 */
const isIterator = function (v) {
    return v[Symbol.iterator] && v[Symbol.iterator]() === v;
};

/**
 * Wraps the given value into an appropriate wrapper.
 *
 * @param {*} toWrap
 * The value to wrap.
 *
 * @return {TortillaWrapper}
 * The wrapped value.
 *
 * @throws {Error}
 * If the value cannot be wrapped.
 */
export const tortilla = function (toWrap) {
    if (isWrapped(toWrap)) {
        return toWrap;
    } else if (isGeneratorFunction(toWrap)) {
        return new TortillaGeneratorFunction(toWrap);
    } else if (isIterable(toWrap)) {
        return new TortillaIterable(toWrap);
    } else if (isIterator(toWrap)) {
        return new TortillaIterator(toWrap);
    } else {
        throw new Error(`Cannot wrap ${toWrap}.`);
    }
};

/**
 * Does not yield any values.
 *
 * @type {TortillaWrapper}
 */
tortilla.empty = new TortillaIterable([]);

/**
 * An infinite generator that always yields the same value.
 *
 * @param {*} value
 * The value to yield.
 *
 * @return {TortillaWrapper}
 * The wrapper.
 */
tortilla.constant = function (value) {
    return new TortillaGeneratorFunction(function* () {
        while (true) {
            yield value;
        }
    });
};

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
 * @return {TortillaWrapper}
 * The wrapper.
 */
tortilla.range = function (start = 0, end = Number.POSITIVE_INFINITY, step = 1) {
    return new TortillaGeneratorFunction(function* () {
        for (let i = start; i < end; i += step) {
            yield i;
        }
    });
};

/**
 * Concatenates the given iterables. First the results of the first iterable are
 * yielded, then the ones of the next and so forth.
 *
 * @param {Iterable} iterables
 * An iterable containing the iterables to concatenate.
 *
 * @return {TortillaWrapper}
 * The resulting wrapper.
 */
tortilla.concat = function (iterables) {
    return new TortillaGeneratorFunction(function* () {
        for (let iterable of iterables) {
            yield* iterable;
        }
    });
};

/**
 * Combines the results of the given iterables in an array. At index 0, the
 * results of the first iterable are yielded, at index 1 the ones of the next
 * and so forth.
 *
 * @param {Iterable} iterables
 * An iterable containing the iterables to zip.
 *
 * @return {TortillaWrapper}
 * The resulting wrapper.
 */
tortilla.zip = function (iterables) {
    return tortilla.zipWith((...xs) => xs, iterables);
};

/**
 * Combines the results of the given iterables using the given function. The
 * first argument of the function are the results of the first iterable, the
 * second argument is determined by the second iterable and so forth.
 *
 * @param {Function} iteratee
 * The function to use for zipping.
 *
 * @param {Iterable} iterables
 * An iterable containing the iterables to zip.
 *
 * @return {TortillaWrapper}
 * The resulting wrapper.
 */
tortilla.zipWith = function (iteratee, iterables) {
    const iterators = iterables.map(x => x[Symbol.iterator]());
    return new TortillaGeneratorFunction(function* () {
        while (true) {
            const results = iterators.map(x => x.next());
            if (results.some(x => x.done)) return;
            yield iteratee(...results.map(x => x.value));
        }
    });
};

tortilla.unzip = function (toUnzip) {
    // const wrapped = tortilla(toUnzip);
    // const iterator = toUnzip[Symbol.iterator]();
    // let {value, done} = iterator.next();
    // const length = value.length();
    // if (done) return;
    // const result = [];
    // for (let i = 0; i < length; i++) {
    //     result[i] =
    // }
    // return result;
};

tortilla.unzipWith = function () {
    // TODO
};
