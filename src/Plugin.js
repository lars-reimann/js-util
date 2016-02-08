import {cloneableSymbols} from "./Cloneable.js";

/**
 * A base class for plugins.
 *
 * @implements {Cloneable}
 */
export default class Plugin {

    /**
     *
     */
    constructor() {}

    /**
     * Adds this plugin to the given object.
     *
     * @param {Object} o
     * The object this plugin should be added to.
     *
     * @abstract
     */
    register(o) {}

    /**
     * Removes this plugin from the given object.
     *
     * @param {Object} o
     * The object this plugin should be removed from.
     *
     * @abstract
     */
    unregister(o) {}

    /**
     * Returns a copy of this plugin. For indexes you usually do not want to
     * copy its internal data structures but just the configuration so it can be
     * added to a new object. By default this method returns this plugin.
     *
     * @return {Plugin}
     * This object.
     */
    [cloneableSymbols.clone]() {
        return this;
    }
}
