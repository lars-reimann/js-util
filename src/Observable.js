/**
 * Contains symbols for the methods of the Observable interface.
 *
 * @type {Object}
 */
export const observableSymbols = {
    addListener:    Symbol("addListener"),
    removeListener: Symbol("removeListener"),
    fireEvent:      Symbol("fireEvent")
};

/**
 * This is a mixin for Observable behavior if an {@link EventManager} is used.
 * The event manager must be reachable by this.eventManager. This mixin can be
 * used to facade the use of an EventManager.
 *
 * @type {Object}
 *
 * @example
 * Object.assign(MyClass.prototype, observableMixin);
 * let myObject = new MyClass(),
 * myObject[observableSymbols.addListener](() => console.log("Called"), "update");
 */
export const observableMixin = {
    [observableSymbols.addListener](f, types) {
        this.eventManager[observableSymbols.addListener](f, types);
        return this;
    },

    [observableSymbols.removeListener](f, types) {
        this.eventManager[observableSymbols.removeListener](f, types);
        return this;
    },

    [observableSymbols.fireEvent](e) {
        this.eventManager[observableSymbols.fireEvent](e);
        return this;
    }
};

/**
 * In addition to everything {@link observableMixin} offers this mixin also
 * provides an easier to use interface. It adds methods with names that
 * correspond to the keys in {@link observableSymbols}.
 *
 * @type {Object}
 *
 * @example
 * Object.assign(MyClass.prototype, observableExtendedMixin);
 * let myObject = new MyClass(),
 * myObject.addListener(() => console.log("Called"), "update");
 */
export const observableExtendedMixin = Object.assign({
    addListener:    observableMixin[observableSymbols.addListener],
    removeListener: observableMixin[observableSymbols.removeListener],
    fireEvent:      observableMixin[observableSymbols.fireEvent]
}, observableMixin);

// /**
//  * An interface for every object that allows listeners to be attached to it.
//  *
//  * @interface
//  */
// class Observable {
//
//     /**
//      * Adds an event listener to this object.
//      *
//      * @param {Function} f
//      * The function that should be executed when the event fires.
//      *
//      * @param {String|Iterator<String>} [types]
//      * The types of events the function should listen to.
//      *
//      * @abstract
//      */
//     [observableSymbols.addListener](f, types) {}
//
//     /**
//      * Removes an event listener from this object.
//      *
//      * @param {Function} f
//      * The listener that should be removed.
//      *
//      * @param {String|Iterator<String>} [types]
//      * The types of events the function should no longer listen to.
//      *
//      * @abstract
//      */
//     [observableSymbols.removeListener](f, types) {}
//
//     /**
//      * Notifies all listeners that are interested in the given event.
//      *
//      * @param {Event} e
//      * The event to fire.
//      */
//     [observableSymbols.fireEvent](e) {}
// }
