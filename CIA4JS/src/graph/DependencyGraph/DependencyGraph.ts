import { DependencyType } from '../../type/DependencyType';
import { Node } from './Node';
import { NodeType } from "../../type/NodeType";
import { Edge } from './Edge';
import { CallNode } from '../DependencyNode/CallNode';
import { TypeReferenceNode } from '../DependencyNode/TypeReferenceNode';
export class DependencyGraph {
    root: Node;
    nodes: Array<Node> = [];
    edges: Array<Edge> = [];

    constructor(root: Node) {
        this.root = root;
        this.nodes.push(root);
    }

    addNode(node: Node) {
        this.nodes.push(node);
    }

    addEdge(edge: Edge) {
        this.edges.push(edge);
    }

    getNodes() {
        return this.nodes;
    }

    createEdge(sourceNode: Node, targetNode: Node, dependency: DependencyType) {
        let isNewEdge = true;
        this.edges.forEach(edge => {
            if (edge.compareTo(sourceNode, targetNode)) {
                edge.addDependency(dependency);
                isNewEdge = false
            }
        });
        if (isNewEdge) {
            if (dependency === DependencyType.Member) {
                this.addNode(targetNode);
            }
            let newEdge = new Edge(sourceNode, targetNode, dependency);
            this.addEdge(newEdge);
            sourceNode.addOutgoingEdges(newEdge);
            targetNode.addIncomingEdges(newEdge);
        }
        
    }

    printDepGraph(node: Node, indent: number) {
        console.log(' '.repeat(indent) + node.toString());
        for (let child of node.getChildren()) {
            this.printDepGraph(child, indent + 2);
        }
    }

    removeRefNode (node: Node) {
        node.removeChildRefNode()
        for (let child of node.getChildren()) {
            this.removeRefNode(child);
        }
    } 
    
    removeRefNodeInGraph() {
        for (let i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i].getType() === NodeType.Call 
            || this.nodes[i].getType() === NodeType.New
            || this.nodes[i].getType() === NodeType.TypeReference
            || this.nodes[i].getType() === NodeType.Inheritance ) {
              this.nodes.splice(i, 1);
              i--;
            }
        }
        for (let i = 0; i < this.edges.length; i++) {
            if (this.edges[i].getTargetNode().getType() === NodeType.Call 
            || this.edges[i].getTargetNode().getType()  === NodeType.New
            || this.edges[i].getTargetNode().getType()  === NodeType.TypeReference
            || this.edges[i].getTargetNode().getType()  === NodeType.Inheritance ) {
              this.edges.splice(i, 1);
              i--;
            }
        }
    }

    toJSONRootNode() {
        var json = JSON.stringify(this.root, null, 2);
        //console.log(json);
        return JSON.parse(json);
    }

    toJSONDependencies() {
        var dependencies = [];
        for (var edge of this.edges) {
            dependencies.push(edge.toJsonGraph())
        }
        //console.log(JSON.stringify(dependencies, null, 2));
        return dependencies;
    }

    toJSONOrientedDependencies() {
        var isExits: number[] = new Array(this.nodes.length).fill(0);
        var orientedDependencies = [];
        for (var edge of this.edges) {
            if (isExits[edge.sourceNode.getIdNumber()] === 0) {
                var callerNode = edge.sourceNode.getIdNumber()
                var calleeNodes = edge.sourceNode.toJSONCalleeNodes();
                orientedDependencies.push({callerNode: callerNode, calleeNodes: calleeNodes})
                isExits[edge.sourceNode.getIdNumber()]++; 
            }
        }
        //console.log(JSON.stringify(orientedDependencies, null, 2));
        return orientedDependencies;
    }

    toJSONJavaNodes() {
        var javaNodes = [];
        for (var node of this.nodes) {
            javaNodes.push(node.toJSONNode());
        }
        //console.log(JSON.stringify(javaNodes, null, 2));
        return javaNodes
    }
    toJSON() {
        var nodesWeight = new Array(this.nodes.length).fill({weight: 0});
        return {
            rootNode: this.toJSONRootNode(),
            dependencies: this.toJSONDependencies(),
            orientedDependencies: this.toJSONOrientedDependencies(),
            javaNodes: this.toJSONJavaNodes(),
            nodesWeight: nodesWeight,
            jspNode: [],
            propertiesNodes: [],
            totalNodes: this.nodes.length,
            address: this.root.getPath(),
            xmlNodes: []
        }
    }
}