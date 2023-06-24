import { NodeType } from "../../type/NodeType";
import { Node } from "../DependencyGraph/Node";

export class Position {
    readonly startColumn: number
    readonly startLine: number
    readonly endColumn: number
    readonly endLine: number
    constructor(startLine: number, startColumn: number, endLine: number, endColumn: number) {
        this.startColumn = startColumn;
        this.startLine = startLine;
        this.endColumn = endColumn;
        this.endLine = endLine;
    }

    equals(otherPos: Position) {
        return this.startColumn === otherPos.startColumn
            && this.endColumn === otherPos.endColumn
            && this.startLine === otherPos.startLine
            && this.endLine === otherPos.endLine
    }

    isInside(otherPos: Position) {
        return (this.startLine > otherPos.startLine || (this.startLine == otherPos.startLine && this.startColumn > otherPos.startColumn))
            && (this.endLine < otherPos.endLine || (this.endLine == otherPos.endLine && this.endLine > otherPos.endLine));
    }


    toStringId() {
        return `${this.startLine}${this.startColumn}${this.endLine}${this.endColumn}`
    }

    toString() {
        return `Start at: (${this.startLine}, ${this.startColumn}) ; End at: (${this.endLine}, ${this.endColumn})`;
    }
}

export class SourceCodeNode extends Node {
    private readonly pos: Position

    constructor(name: string, parent: Node, pos: Position, type: NodeType, idNumber: number) {
        super(parent.getId() + '//' + name + '{' + pos.toStringId() + '}', name, parent.getPath(), parent, type, idNumber);
        this.pos = pos;
    }

    getPosition() {
        return this.pos;
    }

    override equals(other: Node) {
        if (other instanceof SourceCodeNode) {
            return this.id === other.getId() && this.type === other.getType() && this.pos.equals(other.getPosition());
        }
        return false;
    }

    override toString() {
        return `${this.idNumber} -- ${this.id} -- ${this.type} -- ${this.pos.toString()}`;
    }
}