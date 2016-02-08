/**
 * An event that can be fired and then catched by listeners.
 */
export default class Event {

    /**
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
     */
    constructor({source, type, data} = {}) {

        /**
         * The object firing this event.
         *
         * @type {Object}
         */
        this.source = source;

        /**
         * The type of this event.
         *
         * @type {String}
         */
        this.type = type;

        /**
         * Any additional data to associate with this event.
         *
         * @type {*}
         */
        this.data = data;
    }
}
