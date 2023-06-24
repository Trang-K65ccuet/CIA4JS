import { Node } from "./Node";
import { DependencyType } from "../../type/DependencyType";

export class Edge {
    sourceNode: Node;
    targetNode: Node;
    dependencies: Map<string, number>;

    constructor(sourceNode: Node, targetNode: Node, dependency: DependencyType) {
        this.sourceNode = sourceNode;
        this.targetNode = targetNode;
        this.dependencies = new Map<DependencyType, number>([
            [DependencyType.Use, 0],
            [DependencyType.Invocation, 0],
            [DependencyType.Override, 0],
            [DependencyType.Member, 0],
            [DependencyType.Inheritance, 0]
        ]);
        
        this.dependencies.set(dependency, 1);
    }

    getTargetNode() {
        return this.targetNode;
    }

    getDependency(dependency: DependencyType) : number {
        return this.dependencies.get(dependency) as number;
    }
    
    addDependency(dependency: DependencyType) {
        let currentValue = this.dependencies.get(dependency);
        if (currentValue !== undefined) {
            this.dependencies.set(dependency, currentValue + 1);
        }
    }

    compareTo(sourceNode: Node, targetNode: Node) {        
        return this.sourceNode.equals(sourceNode) && this.targetNode.equals(targetNode);
    }

    // This part to parser JSON for a Node
    toJsonObject(currentNode: Node) {
        if (this.sourceNode.equals(currentNode)) {
            return {
                node: this.targetNode.toEdgeNode(),
                dependency: Object.fromEntries(this.dependencies)
            }
        } 
        if (this.targetNode.equals(currentNode)) {
            return {
                node: this.sourceNode.toEdgeNode(),
                dependency: Object.fromEntries(this.dependencies)
            }
        }
    }

    toJsonGraph() {
        return {
            callerNode: this.sourceNode.getIdNumber(), 
            calleeNode: this.targetNode.getIdNumber(),
            type: Object.fromEntries(this.dependencies),
            weight: 0
        }
    }

    toJsonOrientedDependencies() {
        return {
            node: this.targetNode.getIdNumber(),
            dependency: Object.fromEntries(this.dependencies)
        }
    }
}