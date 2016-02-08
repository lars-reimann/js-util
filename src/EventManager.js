import {Event} from "@ignavia/util";

/**
 * A helper class that can manage events and event listeners for other objects.
 * If you want to hide that you are using this class, you can use the provided
 * {@link observableMixin}.
 *
 * @implements {Observable}
 */
export default class EventManager {

    /**
     * A factory method for {@link Event} objects.
     *
     * @param {Object} source
     * The object firing this event.
     *
     * @param {String} type
     * The type of this event.
     *
     * @param {*} data
     * Any additional data to associate with this event.
     *
     * @return {Event}
     * The new Event object.
     */
    static makeEvent(source, type, data) {
        return new Event(source, type, data);
    }

    /**
     *
     */
    constructor() {

        /**
         * Maps from an event type to its listeners.
         *
         * @type {Map<String, Set<Function>>}
         */
        this.typeToListeners = new Map();

        /**
         * Maps from a listener to the types of events it listens to.
         * 
         * @type {Map<Function, Set<String>}
         */
        this.listenerToTypes = new Map();
    }

    /**
     * Adds an event listener to this event manager.
     *
     * @param {Function} f
     * The function that should be executed when the event fires.
     *
     * @param {String|Iterator<String>} types
     * The types of events the function should listen to.
     *
     * @return {EventManager}
     * This event manager to make the method chainable.
     */
    addListener(f, types) {
        if (typeof types === "string") {
            types = [types];
        }

        if (!this.listenerToTypes.has(f)) {
            this.listenerToTypes.set(f, []);
        }
        for (let type of types) {
            if (!this.typeToListeners.has(type)) {
                this.typeToListeners.set(type, new Set());
            }
            this.typeToListeners.get(type).add(f);
            this.listenerToTypes.get(f).add(type);
        }

        return this;
    }

    /**
     * Adds an event listener to this event manager.
     *
     * @param {Function} f
     * The function that should be executed when the event fires.
     *
     * @param {String|Iterator<String>} [types]
     * The types of events the function should listen to.
     *
     * @return {EventManager}
     * This event manager to make the method chainable.
     */
    removeListener(f, types = this.listenerToTypes.get(f)) {
        for (let type of types) {
            this.typeToListeners.get(type).delete(f);
            if (this.typeToListeners.get(type).size === 0) {
                this.typeToListeners.delete(type);
            }
            this.listenerToTypes.get(f).delete(type);
        }

        // Update listener -> types
        this.listenerToTypes.delete(f);

        return this;
    }

    /**
     * Notifies all listeners that are interested in the given event.
     *
     * @param {Event} e
     * The event to fire.
     *
     * @return {EventManager}
     * This event manager to make the method chainable.
     */
    fireEvent(e) {
        const listeners = this.listeners.get(e.type) || [];
        for (let f of listeners) {
            f(e);
        }
        return this;
    }
}
