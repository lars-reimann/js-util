import {cloneSym} from "./Cloneable.js";

class Cloner {

    constructor() {
        this.recursionLevel = 0;
        this.clonedObjects = new Map();
    }

    clone(p) {
        if (this.recursionLevel === 0) {
            this.clonedObjects.clear();
        }

        let result;

        this.recursionLevel++;
        if (this.isPrimitive(p)) {
            result = this.clonePrimitive(p);
        } else if (this.isDate(p)) {
            result = this.cloneDate(p);
        } else if (this.isRegExp(p)) {
            result = this.cloneRegExp(p);
        } else if (this.isArray(p)) {
            result = this.cloneArray(p);
        } else if (this.isObject(p)) {
            result = this.cloneObject(p);
        } else {
            throw new Error(`${p} cannot be cloned.`);
        }
        this.recursionLevel--;

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
     * Clones a primitive value.
     *
     * @param {*} primitive
     * The value to clone.
     *
     * @return {*}
     * The value itself.
     *
     * @private
     */
    clonePrimitive(primitive) {
        return primitive;
    }

    /**
     * Tests if the given parameter is a Date object.
     *
     * @param {*} p
     * The parameter to test.
     *
     * @return {Boolean}
     * If the given parameter is a Date object.
     *
     * @private
     */
    isDate(p) {
        return p instanceof Date;
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
        return new Date(date.getTime());
    }

    /**
     * Tests if the given parameter is a RegExp object.
     *
     * @param {*} p
     * The parameter to test.
     *
     * @return {Boolean}
     * If the given parameter is a RegExp object.
     *
     * @private
     */
    isRegExp(p) {
        return p instanceof RegExp;
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
        return new RegExp(regExp);
    }

    /**
     * Tests if the given parameter is an array.
     *
     * @param {*} p
     * The parameter to test.
     *
     * @return {Boolean}
     * If the given parameter is an array.
     *
     * @private
     */
    isArray(p) {
        return Array.isArray(p);
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
        if (this.clonedObjects.has(arr)) {
            return this.clonedObjects.get(arr);
        }

        let result = [];
        this.clonedObjects.set(arr, result);
        for (let v of arr) {
            result.push(this.cloneChild(v));
        }
        return result;
    }

    /**
     * Tests if the given parameter is an object.
     *
     * @param {*} p
     * The parameter to test.
     *
     * @return {Boolean}
     * If the given parameter is an object.
     *
     * @private
     */
    isObject(p) {
        return p instanceof Object;
    }

    /**
     * Clones an object.
     *
     * @param {Object} obj
     * The object to clone.
     *
     * @return {Object}
     * A clone of the object.
     */
    cloneObject(obj) {
        if (this.clonedObjects.has(obj)) {
            return this.clonedObjects.get(obj);
        }

        let result = {};
        this.clonedObjects.set(obj, result);
        for (var [k, v] of Object.entries(obj)) {
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
     */
    isCloneable(p) {
        return typeof p === "object" && typeof p[cloneSym] === "function";
    }

    /**
     * Clones a Cloneable object.
     *
     * @param {Object} cloneable
     * The object to clone.
     *
     * @return {Object}
     * A clone of the object.
     */
    cloneCloneable(cloneable) {
        return cloneable[cloneSym]();
    }
}

/**
 * The single instance of the Cloner class. Note that only one object must be
 * cloned at any given time.
 *
 * @type {Cloner}
 */
export const instance = new Cloner();