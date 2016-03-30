import TolkienMap from "./TolkienMap.js";

/**
 * A bidirectional 1 to 1 map.
 */
export default class Tolkien1To1Map extends TolkienMap {

    /**
     * @param {Array} [initialValues=[]]
     * The initial entries of the map. Those are added to the map in the order
     * specified by the array.
     */
    constructor(initialValues = []) {
        super(Map, Map, initialValues);
    }

    /**
     * @private
     * @override
     */
    addImp(x, y) {
        this.deleteX(x);
        this.deleteY(y);

        this.xToY.set(x, y);
        this.yToX.set(y, x);
    }

    /**
     * @override
     */
    deleteX(x) {
        if (this.hasX(x)) {
            const [y] = this.convertXToY(x);
            this.xToY.delete(x);
            this.yToX.delete(y);
            return [[x, y]];
        }
    }

    /**
     * @override
     */
    deleteY(y) {
        if (this.hasY(y)) {
            const [x] = this.convertYToX(y);
            this.xToY.delete(x);
            this.yToX.delete(y);
            return [[x, y]];
        }
    }

    /**
     * @override
     */
    deletePair(x, y) {
        if (this.hasPair(x, y)) {
            this.xToY.delete(x);
            this.yToX.delete(y);
            return [[x, y]];
        }
    }

    /**
     * @override
     */
    convertXToY(x) {
        return this.hasX(x) ? [this.xToY.get(x)] : [];
    }

    /**
     * @override
     */
    convertYToX(y) {
        return this.hasY(y) ? [this.yToX.get(y)] : [];
    }

    /**
     * @override
     */
    hasPair(x, y) {
        return this.xToY.get(x) === y;
    }

    /**
     * @override
     */
    * xs() {
        yield* this.xToY.keys();
    }

    /**
     * @override
     */
    * entries() {
        yield* this.xToY.entries();
    }
}