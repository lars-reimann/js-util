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
 * An interface for every object that allows listeners to be attached to it.
 *
 * @interface
 */
export default class Observable {

    /**
     * Adds an event listener to this object.
     *
     * @param {String|Iterator<String>} types
     * The types of events the function should listen to.
     *
     * @param {Function} f
     * The function that should be executed when the event fires.
     *
     * @abstract
     */
    [observableSymbols.addListener](f, types) {}

    /**
     * Adds an event listener to this object.
     *
     * @param {String|Iterator<String>} types
     * The types of events the function should listen to.
     *
     * @param {Function} f
     * The function that should be executed when the event fires.
     *
     * @abstract
     */
    [observableSymbols.removeListener](f, types) {}

    /**
     * Notifies all listeners that are interested in the given event.
     *
     * @param {Event} e
     * The event to fire.
     */
    [observableSymbols.fireEvent](e) {}
}

/**
 * This is a mixin for Observable behavior if an {@link EventManager} is used.
 * The event manager must be reachable by this.eventManager. This mixin can be
 * used to facade the use of an EventManager.
 *
 * @type {Object}
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
