import EventManager              from "./EventManager.js";
import {extendedObservableMixin} from "./Observable.js";

/**
 * Bundles multiples possible values into one.
 *
 * @implements {Observable}
 */
export default class GumpSet extends Set {

    /**
     *
     */
    constructor() {
        super();

        this.eventManager = new EventManager();
    }

    add(value) {
        const sizeBefore = this.size;
        super.add(value);
        const sizeAfter = this.size;

        if (sizeBefore === sizeAfter) {
            this.fireEvent(EventManager.makeEvent({
                source: this,
                type: "add",
                data: value
            }));
        }
    }

    clear() {
        const values = [...this.values()];
        super.clear();

        if (values.length > 0) {
            this.fireEvent(EventManager.makeEvent({
                source: this,
                type: "clear",
                data: values
            }));
        }
    }

    delete(value) {
        const somethingWasRemoved = super.delete(value);

        if (somethingWasRemoved) {
            this.fireEvent(EventManager.makeEvent({
                source: this,
                type: "delete",
                data: value
            }));
        }
    }

    /**
     * Replaces the old value in the set with the new one.
     *
     * @param {*} oldValue
     * The value to replace.
     *
     * @param {*} newValue
     * The new value.
     *
     * @return {GumpSet}
     * This set to make the method chainable.
     */
    updateWithLiteral(oldValue, newValue) {
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
     * @param {*} value
     * The value to change.
     *
     * @return {GumpSet}
     * This set to make the method chainable.
     */
    updateWithFunction(f, value) {
        if (this.has(value)) {
            this.delete(value);
            this.add(f(value));
        }

        return this;
    }
}

// Make GumpSets observable
Object.assign(GumpSet.prototype, extendedObservableMixin);