import GumpMap    from "./GumpMap.js";
import TolkienMap from "./TolkienMap.js";

/**
 * A bidirectional 1 to N map.
 */
export default class Tolkien1ToNMap extends TolkienMap {

    /**
     * @param {Array} initialValues
     * The initial entries of the map. Those are added to the map in the order
     * specified by the array.
     */
    constructor(initialValues) {
        super(GumpMap, Map, initialValues);
    }

    /**
     * @private
     * @override
     */
    addImp(x, y) {
        this.delete({y});

        this.xToY.add(x, y);
        this.yToX.set(y, x);
    }

    /**
     * @private
     * @override
     */
    deleteX(x) {
        if (this.hasX(x)) {
            const ys = this.convertXToY(x);
            this.xToY.delete(x);
            for (const y of ys) {
                this.yToX.delete(y);
            }
        }
    }

    /**
     * @private
     * @override
     */
    deleteY(y) {
        if (this.hasY(y)) {
            const x = this.convertYToX(y);
            this.xToY.delete(x);
            this.yToX.delete(y);
        }
    }

    /**
     * @private
     * @override
     */
    deletePair(x, y) {
        if (this.hasPair(x, y)) {
            this.xToY.delete(x, y);
            this.yToX.delete(y);
        }
    }

    /**
     * @override
     */
    convertXToY(x) {
        return this.xToY.get(x);
    }

    /**
     * @override
     */
    convertYToX(y) {
        return this.yToX.get(y);
    }

    /**
     * @private
     * @override
     */
    hasPair(x, y) {
        return this.xToY.has(x, y);
    }

    /**
     * @override
     */
    * xs() {
        for (let xPath of this.xToY.keys()) {
            yield xPath.head();
        }
    }

    /**
     * @override
     */
    * entries() {
        for (let [xPath, y] of this.xToY.entries()) {
            yield [xPath.head(), y];
        }
    }
}