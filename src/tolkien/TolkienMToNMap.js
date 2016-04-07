import {GumpMap}  from "../gump/gump.js";
import TolkienMap from "./TolkienMap.js";

/**
 * A bidirectional M to N map.
 */
export default class TolkienMToNMap extends TolkienMap {

    /**
     * @param {Array} [initialValues[]]
     * The initial entries of the map. Those are added to the map in the order
     * specified by the array.
     */
    constructor(initialValues = []) {
        super(GumpMap, GumpMap, initialValues);
    }

    /**
     * @private
     * @override
     */
    addImp(x, y) {
        this.xToY.add(x, y);
        this.yToX.add(y, x);
    }

    /**
     * @override
     */
    deleteX(x) {
        if (this.hasX(x)) {
            const ys = this.convertXToY(x);
            this.xToY.delete(x);
            for (const y of ys) {
                this.yToX.delete(y);
            }
            return ys.map(y => [x, y]);
        }
    }

    /**
     * @override
     */
    deleteY(y) {
        if (this.hasY(y)) {
            const xs = this.convertYToX(y);
            this.yToX.delete(y);
            for (const x of xs) {
                this.xToY.delete(x);
            }
            return xs.map(x => [x, y]);
        }
    }

    /**
     * @override
     */
    deletePair(x, y) {
        if (this.hasPair(x, y)) {
            this.xToY.delete(x, y);
            this.yToX.delete(y, x);
            return [[x, y]];
        }
    }

    /**
     * @override
     */
    convertXToY(x) {
        return this.hasX(x) ? [...this.xToY.get(x)] : [];
    }

    /**
     * @override
     */
    convertYToX(y) {
        return this.hasY(y) ? [...this.yToX.get(y)] : [];
    }

    /**
     * @override
     */
    hasPair(x, y) {
        return this.xToY.has(x, y);
    }

    /**
     * @override
     */
    * xs() {
        for (let xPath of this.xToY.paths()) {
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