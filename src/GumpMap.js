import "babel-regenerator-runtime"; // TODO remove once babel bug is fixed

import EventManager              from "./EventManager.js";
import {observableExtendedMixin} from "./Observable.js";

import GumpPath from "./GumpPath.js";
import GumpSet  from "./GumpSet.js";

export default class GumpMap {

    /**
     * @param {Iterable} [iterable=[]]
     * An iterable object containing the initial values of this map. Each value
     * in this array is expected to match [path, value], where path is the place
     * where the value should be added.
     */
    constructor(initialValues = []) {

        /**
         * Stores the size of this map.
         *
         * @type {Number}
         */
        this.size = 0;

        /**
         * Stores the values of this map.
         *
         * @type {Map}
         * @private
         */
        this.children = new Map();

        /**
         * Maps from a direct child to the key used to access it.
         *
         * @type {Map}
         * @private
         */
        this.childToKey = new Map();

        /**
         * Handles listeners.
         *
         * @type {EventManager}
         * @private
         */
        this.eventManager = new EventManager();

        this.bubbleAddEvent = (e) => {
            const value = e.data.value ? e.data.value : e.data;

            if (e.data.value instanceof GumpMap || e.data.value instanceof GumpSet) {
                this.size += e.data.value.size;
            } else {
                this.size++;
            }

            const key   = this.childToKey.get(e.source);
            const path  = e.data.path ? e.data.path.prepend(key) : GumpPath.toGumpPath(key);
            this.fireEvent(EventManager.makeEvent({
                source: this,
                type:   e.type,
                data:   { path, value }
            }));
        };

        this.bubbleClearEvent = (e) => {
            const value = e.data.value ? e.data.value : e.data;
            this.size -= e.data;

            const key   = this.childToKey.get(e.source);
            const path  = e.data.path ? e.data.path.prepend(key) : GumpPath.toGumpPath(key);
            this.fireEvent(EventManager.makeEvent({
                source: this,
                type:   e.type,
                data:   { path, value }
            }));
        };

        /**
         * The function used to handle events emitted by children of this map.
         *
         * @type {Function}
         * @private
         */
        this.bubbleEvent = (e) => {
            const key  = this.childToKey.get(e.source);
            const path = e.data.path ? e.data.path.prepend(key) : GumpPath.toGumpPath(key);
            this.fireEvent(EventManager.makeEvent({
                source: this,
                type:   e.type,
                data:   { path, value: e.data.value }
            }));
        };

        // Add initial values
        for (let [path, value] of initialValues) {
            this.add(path, value);
        }
    }

    /**
     * Adds the given value to this map under the given path.
     *
     * @param {*} path
     * Where the value should be added. It must be understood by the
     * {@link GumpPath.toGumpPath} method.
     *
     * @param {*} value
     * The value to add.
     */
    add(path, value) {
        path = GumpPath.toGumpPath(path);

        if (!path.isEmpty()) {
            const key           = path.head();
            const remainingPath = path.tail();

            if (remainingPath.isEmpty()) {
                this.addHere(key, value);
            } else {
                this.addDeeper(key, remainingPath, value);
            }
        }

        return this;
    }

    /**
     * Adds a value directly under this map using the given key.
     *
     * @param {*} key
     * Where the value should be added.
     *
     * @param {*} value
     * The value to add.
     *
     * @private
     */
    addHere(key, value) {
        if (this.children.has(key)) {
            this.addHereExisting(key, value);
        } else {
            this.addHereNew(key, value);
        }
    }

    /**
     * Adds the given value to the GumpSet accessible via the given key. If the
     * value under the key is no GumpSet, an error is thrown.
     *
     * @param {*} key
     * The key of the GumpSet.
     *
     * @param {*} value
     * The value to add to the GumpSet.
     *
     * @throws {Error}
     * If the value under the given key is no GumpSet.
     *
     * @private
     */
    addHereExisting(key, value) {
        const nextLevel = this.children.get(key);
        if (nextLevel instanceof GumpSet) {
            nextLevel.add(value);
        } else {
            throw new Error(`Expected a GumpSet, but found ${nextLevel}.`);
        }
    }

