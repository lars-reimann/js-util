import EventManager              from "./EventManager.js";
import {observableExtendedMixin} from "./Observable.js";

/**
 * Signalizes that a parameter was not supplied.
 *
 * @ignore
 */
const EMPTY = Symbol("default");

/**
 * An abstract class for bidirectional maps. The name is inspired by
 * "The Hobbit or There and Back Again" by J. R. R. Tolkien.
 */
export default class TolkienMap {

    /**
     * @param {Function} XCon
     * The constructor to use for the xToY map.
     *
     * @param {Function} YCon
     * The constructor to use for the yToX map.
     *
     * @param {Array} initialValues
     * The initial entries of the map. Those are added to the map in the order
     * specified by the array.
     */
    constructor(XCon, YCon, initialValues) {

        /**
         * Maps from x-values to y-values.
         *
         * @type {Map|GumpMap}
         * @private
         */
        this.xToY = new XCon();

        /**
         * Maps from y-values to x-values.
         *
         * @type {Map|GumpMap}
         * @private
         */
        this.yToX = new YCon();

        /**
         * Handles events and listeners.
         *
         * @type {EventManager}
         * @private
         */
        this.eventManager = new EventManager();

        // Add initial values
        for (let [x, y] of initialValues) {
            this.add(x, y);
        }
    }

    /**
     * The number of entries in this map.
     *
     * @type {Number}
     */
    get size() {
        return this.xToY.size;
    }

    /**
     * Connects the given values.
     *
     * @param {*} x
     * The x-value.
     *
     * @param {*} y
     * The y-value.
     *
     * @return {TolkienMap}
     * This map to make the method chainable.
     *
     * @emits {Event}
     * If this operation changed the map an event is fired. Its source is this
     * map, the type is "add" and the data is an object containing the provided
     * x and y parameters.
     */
    add(x, y) {
        if (!this.hasPair(x, y)) {
            this.addImp(x, y);
            this.fireEvent(EventManager.makeEvent({
                source: this,
                type:   "add",
                data:   {x, y}
            }));
        }
        return this;
    }

    /**
     * Called by the add template method. Subclasses should implement the actual
     * inclusion of the given pair in this method.
     *
     * @param {*} x
     * The x-value.
     *
     * @param {*} y
     * The y-value.
     *
     * @private
     * @abstract
     */
    addImp(x, y) {
        throw new Error("Calling an abstract method.");
    }

    /**
     * Removes all entries from this map.
     *
     * @emits {Event}
     * If the map was changed by this operation, an event is triggered. The
     * source is this map, the type is "clear" and the data is an array of the
     * deleted entries.
     */
    clear() {
        if (this.size > 0) {
            const deleted = [...this.entries()];

            this.xToY.clear();
            this.yToX.clear();

            this.fireEvent(EventManager.makeEvent({
                source: this,
                type:   "clear",
                data:   deleted
            }));
        }
    }

    /**
     * Removes all entries with the given x-value.
     *
     * @param {*} x
     * The x-value.
     *
     * @abstract
     */
    deleteX(x) {
        throw new Error("Calling an abstract method.");
    }

    /**
     * Removes all entries with the given y-value.
     *
     * @param {*} y
     * The y-value.
     *
     * @abstract
     */
    deleteY(y) {
        throw new Error("Calling an abstract method.");
    }

    /**
     * Removes the entry mapping the x-value to the y-value.
     *
     * @param {*} x
     * The x-value.
     *
     * @param {*} y
     * The y-value.
     *
     * @abstract
     */
    deletePair(x, y) {
        throw new Error("Calling an abstract method.");
    }

