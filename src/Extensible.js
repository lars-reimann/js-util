/**
 * Contains symbols for the methods of the Extensible interface.
 *
 * @type {Object}
 */
export const extensibleSymbols = {
    addMethod:    Symbol("addMethod"),
    removeMethod: Symbol("removeMethod"),
    addPlugin:    Symbol("addPlugin"),
    removePlugin: Symbol("removePlugin")
};

/**
 * A mixin for Extensible behavior.
 *
 * @type {Object}
 *
 * @example
 * Object.assign(MyClass.prototype, extensibleMixin);
 * let myObject = new MyClass(),
 * myObject[extensibleSymbols.addMethod]("toString", () => "Hi");
 */
export const extensibleMixin = {
    [extensibleSymbols.addMethod](name, f, override = false) {
        if (!override && this.hasOwnProperty(name)) {
            throw new Error(`A property ${name} exists already on ${this}.`);
        }
        this[name] = f;
        return this;
    },

    [extensibleSymbols.removeMethod](name) {
        if (!this[name]) {
            throw new Error(`A property ${name} does not exist on ${this}.`);
        }
        delete this[name];
        return this;
    },

    [extensibleSymbols.addPlugin](plugin) {
        plugin.register(this);
        return this;
    },

    [extensibleSymbols.removePlugin](plugin) {
        plugin.unregister(this);
        return this;
    }
};

/**
 * In addition to everything {@link extensibleMixin} offers this mixin also
 * provides an easier to use interface. It adds methods with names that
 * correspond to the keys in {@link extensibleSymbols}.
 *
 * @type {Object}
 *
 * @example
 * Object.assign(MyClass.prototype, extensibleMixin);
 * let myObject = new MyClass(),
 * myObject.addMethod("toString", () => "Hi");
 */
export const extensibleExtendedMixin = Object.assign({
    addMethod:    extensibleMixin[extensibleSymbols.addMethod],
    removeMethod: extensibleMixin[extensibleSymbols.removeMethod],
    addPlugin:    extensibleMixin[extensibleSymbols.addPlugin],
    removePlugin: extensibleMixin[extensibleSymbols.removePlugin]
}, extensibleMixin);
// for (let [k, v] of Object.entries(extensibleSymbols)) {
//     extensibleExtendedMixin[k] = extensibleMixin[v];
// }


// /**
//  * An interface for every object that can be extended by plugins.
//  *
//  * @interface
//  */
// class Extensible {

//     /**
//      * Adds the given method to this object.
//      *
//      * @param {String|Symbol} name
//      * The name of the method.
//      *
//      * @param {Function} f
//      * The function to execute.
//      *
//      * @abstract
//      */
//     [extensibleSymbols.addMethod](name, f) {}

//     /**
//      * Removes the method with the given name from this object.
//      *
//      * @param {String|Symbol} name
//      * The name of the function to remove.
//      *
//      * @abstract
//      */
//     [extensibleSymbols.removeMethod](name) {}

//     /**
//      * Adds the given plugins to this object by calling the register method on
//      * each plugin and passing this object as an argument.
//      *
//      * @param {Plugin} plugins
//      * The plugins to add.
//      *
//      * @abstract
//      */
//     [extensibleSymbols.addPlugin](plugin) {}

//     /**
//      * Removes the given plugins from this object by calling the unregister method
//      * on each plugin and passing this object as an argument.
//      *
//      * @param {Plugin} plugins
//      * The plugins to remove.
//      *
//      * @abstract
//      */
//     [extensibleSymbols.removePlugin](plugin) {}
// }