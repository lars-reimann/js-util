import {EventManager} from "@ignavia/util";

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
    addListener(types, f) {}

    removeListener(f) {}
}

/**
 * This is a mixin for Observable behavior if an {@link EventManager} is used.
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

    removeListener(f) {
        this.eventManager.removeListener(f);
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
