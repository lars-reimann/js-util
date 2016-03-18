import TortillaGeneratorFunction from "./TortillaGeneratorFunction.js";
import TortillaIterable          from "./TortillaIterable.js";
import TortillaIterator          from "./TortillaIterator.js";
import TortillaWrapper           from "./TortillaWrapper.js";

const isWrapped = function (v) {
    return v instanceof TortillaWrapper;
};

const isGeneratorFunction = function (v) {
    return v()[Symbol.iterator];
};

const isIterable = function (v) {
    return v[Symbol.iterator] && v[Symbol.iterator]() !== v;
};

const isIterator = function (v) {
    return v[Symbol.iterator] && v[Symbol.iterator]() === v;
};

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
 * @return {TortillaGeneratorFunction}
 * The wrapper.
 */
tortilla.range = function (start = 0, end = Number.POSITIVE_INFINITY, step = 1) {
    return new TortillaGeneratorFunction(function* () {
        for (let i = start; i < end; i += step) {
            yield i;
        }
    });
};

tortilla.concat = function (toConcat) {
    return new TortillaGeneratorFunction(function* () {
        for (let iterable of toConcat) {
            yield* iterable;
        }
    });
};

tortilla.zip = function (toZip) {
    return tortilla.zipWith((...xs) => xs, toZip);
};

tortilla.zipWith = function (iteratee, toZip) {
    const iterators = toZip.map(x => x[Symbol.iterator]());
    return new TortillaGeneratorFunction(function* () {
        while (true) {
            const results = iterators.map(x => x.next());
            if (results.some(x => x.done)) return;
            yield iteratee(...results.map(x => x.values));
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
