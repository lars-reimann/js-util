import {Cloner} from "@ignavia/util";

/**
 * Contains symbols for the methods of the Cloneable interface.
 *
 * @type {Object}
 */
export const cloneableSymbols = {
    clone: Symbol("clone")
};

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
    [cloneableSymbols.clone]() {}
}

/**
 * A mixin for Cloneable behavior.
 *
 * @type {Object}
 *
 * @example
 * Object.assign(MyClass.prototype, cloneableMixin);
 * let myObject = new MyClass(),
 *     clone    = myObject[cloneableSymbols.clone]
 */
export const cloneableMixin = {
    [cloneableSymbols.clone](cloner = new Cloner()) {
        return cloner.clone(this);
    }
};
