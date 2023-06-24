import { NodeType } from "../../type/NodeType";
import { Node } from "./Node";
export class DefaultNode extends Node {

    constructor(id: string, name: string, path: string, parent: Node | null, type: NodeType, idNumber: number) {
        super(id, name, path, parent, type, idNumber);
    }

    override equals(other: Node) {
            return this.id === other.getId() && this.type === other.getType();
    }
       
    override toString() {    
        return `${this.idNumber} -- ${this.name} -- ${this.type}`;    
    }
}