import { NodeType } from "../../type/NodeType";
import { Node } from "../DependencyGraph/Node";
import { SourceCodeNode, Position } from "./SourceCodeNode";
import { SyntaxKind } from "typescript";

export class ParameterM {
    readonly identifier: string;
    readonly typeParameter: string;
    readonly pos: Position;

    constructor(identifier: string, typeParameter: string, position: Position) {
        this.identifier = identifier;
        this.typeParameter = typeParameter;
        this.pos = position;
    }

    equal(other: ParameterM) {
        return this.identifier === other.identifier && this.typeParameter === other.typeParameter && this.pos.equals(other.pos)
    }
}
export class MethodNode extends SourceCodeNode {
    readonly parameters: Array<ParameterM> = [];
    constructor(name: string, parent: Node, pos: Position, parameters: Array<ParameterM>, idNumber: number) {
        super(name, parent, pos, NodeType.Method, idNumber);
        this.parameters = parameters;
    }
}