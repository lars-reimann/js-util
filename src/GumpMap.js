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

        this.childToKey = new Map();

        this.bubbleEvent = (e) => {
            const key  = this.childToKey.get(e.source);
            const path = e.data.path ? e.data.path.prepend(key) : GumpPath.toGumpPath(key);
            this.fireEvent(EventManager.makeEvent({
                source: this,
                type:   e.type,
                data:   { path, value: e.data.value }
            }));
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
        if (this.map.has(key)) {
            this.addHereExisting(key, value);
        } else {
            this.addHereNew(key, value);
        }
    }

    addHereExisting(key, value) {
        const nextLevel = this.map.get(key);
        if (nextLevel instanceof GumpSet) {
            nextLevel.add(value);
        } else {
            throw new Error(`Expected a GumpSet, but found ${nextLevel}.`);
        }
    }

    addHereNew(key, value) {
        if (value instanceof GumpMap || value instanceof GumpSet) {
            this.setNextLevel(key, value);
            this.fireEvent(EventManager.makeEvent({
                source: this,
                type:   "add",
                data:   { path: GumpPath.toGumpPath(key), value }
            }));
        } else {
            const nextLevel = new GumpSet();
            this.setNextLevel(key, nextLevel);
            nextLevel.add(value);
        }
    }

    addDeeper(key, remainingPath, value) {
        let nextLevel = this.map.get(key);
        if (nextLevel instanceof GumpMap) {
            nextLevel.add(remainingPath, value);
        } else if (nextLevel === undefined) {
            nextLevel = new GumpMap([[remainingPath, value]]); // add listener
            this.setNextLevel(key, nextLevel);
        } else {
            throw new Error(`Expected a GumpMap, but found ${nextLevel}.`);
        }

        // bubble event; adjust path
    }

    setNextLevel(key, nextLevel) {
        nextLevel.addListener(this.bubbleEvent, ["add", "clear", "delete"]);
        this.map.set(key, nextLevel);
        this.childToKey.set(nextLevel, key);
    }


    /**
     * Empties the map completely.
     */
    clear() {
        this.map.clear();
        this.size = 0;

        // fire event
        // remove event listeners from nested gumpmaps/sets
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

    deleteHere(key, value = null) { // remove if nested structure becomes empty; NO, clients might fill nested maps directly again
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

    * entries({resolveMaps = true, resolveSets = true} = {}) {
        for (let [k, v] of this.map.entries()) {
            if (resolveMaps && v instanceof GumpMap) {
                yield* this.entriesResolveMap(k, v, {resolveMaps, resolveSets});
            } else if (resolveSets && v instanceof GumpSet) {
                yield* this.entriesResolveSet(k, v);
            } else {
                yield [GumpPath.toGumpPath(k), v];
            }
        }
    }

    * entriesResolveMap(k, map, conf) {
        for (let [tail, primitive] of map.entries(conf)) {
            yield [tail.prepend(k), primitive];
        }
    }

    * entriesResolveSet(k, set) {
        for (let primitive of set.values()) {
            yield [GumpPath.toGumpPath(k), primitive];
        }
    }

    * keys(resolveMaps = true) {
        for (let [k, v] of this.map.entries()) {
            if (resolveMaps && v instanceof GumpMap) {
                yield* this.keysResolveMap(k, v, resolveMaps);
            } else {
                yield GumpPath.toGumpPath(k);
            }
        }
    }

    * keysResolveMap(k, map, resolveMaps) {
        for (let tail of map.keys(resolveMaps)) {
            yield tail.prepend(k);
        }
    }

    * values({resolveMaps = true, resolveSets = true} = {}) {
        for (let v of this.map.values()) {
            if (resolveMaps && v instanceof GumpMap) {
                yield* v.values({resolveMaps, resolveSets});
            } else if (resolveSets && v instanceof GumpSet) {
                yield* v.values();
            } else {
                yield v;
            }
        }
    }

    /**
     * Loops over all key-value-pairs in the map. Nested GumpMaps and GumpSets
     * are resolved.
     */
    [Symbol.iterator]() {
        return this.entries();
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
