import { NodeType } from "../../type/NodeType";
import { Node } from "../DependencyGraph/Node";
import { SourceCodeNode, Position } from "../SimpleNode/SourceCodeNode";

export class InheritanceNode extends SourceCodeNode {
    readonly refName: string;
    readonly refSourceFile: string;
    readonly refPos: Position;
    readonly refType: NodeType;
    constructor(name: string, parent: Node, pos: Position, 
                refName: string, refSourceFile: string, refPos: Position, refType: NodeType) {
        super(name, parent, pos, NodeType.Inheritance, -1);
        this.refName = refName;
        this.refSourceFile = refSourceFile;
        this.refPos = refPos;
        this.refType = refType;
    }

    override toString() {    
        return `${this.name} -- ${this.type} -- ${this.refName} -- ${this.refSourceFile}
                -- ${this.refPos.toString()} -- ${this.refType}`;    
    }
}