    /**
     * Removes the entries with the given x- and y-value. At least one of them
     * must be provided.
     *
     * @param {Object} conf
     * The configuration object.
     *
     * @param {*} [conf.x]
     * The x-value.
     *
     * @param {*} [conf.y]
     * The y-value.
     *
     * @emits {Event}
     * If the map was changed by this operation and event is triggered. Its
     * source is this map, the type is "delete" and the data is an object. It
     * contains the given x- and y-values and it has a property deleted listing
     * the removed entries.
     */
    delete({x = EMPTY, y = EMPTY} = {}) {
        const data = {};
        if (x === EMPTY) {
            data.y = y;
            data.deleted = this.deleteY(y);
        } else if (y === EMPTY) {
            data.x = x;
            data.deleted = this.deleteX(x);
        } else {
            data.x = x;
            data.y = y;
            data.deleted = this.deletePair(x, y);
        }

        if (data.deleted) {
            this.fireEvent(EventManager.makeEvent({
                source: this,
                type:   "delete",
                data:   data
            }));
        }
    }

    /**
     * Returns the y-values that correspond to x.
     *
     * @param {*} x
     * The x-value.
     *
     * @return {Array}
     * An array of the corresponding y-values.
     *
     * @abstract
     */
    convertXToY(x) {
        throw new Error("Calling an abstract method.");
    }

    /**
     * Returns the x-value that correspond to y.
     *
     * @param {*} y
     * The y-value.
     *
     * @return {Array}
     * An array of the corresponding x-values.
     *
     * @abstract
     */
    convertYToX(y) {
        throw new Error("Calling an abstract method.");
    }

    /**
     * Tests if an entry with the given x-value exists.
     *
     * @param {*} x
     * The x-value.
     * 
     * @return {Boolean}
     * If an entry with the given x-value exists.
     */
    hasX(x) {
        return this.xToY.has(x);
    }

    /**
     * Tests if an entry with the given y-value exists.
     *
     * @param {*} y
     * The y-value.
     *
     * @return {Boolean}
     * If an entry with the given y-value exists.
     */
    hasY(y) {
        return this.yToX.has(y);
    }

    /**
     * Tests if an entry with the given x- and y-value exists.
     *
     * @param {*} x
     * The x-value.
     *
     * @param {*} y
     * The y-value.
     *
     * @return {Boolean}
     * If an entry with the given x- and y-value exists.
     */
    hasPair(x, y) {
        throw new Error("Calling an abstract method.");
    }
    
    /**
     * Tests if an entry with the given x-value or the given y-value exists.
     * 
     * @param {*} x
     * The x-value.
     * 
     * @param {*} y
     * The y-value.
     * 
     * @return {Boolean}
     * If an entry with the given x-value or the given y-value exists.
     */
    hasEither(x, y) {
        return this.hasX(x) || this.hasY(y);
    }

    /**
     * Tests if an entry with the given x- and y-values exists. At least one of
     * them must be provided.
     *
     * @param {Object} conf
     * The configuration object.
     *
     * @param {*} [conf.x]
     * The x-value.
     *
     * @param {*} [conf.y]
     * The y-value.
     * 
     * @return {Boolean}
     * If an entry with the given x- and y-values exists.
     */
    has({x = EMPTY, y = EMPTY} = {}) {
        if (x === EMPTY) {
            return this.hasY(y);
        } else if (y === EMPTY) {
            return this.hasX(x);
        } else {
            return this.hasPair(x, y);
        }
    }

    /**
     * Removes any previous entries with the given x-value or the given y-value
     * and connect x and y.
     *
     * @param {*} x
     * The x-value.
     *
     * @param {*} y
     * The y-value.
     */
    set(x, y) {
        this.deleteX(x);
        this.deleteY(y);
        this.add(x, y);
    }

    /**
     * Yields all x-values of this map.
     *
     * @abstract
     */
    * xs() {
        throw new Error("Calling an abstract method.");
    }

    /**
     * Yields all y-values of this map.
     */
    * ys() {
        yield* this.xToY.values();
    }

    /**
     * Yields all x-y-entries of this map.
     *
     * @abstract
     */
    * entries() {
        throw new Error("Calling an abstract method.");
    }

    /**
     * Yields all x-y-entries of this map.
     */
    [Symbol.iterator]() {
        return this.entries();
    }
}

// Make TolkienMaps obsservable
Object.assign(TolkienMap.prototype, observableExtendedMixin);