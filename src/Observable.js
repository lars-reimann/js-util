import EventManager from "./EventManager.js";

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
     * @param {Object} [context]
     * The object this should refer to inside f.
     *
     * @return {Object}
     * This object to make the method chainable.
     *
     * @abstract
     */
    addListener(types, f, context) {}
}

/**
 * This is a mixin for observable behavior if an {@link EventManager} is used.
 * Several assumptions are made: The event manager must be reachable by
 * this.eventManager and the EventManager class must be imported under this
 * exact name. This mixin can be used to facade the use of an EventManager.
 *
 * @type {Object}
 */
export const observableMixin = {
    addListener(types, f, context) {
        this.eventManager.addListener(types, f, context);
        return this;
    },

    fireEvent(type, data) {
        const e = EventManager.makeEvent(this, type, data);
        this.eventManager.fireEvent(e);
    },

    bubbleEvent(e, newType) {
        if (newType) {
            e = EventManager.makeEvent(e.source, newType, e.data);
        }
        this.eventManager.fireEvent(e);
    }
};
