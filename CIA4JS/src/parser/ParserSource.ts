import * as ts from 'typescript';
import { Node } from '../graph/DependencyGraph/Node';
import { NodeType } from '../type/NodeType';
import { DependencyType } from '../type/DependencyType';
import { Position, SourceCodeNode } from '../graph/SimpleNode/SourceCodeNode';
import { DependencyGraph } from '../graph/DependencyGraph/DependencyGraph';

import { ClassNode } from '../graph/SimpleNode/ClassNode';
import { CallNode } from '../graph/DependencyNode/CallNode';
import { TypeReferenceNode } from '../graph/DependencyNode/TypeReferenceNode';
import { DefaultNode } from '../graph/DependencyGraph/DefaultNode';
import { InheritanceNode } from '../graph/DependencyNode/InheritanceNode';
import { NewNode } from '../graph/DependencyNode/NewNode';
import { ImportNode } from '../graph/DependencyNode/ImportNode';

type ReferenceNode = TypeReferenceNode | CallNode | InheritanceNode | NewNode;

export function getPosition(nodeAST: ts.Node) {
    const sourceFile = nodeAST.getSourceFile();
    const { line: startLine, character: startCol } = ts.getLineAndCharacterOfPosition(sourceFile, nodeAST.getStart());
    const { line: endLine, character: endCol } = ts.getLineAndCharacterOfPosition(sourceFile, nodeAST.getEnd());

    return new Position(startLine + 1, startCol + 1, endLine + 1, endCol);
}

export function getSymbolFromNode(node: ts.Node, typeChecker: ts.TypeChecker): ts.Symbol | undefined {
    const symbol = typeChecker.getSymbolAtLocation(node);
    if (symbol) {
        return symbol;
    }
    return undefined;
}

export function getNameForRefNode(nodeAST: ts.Node) {
    let nodeName = "{anonymous}";
    if (ts.isVariableDeclaration(nodeAST)) {
        ts.forEachChild(nodeAST, (childNodeAST) => {
            if (ts.isIdentifier(childNodeAST)) {
                nodeName = childNodeAST.getText();
            }
        })
    }
    if (ts.isFunctionDeclaration(nodeAST) || ts.isMethodDeclaration(nodeAST) || ts.isClassDeclaration(nodeAST)
    || ts.isTypeAliasDeclaration(nodeAST) || ts.isInterfaceDeclaration(nodeAST) || ts.isImportSpecifier(nodeAST)) {
    if (nodeAST.name) {
        nodeName = nodeAST.name.getText()
    }
}
    return nodeName;
}

export function findNodeName(nodeAST: ts.Node) {
    // Initialize default names for each type case of a Node
    let name = "{anonymous}";
    if (ts.isFunctionExpression(nodeAST) || ts.isArrowFunction(nodeAST)) {
        name = "{anonymousFunction}"
    }
    if (ts.isClassExpression(nodeAST)) {
        name = "{anonymousClass}"
    }
    if (ts.isObjectLiteralElement(nodeAST)) {
        name = "{anonymousObject}"
    }

    if(ts.isConstructorDeclaration(nodeAST)) {
        name = "constructor"
    }

    // Initialize the name for the node if its name is not undefined.
    if (ts.isFunctionDeclaration(nodeAST) || ts.isMethodDeclaration(nodeAST) || ts.isClassDeclaration(nodeAST)
        || ts.isPropertyDeclaration(nodeAST) || ts.isInterfaceDeclaration(nodeAST) || ts.isVariableDeclaration(nodeAST)
        ) {
        if (nodeAST.name) {
            name = nodeAST.name.getText()
        }
    }

    if  (ts.isBinaryExpression(nodeAST.parent) || ts.isPropertyAssignment(nodeAST.parent)/* co the se~ co`n*/) {
        ts.forEachChild(nodeAST.parent, (childNodeAST) => {
            if (ts.isIdentifier(childNodeAST)) {
                name = childNodeAST.getText();
            }
            if (ts.isPropertyAccessExpression(childNodeAST)) {
                name = childNodeAST.getChildAt(1).getText();
            }
        })
    }

    return name;
}

export function getIdentify(nodeAST: ts.Node):ts.Node | undefined {
    let nodeIdentify: ts.Node | undefined = undefined;
    ts.forEachChild(nodeAST, (childNodeAST) => {
        if (ts.isIdentifier(childNodeAST) && nodeIdentify === undefined) 
            nodeIdentify = childNodeAST;
    })
    return nodeIdentify;
}

function getNodeFromReference(node: Node, refNode: ReferenceNode): Node | undefined {
    
    for (let childNode of node.getChildren()) {
        let filePath = childNode.getPath().replace(/\/\//g, "/");
        
        if (childNode instanceof DefaultNode && refNode.refSourceFile.startsWith(filePath)) {
            return getNodeFromReference(childNode, refNode);
        }

        if (childNode instanceof SourceCodeNode && refNode.refPos.equals(childNode.getPosition())) {
            return childNode;
        }

        if (childNode instanceof SourceCodeNode && refNode.refPos.isInside(childNode.getPosition())) {
            return getNodeFromReference(childNode, refNode);
        }
    }
    return undefined;
}

function getNodebyImportNode(node: Node, refNode: ImportNode): Node | undefined {
    for (let childNode of node.getChildren()) {
        let filePath = childNode.getPath();
        //console.log(filePath);
        
        if (childNode instanceof DefaultNode && refNode.refSourceFile.startsWith(filePath)) {
            return getNodebyImportNode(childNode, refNode);
        }

        if (childNode instanceof SourceCodeNode && refNode.refName == childNode.getName()) {
            return childNode;
        }
    }

    return undefined;
}

export function getParentClasses(node: ClassNode): undefined | ClassNode {
    let parentClasses: Array<Node> = [];
    for (let edge of node.getOutgoingEdges()) {
        if (edge.getTargetNode().getType() === NodeType.Class && edge.getDependency(DependencyType.Inheritance) > 0) {
            return edge.getTargetNode() as ClassNode
        }
    }
    return undefined;
}

export function createDependencyEdge(refNode: Node, dep_graph: DependencyGraph, dependencyType: DependencyType) {
    if (dependencyType === DependencyType.Use || dependencyType === DependencyType.Invocation || dependencyType == DependencyType.Inheritance) {
        let targetNode = getNodeFromReference(dep_graph.root, refNode as ReferenceNode);
        
        while(targetNode?.getType() === NodeType.Import) {
            targetNode = getNodebyImportNode(dep_graph.root, targetNode as ImportNode);
        }

        if (targetNode) {
            dep_graph.createEdge(refNode.getParent() as Node, targetNode, dependencyType);
            console.log(`${dependencyType}: "${refNode.getParent()?.toString()}" --> "${targetNode.toString()}"`);
        }
    } 

    if (dependencyType === DependencyType.Override) {
        let nodeClass = refNode as ClassNode;
        let parentClass = getParentClasses(nodeClass);
        if (parentClass) {
            nodeClass.getChildren().forEach(child => {
                if (child.getType() === NodeType.Function || child.getType() === NodeType.Method) {
                    parentClass?.getChildren().forEach(child2 => {
                        if ((child2.getType() === NodeType.Function || child2.getType() === NodeType.Method) && child.getName() === child2.getName()) {
                            dep_graph.createEdge(child, child2, dependencyType);
                            console.log(`${dependencyType}: "${child.toString()}" --> "${child2.toString()}"`);
                        }    
                    })
                }
            });
        }
    }
}

