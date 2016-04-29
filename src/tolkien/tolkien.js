import "babel-regenerator-runtime";

export Tolkien1To1Map from "./Tolkien1To1Map.js";
export Tolkien1ToNMap from "./Tolkien1ToNMap.js";
export TolkienMToNMap from "./TolkienMToNMap.js";

import Tolkien1To1Map from "./Tolkien1To1Map.js";
import Tolkien1ToNMap from "./Tolkien1ToNMap.js";
import TolkienMToNMap from "./TolkienMToNMap.js";

/**
 * Returns the largest map type of the two given maps. In descending order those
 * are TolkienMToNMap, Tolkien1ToNMap and Tolkien1To1Map.
 *
 * @param {TolkienMap} map1
 * The first map.
 *
 * @param {TolkienMap} map2
 * The second map.
 *
 * @return {Function}
 * The constructor of the largest map type.
 */
function maxMapType(map1, map2) {
    if (map1 instanceof TolkienMToNMap || map2 instanceof TolkienMToNMap) {
        return TolkienMToNMap;
    } else if (map1 instanceof Tolkien1ToNMap || map2 instanceof Tolkien1ToNMap) {
        return Tolkien1ToNMap;
    } else {
        return Tolkien1To1Map;
    }
}

/**
 * Composes the given relations. If a relation between A and B and another one
 * between B and C is passed in, this function returns a relation between A and
 * C.
 *
 * @param {Iterable} maps
 * The maps to compose.
 *
 * @return {TolkienMap}
 * The composed relation.
 */
export function compose(maps) {
    return [...maps].reduce((aToB, bToC) => {
        const result = new (maxMapType(aToB, bToC))();
        for (let [a, b] of aToB) {
            for (let c of bToC.convertXToY(b)) {
                result.add(a, c);
            }
        }
        return result;
    });
}