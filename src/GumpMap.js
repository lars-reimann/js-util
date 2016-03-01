import "babel-regenerator-runtime"; // TODO remove once babel bug is fixed

import EventManager              from "./EventManager.js";
import {observableExtendedMixin} from "./Observable.js";

import GumpPath from "./GumpPath.js";
import GumpSet  from "./GumpSet.js";

export default class GumpMap {

    constructor(iterable = [], addToExisting = true) {
        this.map = new Map();
        this.size = 0;

        this.eventManager = new EventManager();

        for (let [path, value] of iterable) {
            this.set(path, value, addToExisting);
        }
    }

    set(path, value, addToExisting = true) {
        path = GumpPath.toGumpPath(path);

        if (!path.isEmpty()) {
            const key           = path.head(),
                  remainingPath = path.tail();

            if (remainingPath.isEmpty()) {
                this.setHere(key, value, addToExisting);
            } else {
                this.setDeeper(key, remainingPath, value, addToExisting);
            }
        }



        return this;
    }

    setHere(key, value, addToExisting = true) {
        if (this.has(key) && addToExisting) {
            const oldValue = this.get(key);
            if (oldValue instanceof GumpSet) {
                oldValue.add(value);
            } else {
                const nextLevel = new GumpSet();
                nextLevel.add(oldValue).add(value);
                this.map.set(key, nextLevel);
            }
        } else {
            this.map.set(key, value);
        }
    }

    setDeeper(key, remainingPath, value, addToExisting = true) {
        if (this.has(key)) {
            this.get(key).set(remainingPath, value, addToExisting);
        } else {
            const nextLevel = new GumpMap();
            nextLevel.set(remainingPath, value, addToExisting);
            this.map.set(key, nextLevel);
        }
    }

    delete(path, value = null) {
        path = GumpPath.toGumpPath(path);

        if (path.isEmpty()) {
            return false;
        }

        const key = path.head(),
              remainingPath = path.tail();


    }

    // value optional
    deleteHere(key, value = null) {

    }

    deleteDeeper(key, remainingPath, value = null) {

    }

    get(path) {
        path = GumpPath.toGumpPath(path);

        if (path.isEmpty()) {
            return undefined;
        }

        const key = path.head(),
              remainingPath = path.tail(),
              nextLevel = this.map.get(key);

        if (remainingPath.isEmpty()) {
            return nextLevel;
        } else if (nextLevel instanceof GumpMap) {
            return nextLevel.get(remainingPath);
        } else {
            return undefined;
        }
    }

    has(path, value = null) {
        path = GumpPath.toGumpPath(path);

        if (value === null) {
            return this.get(path) !== undefined;
        } else {
            return this.get(path) === value;
        }
    }

    entries(deep = true) {
        if (deep) {
            return this.entriesDeep();
        } else {
            return this.entriesShallow();
        }
    }

    entriesShallow() {
        return this.map.entries();
    }

    * entriesDeep() {
        for (let [head, value] of this.map.entries()) {
            if (value instanceof GumpMap) {
                for (let [tail, primitive] of value.entries()) {
                    yield [tail.prepend(head), primitive];
                }
            } else {
                yield [new GumpPath([head]), value];
            }
        }
    }

    keys(deep = true) {
        if (deep) {
            return this.keysDeep();
        } else {
            return this.keysShallow();
        }
    }

    keysShallow() {
        return this.map.keys();
    }

    * keysDeep() {
        for (let [head, value] of this.map.entries()) {
            if (value instanceof GumpMap) {
                for (let tail of value.keys()) {
                    yield tail.prepend(head);
                }
            } else {
                yield new GumpPath([head]);
            }
        }
    }

    values(deep = true) {
        if (deep) {
            return this.valuesDeep();
        } else {
            return this.valuesShallow();
        }
    }

    valuesShallow() {
        return this.map.values();
    }

    * valuesDeep() {
        for (let value of this.map.values()) {
            if (value instanceof GumpMap) {
                yield* value.values();
            } else {
                yield value;
            }
        }
    }

    * [Symbol.iterator]() {
        for (let [key, value] of this.map.entries()) {
            if (value instanceof GumpMap || value instanceof GumpSet) {
                yield* value;
            } else {
                yield value;
            }
        } // return values or entries????
    }

    clear() {
        return this.map.clear();
    }

    forEach() {

    }

    updateWithLiteral() {
        // remove old
        // add new
    }

    updateWithFunction() {
        // remove old
        // add new
    }
}

// Make GumpMap observable
Object.assign(GumpMap.prototype, observableExtendedMixin);
