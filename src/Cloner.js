import _ from "lodash/fp";

import {cloneableSymbols} from "./Cloneable.js";

/**
 * A class to clone primitive values (type undefined, boolean, number, string,
 * symbol of function) and acyclic or cyclic arrays and objects. There is some
 * special support for Date and RegExp objects.
 */
export default class Cloner {

    /**
     *
     */
    constructor() {

        /**
         * How deep calls to the clone method are nested.
         *
         * @type {Number}
         * @private
         */
        this.recursionLevel = 0;

        /**
         * A mapping from original objects to their clones.
         *
         * @type {Map<Object, Object>}
         * @private
         */
        this.context = new Map();
    }

    /**
     * Tries to clone the given parameter.
     *
     * @param {*} p
     * The value to clone.
     *
     * @return {*}
     * A clone of the value.
     *
     * @throws {Error}
     * If the cloning fails because a type was not supported.
     */
    clone(p) {
        let result;

        this.recursionLevel++;
        if (this.isPrimitive(p)) {
            result = p;
        } else if (this.context.has(p)) {
            result = this.context.get(p);
        } else if (_.isDate(p)) {
            result = this.cloneDate(p);
        } else if (_.isRegExp(p)) {
            result = this.cloneRegExp(p);
        } else if (_.isArray(p)) {
            result = this.cloneArray(p);
        } else if (_.isObject(p)) {
            result = this.cloneObject(p);
        } else {
            throw new Error(`${p} cannot be cloned.`);
        }
        this.recursionLevel--;
        this.cleanup();

        return result;
    }

    /**
     * Tests if the given parameter is just a primitive value, i. e. it is not
     * an object or null.
     *
     * @param {*} p
     * The parameter to test.
     *
     * @return {Boolean}
     * If the given parameter is primitive.
     *
     * @private
     */
    isPrimitive(p) {
        return p === null || typeof p !== "object";
    }

    /**
     * Clones a Date object
     *
     * @param {Date} date
     * The Date object to clone.
     *
     * @return {Date}
     * A clone of the Date object.
     *
     * @private
     */
    cloneDate(date) {
        let result = new Date(date.getTime());
        this.context.set(date, result);
        return result;
    }

    /**
     * Clones a RegExp object.
     *
     * @param {RegExp} regExp
     * The RegExp object to clone.
     *
     * @return {RegExp}
     * A clone of the RegExp object.
     *
     * @private
     */
    cloneRegExp(regExp) {
        let result = new RegExp(regExp);
        this.context.set(regExp, result);
        return result;
    }

    /**
     * Clones an array.
     *
     * @param {Array} arr
     * The array to clone.
     *
     * @return {Array}
     * A clone of the array.
     *
     * @private
     */
    cloneArray(arr) {
        let result = [];
        this.context.set(arr, result);
        for (let v of arr) {
            result.push(this.cloneChild(v));
        }
        return result;
    }

    /**
     * Clones an object.
     *
     * @param {Object} obj
     * The object to clone.
     *
     * @return {Object}
     * A clone of the object.
     *
     * @private
     */
    cloneObject(obj) {
        let result = {};
        this.context.set(obj, result);
        for (let [k, v] of Object.entries(obj)) {
            result[k] = this.cloneChild(v);
        }
        return result;
    }

    /**
     * Clones a value in a container.
     *
     * @param {*} child
     * The value to clone.
     *
     * @return {*}
     * A clone of the value.
     *
     * @private
     */
    cloneChild(child) {
        return this.isCloneable(child) ? this.cloneCloneable(child) : this.clone(child);
    }

    /**
     * Tests if the given parameter implements the Cloneable interface.
     *
     * @param {*} p
     * The parameter to test.
     *
     * @return {Boolean}
     * If the given parameter is Cloneable.
     *
     * @private
     */
    isCloneable(p) {
        return typeof p === "object" && typeof p[cloneableSymbols.clone] === "function";
    }

    /**
     * Clones a Cloneable object.
     *
     * @param {Object} cloneable
     * The object to clone.
     *
     * @return {Object}
     * A clone of the object.
     *
     * @private
     */
    cloneCloneable(cloneable) {
        return cloneable[cloneableSymbols.clone](this);
    }

    /**
     * Clears the context once the cloning is completed.
     *
     * @private
     */
    cleanup() {
        if (this.recursionLevel === 0) {
            this.context.clear();
        }
    }
}
