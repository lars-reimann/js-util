/**
 * An event that can be fired and then catched by listeners.
 */
export default class Event {

    /**
     * @param {Object} source
     * The object firing this event.
     *
     * @param {String} type
     * The type of this event.
     *
     * @param {*} [data]
     * Any additional data to associate with this event.
     */
    constructor(source, type, data) {

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
