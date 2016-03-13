import Cloner from "./Cloner.js";

/**
 * Contains symbols for the methods of the Cloneable interface.
 *
 * @type {Object}
 */
export const cloneableSymbols = {
    clone: Symbol("clone")
};

/**
 * A mixin for Cloneable behavior. The keys of the methods are the symbols
 * defined in {@link cloneableSymbols}.
 *
 * @type {Object}
 *
 * @example
 * Object.assign(MyClass.prototype, cloneableMixin);
 * const myObject = new MyClass();
 * const clone    = myObject[cloneableSymbols.clone];
 */
export const cloneableMixin = {
    [cloneableSymbols.clone](cloner = new Cloner()) {
        return cloner.clone(this);
    }
};

/**
 * In addition to everything {@link cloneableMixin} offers this mixin also
 * provides an easier to use interface. It adds methods with names that
 * correspond to the keys in {@link cloneableSymbols}.
 *
 * @type {Object}
 *
 * @example
 * Object.assign(MyClass.prototype, cloneableExtendedMixin);
 * const myObject = new MyClass();
 * const clone    = myObject.clone();
 */
export const cloneableExtendedMixin = Object.assign({
    clone: cloneableMixin[cloneableSymbols.clone]
}, cloneableMixin);

// /**
//  * An interface for every object that can be cloned.
//  *
//  * @interface
//  */
// class Cloneable {

//     /**
//      * Returns a copy of this object.
//      *
//      * @return {*}
//      * A copy of this object.
//      */
//     [cloneableSymbols.clone]() {}
// }