    /**
     * Adds the given value to this map under the given key. If it is already
     * an instance of GumpMap or GumpSet the value is used directly, otherwise
     * it is wrapped in a GumpSet.
     *
     * @param {*} key
     * Where the value should be added.
     *
     * @param {*} value
     * The value to add.
     *
     * @emits {Event}
     * If the value is used directly a new event is fired. The source is this
     * map, the type is "add" and the data is an object containing the path to
     * the value and the value itself.
     *
     * @private
     */
    addHereNew(key, value) {
        if (value instanceof GumpMap || value instanceof GumpSet) {
            this.setNextLevel(key, value);
            this.size += value.size;
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

    /**
     * Adds the value to a GumpMap listed under the given key.
     *
     * @param {*} key
     * The GumpMap to add the value to.
     *
     * @param {GumpPath} remainingPath
     * Where in that GumpMap the value should be placed.
     *
     * @param {*} value
     * The value to add.
     *
     * @private
     */
    addDeeper(key, remainingPath, value) {
        if (this.children.has(key)) {
            this.addDeeperExisting(key, remainingPath, value);
        } else {
            this.addDeeperNew(key, remainingPath, value);
        }
    }

    /**
     * Adds the value to the GumpMap accessible via the given key. If the value
     * under this key is no GumpMap, an error is thrown.
     *
     * @param {*} key
     * The key of the GumpMap.
     *
     * @param {GumpPath} remainingPath
     * Where the value should be added in the GumpMap under key.
     *
     * @throw {Error}
     * If the value under key is no GumpMap.
     *
     * @private
     */
    addDeeperExisting(key, remainingPath, value) {
        const nextLevel = this.children.get(key);
        if (nextLevel instanceof GumpMap) {
            nextLevel.add(remainingPath, value);
        } else {
            throw new Error(`Expected a GumpMap, but found ${nextLevel}.`);
        }
    }

    /**
     * Creates a new GumpMap under the given key and add the value at the
     * position specified by remainingPath.+
     *
     * @param {*} key
     * The key of the GumpMap.
     *
     * @param {GumpPath} remainingPath
     * Where the value should be added in the GumpMap under key.
     *
     * @param {*} value
     * The value to add.
     *
     * @private
     */
    addDeeperNew(key, remainingPath, value) {
        const nextLevel = new GumpMap();
        this.setNextLevel(key, nextLevel);
        nextLevel.add(remainingPath, value);
    }

    /**
     * A helper function that adds a GumpSet or GumpMap to this map under the
     * given key.
     *
     * @param {*} key
     * Where it should added.
     *
     * @param {GumpMap|GumpSet} nextLevel
     * What should be added.
     *
     * @private
     */
    setNextLevel(key, nextLevel) {
        nextLevel.addListener(this.bubbleAddEvent, "add");
        nextLevel.addListener(this.bubbleClearEvent, "clear");
        nextLevel.addListener(this.bubbleEvent, "delete"); // TODO
        this.children.set(key, nextLevel);
        this.childToKey.set(nextLevel, key);
    }


    /**
     * Empties the map completely.
     */
    clear(path = []) {
        path = GumpPath.toGumpPath(path);

        if (path.isEmpty()) {
            this.clearHere();
        } else {
            this.clearDeeper(path);
        }
        // fire event
        // remove event listeners from nested gumpmaps/sets !!!!!
    }

    clearHere() {
        const previousSize = this.size;

        for (const v of this.values({resolveMaps: false, resolveSets: false})) {
            v.removeListener(this.bubbleAddEvent);
            v.removeListener(this.bubbleClearEvent);
            v.removeListener(this.bubbleEvent); // TODO
        }

        this.children.clear();
        this.size = 0;

        this.fireEvent(EventManager.makeEvent({
            source: this,
            type:   "clear",
            data:   previousSize
        }));
    }

    clearDeeper(path) {
        const finalLevel = this.get(path);
        if (finalLevel) {
            finalLevel.clear();
        }
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
            return this.children.delete(key);
        }

        const nextLevel = this.children.get(key);
        if (nextLevel instanceof GumpSet) {
            return nextLevel.delete(value);
        } else {
            throw new Error(`Expected a GumpSet, but found ${nextLevel}.`);
        }
    }

    deleteDeeper(key, remainingPath, value = null) {
        let nextLevel = this.children.get(key);
        if (nextLevel instanceof GumpMap) {
            return nextLevel.delete(remainingPath, value);
        } else {
            throw new Error(`Expected a GumpMap, but found ${nextLevel}.`);
        }
    }

    /**
     * Deletes all references to empty GumpMaps or GumpSets in this map.
     */
    purgeEmptyContainers() {
        for (const [path, v] of this.entries({resolveMaps: false, resolveSets: false})) {
            if (v.size === 0) {
                this.delete(path);
            } else if (v instanceof GumpMap) {
                v.purgeEmptyContainers();
            }
        }
    }

    get(path) {
        path = GumpPath.toGumpPath(path);

        if (path.isEmpty()) {
            return this;
        }

        const key           = path.head();
        const remainingPath = path.tail();
        const nextLevel     = this.children.get(key);

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
        for (let [k, v] of this.children.entries()) {
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
        for (let [k, v] of this.children.entries()) {
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
        for (let v of this.children.values()) {
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
