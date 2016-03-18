import _ from "lodash";

export default class IterableIterator {
    constructor(iterator) {
        this.before = [];
        this.iterator = iterator;
    }
}