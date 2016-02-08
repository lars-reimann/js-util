import Event               from "./Event.js";
import {observableSymbols} from "./Observable.js";

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
     * @param {Object} p
     * The parameter object.
     *
     * @param {Object} [p.source]
     * The object firing this event.
     *
     * @param {String} [p.type]
     * The type of this event.
     *
     * @param {*} [p.data]
     * Any additional data to associate with this event.
     *
     * @return {Event}
     * The new Event object.
     */
    static makeEvent({source, type, data} = {}) {
        return new Event({source, type, data});
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
     * @param {String|Iterator<String>} [types]
     * The types of events the function should listen to. If this parameter is
     * not specified it will only listen to events without a type.
     *
     * @return {EventManager}
     * This event manager to make the method chainable.
     */
    [observableSymbols.addListener](f, types = []) {
        if (typeof types === "string") {
            types = [types];
        }

        if (!this.listenerToTypes.has(f)) {
            this.listenerToTypes.set(f, new Set());
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
     * Removes an event listener from this event manager.
     *
     * @param {Function} f
     * The listener that should be removed.
     *
     * @param {String|Iterator<String>} [types]
     * The types of events the function should no longer listen to. If this
     * parameter is left empty the listener is removed completely.
     *
     * @return {EventManager}
     * This event manager to make the method chainable.
     */
    [observableSymbols.removeListener](f, types = this.listenerToTypes.get(f)) {
        if (typeof types === "string") {
            types = [types];
        }

        for (let type of types) {
            if (!this.typeToListeners.has(type)) {
                continue;
            }

            this.typeToListeners.get(type).delete(f);
            if (this.typeToListeners.get(type).size === 0) {
                this.typeToListeners.delete(type);
            }
            this.listenerToTypes.get(f).delete(type);
        }

        if (this.listenerToTypes.get(f).size === 0) {
            this.listenerToTypes.delete(f);
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
    [observableSymbols.fireEvent](e) {
        let listeners;
        if (e.type) {
            listeners = this.typeToListeners.get(e.type) || [];
        } else {
            listeners = this.listenerToTypes.keys();
        }
        for (let f of listeners) {
            f(e);
        }
        return this;
    }
}
