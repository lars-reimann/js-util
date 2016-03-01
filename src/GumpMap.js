import "babel-regenerator-runtime"; // TODO remove once babel bug is fixed

import GumpSet from "./GumpSet.js";

export default class GumpMap {
    constructor(fireEvents = true) {
        this.map = new Map();
        this.size = 0;
    }

    set(path, value, addToExisting = false) {
        if (!path.isEmpty()) {
            const key           = path.head(),
                  remainingPath = path.tail();

            if (remainingPath.isEmpty()) {
                this.setHere(key, value, addToExisting);
            } else {
                this.setDeeper(key, remainingPath, value, addToExisting);
            }
        }

        return this
    }

    setHere(key, value, addToExisting) {
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

    setDeeper(key, remainingPath, value, addToExisting) {
        if (this.has.key(key)) {
            this.get(key).set(remainingPath, value, addToExisting);
        } else {
            const nextLevel = new GumpMap();
            nextLevel.set(remainingPath, value, addToExisting);
            this.map.set(key, nextLevel);
        }
    }

    delete(path, value = null) {
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
        if (value === null) {
            return this.get(path) !== undefined;
        } else {
            return this.get(path) === value;
        }
    }

    entries() {
        //return this.map.entries();
    }

    keys() {
        //return this.map.keys(); // return paths
    }

    values() {
        //return this[Symbol.iterator]();
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

    }

    updateWithFunction() {

    }
}
