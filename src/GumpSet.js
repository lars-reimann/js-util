import EventManager              from "./EventManager.js";
import {observableExtendedMixin} from "./Observable.js";

/**
 * Bundles multiples possible values into one.
 *
 * @implements {Observable}
 */
export default class GumpSet {

    /**
     * @param {Iterable} [initialValues=[]]
     * The initial values of the set.
     */
    constructor(initialValues = []) {

        /**
         * Contains the values of this set.
         *
         * @type {Set}
         * @private
         */
        this.children = new Set(initialValues); // TODO remove this.children with super once subclassing is supported

        /**
         * Handles listeners.
         *
         * @type {EventManager}
         * @private
         */
        this.eventManager = new EventManager();
    }

    /**
     * Adds the given value to this set.
     *
     * @param {*} value
     * The value to add.
     *
     * @return {GumpSet}
     * This set to make the method chainable.
     *
     * @emits {Event}
     * If the set was changed by this operation, an event is fired. The source
     * is set to this set, the type is "add" and the data is the added value.
     */
    add(value) {
        const sizeBefore = this.size;
        this.children.add(value);
        const sizeAfter = this.size;

        if (sizeBefore !== sizeAfter) {
            this.fireEvent(EventManager.makeEvent({
                source: this,
                type: "add",
                data: value
            }));
        }

        return this;
    }

    /**
     * Empties the complete set.
     *
     * @emits {Event}
     * If the set was changed, an event is fired. The source is set to this set,
     * the type is "clear" and the data is an array with the deleted values.
     */
    clear() {
        const values = [...this.values()];
        this.children.clear();

        if (values.length > 0) {
            this.fireEvent(EventManager.makeEvent({
                source: this,
                type: "clear",
                data: values
            }));
        }
    }

    /**
     * Removes the given value from this set.
     *
     * @param {*} value
     * The value to remove.
     *
     * @return {Boolean}
     * Whether the set was changed by this operation. If the given value did
     * not exist in the set false is returned. Otherwise the result is true.
     *
     * @emits {Event}
     * If the set was changed, an event is fired. The source is set to this
     * set, the type is "delete" and the data is the deleted value.
     */
    delete(value) {
        const hasChanged = this.children.delete(value);

        if (hasChanged) {
            this.fireEvent(EventManager.makeEvent({
                source: this,
                type: "delete",
                data: value
            }));
        }

        return hasChanged;
    }

    // ------ Begin remove once subclassing set is supported
    get size() {
        return this.children.size;
    }

    entries() {
        return this.children.entries();
    }

    has(value) {
        return this.children.has(value);
    }

    keys() {
        return this.children.keys();
    }

    values() {
        return this.children.values();
    }
    // ------ End remove

    /**
     * Replaces the old value in the set with the new one.
     *
     * @param {*} newValue
     * The new value.
     *
     * @param {*} oldValue
     * The value to replace.
     *
     * @return {GumpSet}
     * This set to make the method chainable.
     */
    updateWithLiteral(newValue, oldValue) {
        if (this.has(oldValue)) {
            this.delete(oldValue);
            this.add(newValue);
        }

        return this;
    }

    /**
     * Replaces the given value with the result of calling f on it.
     *
     * @param {Function} f
     * The update function.
     *
     * @param {*} [value]
     * The value to change.
     *
     * @return {GumpSet}
     * This set to make the method chainable.
     */
    updateWithFunction(f, value) {
        return this.updateWithLiteral(f(value), value);
    }

    /**
     * Returns a string representing the set.
     *
     * @return {String}
     * A string representation of this set.
     */
    toString() {
        let s = "{";

        let i = this.size - 1;
        for (let v of this.values()) {
            s += v + (i === 0 ? "" : ", ");
            i--;
        }

        return s + "}";
    }
}

// Make GumpSets observable
Object.assign(GumpSet.prototype, observableExtendedMixin);
