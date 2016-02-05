/**
 * An interface for every object that can be extended by plugins.
 *
 * @interface
 */
export default class Extensible {

    /**
     * Adds the given method to this object.
     *
     * @param {String|Symbol} name
     * The name of the new method.
     *
     * @param {Function} f
     * The method to add.
     *
     * @param {Object} [context]
     * The object this should refer to inside f.
     *
     * @return {Object}
     * This object to make the method chainable.
     *
     * @abstract
     */
    addMethod(name, f, context) {}

    /**
     * Adds the given plugins to this object by calling the register method on
     * each plugin and passing this object as an argument.
     *
     * @param {Plugin|Iterator<Plugin>} plugins
     * The plugins to add.
     *
     * @return {Object}
     * This object to make the method chainable.
     *
     * @abstract
     */
    addPlugins(plugins) {}
}

/**
 * This is a mixin for extensible behavior.
 *
 * @type {Object}
 */
export const extensibleMixin = {
    addMethod(name, f, context, override = false) {
        if (context) {
            f = f.bind(context);
        }

        if (!override && this[name]) {
            throw new Error(`A property ${name} exists already on ${this}.`);
        }
        this[name] = f;
        return this;
    },

    addPlugins(plugins) {
        if (plugins instanceof Plugin) {
            plugins = [plugins];
        }

        for (let plugin of plugins) {
            plugin.register(this);
        }

        return this;
    }
};
