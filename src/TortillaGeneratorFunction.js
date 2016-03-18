export default class TortillaGeneratorFunction {

    static empty = new TortillaGeneratorFunction(function* () {});

    static constant(value) {
        return new TortillaGeneratorFunction(function* () {
            while (true) {
                yield value;
            }
        });
    }

    static range(start = 0, stop, step = 1) {
        // TODO
    }

    constructor(f) {
        this.f = f;
    }

    head(...params) {
        const [value] = this.f(...params);
        return value;
    }

    tail(...params) {
        return this.drop(1, ...params);
    }

    drop(n, ...params) {
        const that = this;
        return new TortillaGeneratorFunction(function* () {
            const iterator = that.f(...params);
            for (let i = 0; i < n; i++) {
                iterator.next();
            }
            yield* iterator;
        });
    }
// TODO: problem finite generators
    dropWhile(predicate, ...params) {
        const that = this;
        return new TortillaGeneratorFunction(function* () {
            const iterator = that.f(...params);
            let value;
            do {
                ({value} = iterator.next());
            } while (predicate(value));
            yield value;
            yield* iterator;
        });
    }

    take(n, ...params) {
        const that = this;
        return new TortillaGeneratorFunction(function* () {
            const iterator = that.f(...params);
            for (let i = 0; i < n; i++) {
                const {value} = iterator.next();
                yield value;
            }
        });
    }

    takeWhile(predicate, ...params) {
        const that = this;
        return new TortillaGeneratorFunction(function* () {
            const iterator = that.f(...params);
            while (true) {
                const {value} = iterator.next();
                if (predicate(value)) {
                    yield value;
                } else {
                    break;
                }
            }
        });
    }

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

    map(f, ...params) {
        const that = this;
        return new TortillaGeneratorFunction(function* () {
            for (let value of that.f(...params)) {
                yield f(value);
            }
        });
    }

    // apply method (partially)

    apply(...params) {

    }

    toIterator(...params) {

    }

    [Symbol.iterator]() {
        return this.f();
    }

    // concat, zip
}