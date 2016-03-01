import "babel-regenerator-runtime"; // TODO remove once babel bug is fixed

import EventManager              from "./EventManager.js";
import {observableExtendedMixin} from "./Observable.js";

import GumpPath from "./GumpPath.js";
import GumpSet  from "./GumpSet.js";

export default class GumpMap {

    constructor(iterable = []) {
        this.map = new Map();
        this.size = 0;

        this.eventManager = new EventManager();

        this.bubbleEvent = (e) => {
            console.log(e);
        };

        for (let [path, value] of iterable) {
            this.add(path, value);
        }
    }

    add(path, value) {
        path = GumpPath.toGumpPath(path);

        if (!path.isEmpty()) {
            const key           = path.head(),
                  remainingPath = path.tail();

            if (remainingPath.isEmpty()) {
                this.addHere(key, value);
            } else {
                this.addDeeper(key, remainingPath, value);
            }
        }

        return this;
    }

    addHere(key, value) {
        let nextLevel = this.map.get(key);
        if (!this.map.has(key)) {
            if (value instanceof GumpMap || value instanceof GumpSet) {
                this.map.set(key, value);
                // add listener
            } else {
                value = new GumpSet([value]); // add listener
                this.map.set(key, value);
                // fire event
            }
        } else if (nextLevel instanceof GumpSet) {
            nextLevel.add(value);
        } else {
            throw new Error(`Expected a GumpSet, but found ${nextLevel}.`);
        }
    }

    addDeeper(key, remainingPath, value) {
        let nextLevel = this.map.get(key);
        if (nextLevel instanceof GumpMap) {
            nextLevel.add(remainingPath, value);
        } else if (nextLevel === undefined) {
            nextLevel = new GumpMap([[remainingPath, value]]); // add listener
            this.map.set(key, nextLevel);
        } else {
            throw new Error(`Expected a GumpMap, but found ${nextLevel}.`);
        }

        // bubble event; adjust path
    }

    delete(path, value = null) {
        path = GumpPath.toGumpPath(path);

        if (path.isEmpty()) {
            return false;
        }

        const key           = path.head(),
              remainingPath = path.tail();

        if (remainingPath.isEmpty()) {
            return this.deleteHere(key, value);
        } else {
            return this.deleteDeeper(key, remainingPath, value);
        }
    }

    deleteHere(key, value = null) {
        if (value === null) {
            return this.map.delete(key);
        }

        const nextLevel = this.map.get(key);
        if (nextLevel instanceof GumpSet) {
            return nextLevel.delete(value);
        } else {
            throw new Error(`Expected a GumpSet, but found ${nextLevel}.`);
        }
    }

    deleteDeeper(key, remainingPath, value = null) {
        let nextLevel = this.map.get(key);
        if (nextLevel instanceof GumpMap) {
            return nextLevel.delete(remainingPath, value);
        } else {
            throw new Error(`Expected a GumpMap, but found ${nextLevel}.`);
        }
    }

    get(path) {
        path = GumpPath.toGumpPath(path);

        if (path.isEmpty()) {
            return undefined;
        }

        const key           = path.head();
        const remainingPath = path.tail();
        const nextLevel     = this.map.get(key);

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

        const finalLevel = this.get(path);
        if (value === null) {
            return finalLevel !== undefined;
        } else if (finalLevel instanceof GumpSet) {
            return finalLevel.has(value);
        } else {
            return false;
        }
    }

    entries(deep = true) {
        if (deep) {
            return this.entriesDeep();
        } else {
            return this.entriesShallow();
        }
    }

    * entriesShallow() {
        for (let [k, v] of this.map.entries()) {
            yield [GumpPath.toGumpPath(k), v];
        }
    }

    * entriesDeep() {
        for (let [head, value] of this.map.entries()) {
            if (value instanceof GumpMap) {
                for (let [tail, primitive] of value.entries()) {
                    yield [tail.prepend(head), primitive];
                }
            } else {
                yield [GumpPath.toGumpPath(head), value];
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

    * keysShallow() {
        for (let k of this.map.keys()) {
            yield GumpPath.toGumpPath(k);
        }
    }

    * keysDeep() {
        for (let [head, value] of this.map.entries()) {
            if (value instanceof GumpMap) {
                for (let tail of value.keys()) {
                    yield tail.prepend(head);
                }
            } else {
                yield GumpPath.toGumpPath(head);
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

    [Symbol.iterator]() {
        return this.entries();
    }

    clear() {
        return this.map.clear();
    }

    forEach(f) {
        for (let [key, value] of this) {
            f(value, key, this);
        }
    }

    updateWithLiteral(newValue, path, oldValue = null) {
        // remove old
        // add new
    }

    updateWithFunction(f, path, value = null) {
        // remove old
        // add new
    }
}

// Make GumpMap observable
Object.assign(GumpMap.prototype, observableExtendedMixin);
