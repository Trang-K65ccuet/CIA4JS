import { NodeType } from "../../type/NodeType";
import { Node } from "../DependencyGraph/Node";
import { SourceCodeNode, Position } from "../SimpleNode/SourceCodeNode"

export class ImportNode extends SourceCodeNode {
    readonly refName: string;
    readonly refSourceFile: string;
    readonly alias: string;
    constructor(name: string, parent: Node, pos: Position, 
                refName: string, alias: string, refSourceFile: string) {
        super(name, parent, pos, NodeType.Import, -1);
        this.refName = refName;
        this.refSourceFile = refSourceFile;
        this.alias = alias;
    }

    override toString() {    
        return `${this.name} -- ${this.type} -- ${this.refName} -- ${this.alias} -- ${this.refSourceFile}`;    
    }
}