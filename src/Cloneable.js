/**
 * An interface for every object that can be cloned.
 *
 * @interface
 */
export default class Cloneable {
    clone() {}
}

/**
 * This is a mixin for extensible behavior.
 *
 * @type {Object}
 * @todo
 */
export const cloneableMixin = {
    clone() {
        return this; // TODO maybe use a more sophisticated method that goes through all properties of an object
    }
};
