import { NodeType } from "../../type/NodeType";
import { Node } from "../DependencyGraph/Node";
import { SourceCodeNode, Position } from "./SourceCodeNode";

export class ClassNode extends SourceCodeNode {
    constructor(name: string, parent: Node, pos: Position, idNumber: number) {
        super(name, parent, pos, NodeType.Class, idNumber);
    }

}