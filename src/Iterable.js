import _ from "lodash/fp";

export default class Iterable {
    constructor(iterable) {
        this.before = [];
        this.iterable = iterable();
        this.current = 0;

        // TODO: maybe use a pointer to mark the current position
        // allow resetting this iterable
    }

    head() {
        return this.peak();
    }

    drop(n) {
        return new Iterable(function* () {
            const iterator = this.iterable[Symbol.iterator]();
            for (let i = 0; i < n; i++) {
                const {result} = iterator.next();

                if (iterator === this.iterable) {
                    this.before.push(result);
                }
            }
            yield* iterator;
        });
    }

    concat({before = [], after = []} = {}) {
        const that = this;
        return new Iterable(function* () {
            for (let iterable of [...before , that, ...after]) { // TODO change this to that (dynamic this)
                yield* iterable;
            }
        });
    }

    peak() {
        if (this.before.length > 0) {
            return this.before[0];
        }

        const iterator = this.iterable[Symbol.iterator]();
        const {value} = iterator.next();

        if (iterator === this.iterable) {
            this.before.push(value);
        }

        return value;
    }

    next() {

    }

    value() {
        return this.iterable;
    }

    * [Symbol.iterator]() {
        yield* before;
        yield* this.iterable[Symbol.iterator]();
    }
}
/*
export const IterableFP = {};

_.chunk
_.compact

_.dropRight
_.dropRightWhile
_.dropWhile
_.fill
_.findIndex
_.findLastIndex
_.flatten
_.flattenDeep
_.flattenDepth
_.fromPairs
_.head
_.indexOf
_.initial
_.intersection
_.intersectionBy
_.intersectionWith
_.join
_.last
_.lastIndexOf
_.pull
_.pullAll
_.pullAllBy
_.pullAllWith
_.pullAt
_.remove
_.reverse
_.slice
_.takeRight
_.takeRightWhile
_.takeWhile
_.uniq
_.uniqBy
_.uniqWith
_.unzip
_.unzipWith
_.without
_.zip
_.zipObject
_.zipObjectDeep
_.zipWith



IterableFP.zip = function* (...iterables) {
    let iterators = _(iterables).map()
    while (true) {
        const next = [];

    }
};



// IterableFP.dropWhile = _.curry(function * (predicate, iterable) {
//     for (let v of iterable) {
//         if (predicate(v)) {
//             output = true;
//         }
//         if (output) {
//             yield
//         }
//     }
// });

IterableFP.tail = IterableFP.drop(1);

IterableFP.take = function* (n, iterable) {
    const iterator = iterable[Symbol.iterator]();
    for (let i = 0; i < n; i++) {
        const {value} = iterator.next();
        yield value;
    }
};

// IterableFP.countBy = function (f, iterable) {

// }

IterableFP.every = _.curry(function (predicate, iterable) {
    for (let v of iterable) {
        if (!predicate(v)) {
            return false;
        }
    }
    return true;
});

IterableFP.filter = _.curry(function* (predicate, iterable) {
    for (let v of iterable) {
        if (predicate(v)) {
            yield v;
        }
    }
});

// IterableFP.* find(predicate, iterable) {

// }

// IterableFP.* findLast(predicate, iterable) {

// }

// IterableFP.* flatMap(f, iterable) {

// }

IterableFP.forEach = _.curry(function (f, iterable) {
    for (let v of iterable) {
        f(v);
    }
});

// statci forEachRight

// IterableFP.groupBy()

// IterableFP.includes()

// IterableFP.invokeMap()

// IterableFP.keyBy()


IterableFP.map = _.curry(function* (f, iterable) {
    for (let v of iterable) {
        yield f(v);
    }
});

// IterableFP.orderBy

// IterableFP.partition



// IterableFP.reduce = function (f, iterable) {
//     let result
// }

// IterableFP.reduceRight

// IterableFP.reject

// IterableFP.sample

// IterableFP.sampleSize

// IterableFP.shuffle

// IterableFP.size
/*
IterableFP.some = _.curry(function (predicate, iterable) {
    for (let v of iterable) {
        if (predicate(v)) {
            return true;
        }
    }
    return false;
});

// IterableFP.sortBy
*/