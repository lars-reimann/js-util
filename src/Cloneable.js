/**
 * An interface for every object that can be cloned.
 *
 * @interface
 */
export default class Cloneable {

    /**
     * Returns a copy of this object.
     *
     * @return {*}
     * A copy of this object.
     */
    [cloneSym]() {}
}

/**
 * A symbol for the clone method in the Cloneable interface.
 *
 * @type {Symbol}
 */
export const cloneSym = Symbol("clone");

/**
 * This is a mixin for extensible behavior.
 *
 * @type {Object}
 * @todo
 */
export const cloneableMixin = {
    [cloneSym]() {
        return clone(this);
    }
};

function clone(p) {
    if (isPrimitive(p)) {
        return clonePrimitive(p);
    }
    if (isDate(p)) {
        return cloneDate(p);
    }
    if (isArray(p)) {
        return cloneArray(p);
    }
    if (isObject(p)) {
        return cloneObject(p);
    }

    throw new Error(`${p} cannot be cloned.`);
}

function isPrimitive(p) {
    return p === null || typeof p !== "object";
}

function clonePrimitive(primitive) {
    return primitive;
}

function isDate(p) {
    return p instanceof Date;
}

function cloneDate(date) {
    let result = new Date();
    result.setTime(date.getTime());
    return result;
}

function isArray(p) {
    return Array.isArray(p);
}

function cloneArray(arr) {
    let result = [];
    for (let v of arr) {
        const copy = isCloneable(v) ? cloneCloneable(v) : clone(v);
        result.push(copy);
    }
    return result;
}

function isObject(p) {
    return p instanceof Object;
}

function cloneObject(obj) {
    let result = {};
    for (var [k, v] of obj.entries()) {
        const copy = isCloneable(v) ? cloneCloneable(v) : clone(v);
        result[k] = copy;
    }
    return result;
}

function isCloneable(p) {
    return typeof p[cloneSym] === "function";
}

function cloneCloneable(cloneable) {
    return cloneable[cloneSym]();
}