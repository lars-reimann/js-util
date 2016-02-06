import Cloner from "./Cloner.js";

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
 * This is a mixin for Cloneable behavior.
 *
 * @type {Object}
 */
export const cloneableMixin = {
    [cloneSym](cloner = new Cloner()) {
        return cloner.clone(this);
    }
};
