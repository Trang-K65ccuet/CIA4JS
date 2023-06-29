import { NodeType } from "../../type/NodeType";
import { Edge } from "./Edge";
import * as path from 'path';
export abstract class Node {
    protected readonly id: string;
    protected idNumber: number;
    protected readonly name: string;
    protected readonly type: NodeType;
    protected children: Array<Node> = [];
    protected parent: Node | null;
    protected incomingEdges: Array<Edge> = [];
    protected outgoingEdges: Array<Edge> = [];
    public path: string;
    public idClass: string = "JavascriptNode"
    constructor(id: string, name: string, path: string, parent: Node | null, type: NodeType, idNumber: number) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.parent = parent;
        this.path = path;
        this.idNumber = idNumber;
        if (parent !== null) {
            parent.addChildren(this);
        }
    }
    
    setIdNumber(idNumber: number) {
        this.idNumber = idNumber
    }
    getId() {
        return this.id
    } 

    getPath() {
        return path.normalize(this.path).replace(/\\/g, '/');
    }

    setPath(path: string) {
        this.path = path
    }
    getName() {
        return this.name;
    }

    getType() {
        return this.type;
    }

    getChildren() {
        return this.children;
    }

    getParent() {
        return this.parent;
    }

    getOutgoingEdges() {
        return this.outgoingEdges;
    }

    getIdNumber() {
        return this.idNumber;
    }
    addChildren(other: Node) {
        this.children.push(other);
    }
    removeChildRefNode() {
        for (let i = 0; i < this.children.length; i++) {
            if (this.children[i].getType() === NodeType.Call 
            || this.children[i].getType() === NodeType.New 
            || this.children[i].getType() === NodeType.TypeReference
            || this.children[i].getType() === NodeType.Inheritance 
            || this.children[i].getType() === NodeType.Import) {
              this.children.splice(i, 1);
              i--;
            }
        }
        for (let i = 0; i < this.outgoingEdges.length; i++) {
            if (this.outgoingEdges[i].targetNode.getType() === NodeType.Call 
            || this.outgoingEdges[i].targetNode.getType() === NodeType.New 
            || this.outgoingEdges[i].targetNode.getType() === NodeType.TypeReference
            || this.outgoingEdges[i].targetNode.getType() === NodeType.Inheritance 
            || this.outgoingEdges[i].targetNode.getType()=== NodeType.Import) {
              this.outgoingEdges.splice(i, 1);
              i--;
            }
        }
    }
    addIncomingEdges(edge: Edge) {
        this.incomingEdges.push(edge);
    }

    addOutgoingEdges(edge: Edge) {
        this.outgoingEdges.push(edge);
    }

    abstract equals(other: Node): boolean;
    abstract toString(): string;

    // This part to parser JSON for a Node
    toEdgeNode() {
        const { incomingEdges, outgoingEdges, parent, idNumber, id, name, type, children, path, idClass } = this;
        return {
            entityClass: type,
            idClass: idClass,
            id: idNumber,
            qualifiedName: id,
            uniqueName: id,
            simpleName: name,
        };
    }

    toJSONCalleeNodes() {
        var calleeNodes = [];
        for (var edge of this.outgoingEdges) {
            calleeNodes.push(edge.toJsonOrientedDependencies())
        }
        return calleeNodes;
    }
    toJSONNode() {
        const { incomingEdges, outgoingEdges, parent, idNumber, id, name, type, children, path, idClass } = this;
        let dependencyFrom = [];
        for (let x of incomingEdges) {
            if (x.toJsonObject(this) !== null) {
                dependencyFrom.push(x.toJsonObject(this));
            }
            
        }
        let dependencyTo = [];
        for (let x of outgoingEdges) {
            if (x.toJsonObject(this) !== null) {
                dependencyTo.push(x.toJsonObject(this));
            }
        
        }
        var childrenNumber = [];
        for (let child of children) {
            childrenNumber.push(child.getIdNumber())
        }
        let parentNumber;
        if (parent === null) {
            parentNumber = 0;
        } else {
            parentNumber = parent.getIdNumber()
        }
        return {
            entityClass: type,
            idClass: idClass,
            id: idNumber,
            qualifiedName: id,
            uniqueName: id,
            simpleName: name,
            dependencyFrom: dependencyFrom,
            dependencyTo: dependencyTo,
            children: childrenNumber,
            path: path,
            annotates: [],
            annotatesWithValue: [],
            parent: parentNumber
        };
    }
    toJSON() {
        const { incomingEdges, outgoingEdges, parent, idNumber, id, name, type, children, path, idClass } = this;
        let dependencyFrom = [];
        for (let x of incomingEdges) {
            if (x.toJsonObject(this) !== null) {
                dependencyFrom.push(x.toJsonObject(this));
            }
            
        }
        let dependencyTo = [];
        for (let x of outgoingEdges) {
            if (x.toJsonObject(this) !== null) {
                dependencyTo.push(x.toJsonObject(this));
            }
        
        }
        return {
            entityClass: type,
            idClass: idClass,
            id: idNumber,
            qualifiedName: id,
            uniqueName: id,
            simpleName: name,
            dependencyFrom: dependencyFrom,
            dependencyTo: dependencyTo,
            children: children,
            path: path,
            annotates: [],
            annotatesWithValue: [],
            weight: 0
        };
    }
    
}