import Event from "./Event.js";

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
         * The registered listeners ordered by event type.
         *
         * @type {Map<String, Function[]>}
         */
        this.listeners = new Map();
    }

    /**
     * Adds an event listener to this event manager.
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
     * @return {EventManager}
     * This event manager to make the method chainable.
     */
    addListener(types, f, context) {
        if (typeof types === "string") {
            types = [types];
        }
        if (context) {
            f = f.bind(context);
        }

        for (let type of types) {
            if (!this.listeners.has(type)) {
                this.listeners.set(type, []);
            }
            this.listeners.get(type).push(f);
        }

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
