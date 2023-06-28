import {Node} from "../dependency-graph/Node";

export class VersionCompareNode extends Node {
    constructor(data, graph) {
        super(data, graph);
        this.status = data.status;
    }
}