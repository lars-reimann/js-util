import TolkienMap from "./TolkienMap.js";

/**
 * A bidirectional 1 to 1 map.
 */
export default class Tolkien1To1Map extends TolkienMap {

    /**
     * @param {Array} initialValues
     * The initial entries of the map. Those are added to the map in the order
     * specified by the array.
     */
    constructor(initialValues) {
        super(Map, Map, initialValues);
    }

    /**
     * @private
     * @override
     */
    addImp(x, y) {
        this.delete({x});
        this.delete({y});

        this.xToY.set(x, y);
        this.yToX.set(y, x);
    }

    /**
     * @private
     * @override
     */
    deleteX(x) {
        if (this.hasX(x)) {
            const [y] = this.convertXToY(x);
            this.xToY.delete(x);
            this.yToX.delete(y);
            return true;
        }
        return false;
    }

    /**
     * @private
     * @override
     */
    deleteY(y) {
        if (this.hasY(y)) {
            const [x] = this.convertYToX(y);
            this.xToY.delete(x);
            this.yToX.delete(y);
            return true;
        }
        return false;
    }

    /**
     * @private
     * @override
     */
    deletePair(x, y) {
        if (this.hasPair(x, y)) {
            this.xToY.delete(x);
            this.yToX.delete(y);
            return true;
        }
        return false;
    }

    /**
     * @override
     */
    convertXToY(x) {
        if (this.hasX(x)) {
            return [this.xToY.get(x)];
        }
    }

    /**
     * @override
     */
    convertYToX(y) {
        if (this.hasY(y)) {
            return [this.yToX.get(y)];
        }
    }

    /**
     * @private
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