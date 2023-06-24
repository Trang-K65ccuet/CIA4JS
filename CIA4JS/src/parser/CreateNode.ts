import * as ts from 'typescript';
import * as ps from './ParserSource';

import { InterfaceNode } from '../graph/SimpleNode/InterfaceNode';
import { EnumNode } from '../graph/SimpleNode/EnumNode';
import { MethodNode, ParameterM } from '../graph/SimpleNode/MethodNode';
import { FunctionNode, Parameter } from '../graph/SimpleNode/FunctionNode';
import { Node } from '../graph/DependencyGraph/Node';
import { DependencyGraph } from '../graph/DependencyGraph/DependencyGraph';
import { NodeType } from '../type/NodeType';
import { DependencyType } from '../type/DependencyType';
import { ClassNode } from '../graph/SimpleNode/ClassNode';
import { CallNode } from '../graph/DependencyNode/CallNode';
import { TypeReferenceNode } from '../graph/DependencyNode/TypeReferenceNode';
import { InheritanceNode } from '../graph/DependencyNode/InheritanceNode';
import { PropertyNode } from '../graph/SimpleNode/PropertyNode';
import { VariableNode } from '../graph/SimpleNode/VariableNode';
import { NewNode } from '../graph/DependencyNode/NewNode';
import { ConstructorNode } from '../graph/SimpleNode/ConstructorNode';

export function createFunctionNode(nodeAST: ts.Node, parentNode: Node, dep_graph: DependencyGraph, idNumber: number) {
    if (!ts.isFunctionDeclaration(nodeAST) && !ts.isFunctionExpression(nodeAST) && !ts.isArrowFunction(nodeAST) && !ts.isMethodDeclaration(nodeAST)) {
        return;
    }

    let parameter = nodeAST.parameters.map((param) => 
        new Parameter(param.name.getText(), 
            param.type ? param.type.getText() : 'any', 
            ps.getPosition(param)
        ));
    let functionName = ps.findNodeName(nodeAST);
    let functionNode = new FunctionNode(
        functionName,
        parentNode,
        ps.getPosition(nodeAST),
        parameter,
        idNumber
    )
    dep_graph.createEdge(parentNode, functionNode, DependencyType.Member);
    //dep_graph.createEdge(functionNode, parentNode, DependencyType.Member);
    return functionNode;
}

export function createClassNode(nodeAST: ts.Node, parentNode: Node, dep_graph: DependencyGraph, idNumber: number) {
    let className = ps.findNodeName(nodeAST);
    let classNode = new ClassNode(
        className,
        parentNode,
        ps.getPosition(nodeAST),
        idNumber
    );
    dep_graph.createEdge(parentNode, classNode, DependencyType.Member);
    //dep_graph.createEdge(classNode, parentNode, DependencyType.Member);
    return classNode;
}

export function createInterfaceNode(nodeAST: ts.Node, parentNode: Node, dep_graph: DependencyGraph, idNumber: number) {
    let interfaceName = ps.findNodeName(nodeAST);

    let interfaceNode = new InterfaceNode(
        interfaceName,
        parentNode,
        ps.getPosition(nodeAST),
        idNumber
    );
    dep_graph.createEdge(parentNode, interfaceNode, DependencyType.Member);
    //dep_graph.createEdge(interfaceNode, parentNode, DependencyType.Member);
    return interfaceNode;
}

export function createEnumNode(nodeAST: ts.Node, parentNode: Node, dep_graph: DependencyGraph, idNumber: number) {
    let enumName = ps.findNodeName(nodeAST);

    let enumNode = new EnumNode(
        enumName,
        parentNode,
        ps.getPosition(nodeAST),
        idNumber
    );
    dep_graph.createEdge(parentNode, enumNode, DependencyType.Member);
    return enumNode;
}

export function createMethodNode(nodeAST: ts.Node, parentNode: Node, dep_graph: DependencyGraph, idNumber: number) {
    if (!ts.isMethodDeclaration(nodeAST)) {
        return;
    }

    let parameter = nodeAST.parameters.map((param) => 
        new ParameterM(param.name.getText(), 
            param.type ? param.type.getText() : 'any', 
            ps.getPosition(param)
        ));
    let methodName = ps.findNodeName(nodeAST);
    let methodNode = new MethodNode(
        methodName,
        parentNode,
        ps.getPosition(nodeAST),
        parameter,
        idNumber
    )
    dep_graph.createEdge(parentNode, methodNode, DependencyType.Member);
    //dep_graph.createEdge(functionNode, parentNode, DependencyType.Member);
    return methodNode;
}

export function createPropertyNode(nodeAST: ts.Node, parentNode: Node, dep_graph: DependencyGraph, idNumber: number) {
    let propertyName = ps.findNodeName(nodeAST);

    let propertyNode = new PropertyNode(
        propertyName,
        parentNode,
        ps.getPosition(nodeAST),
        idNumber
    );
    dep_graph.createEdge(parentNode, propertyNode, DependencyType.Member);
    return propertyNode;
}

export function createVariableNode(nodeAST: ts.Node, parentNode: Node, dep_graph: DependencyGraph, idNumber: number) {
    let varName = ps.findNodeName(nodeAST);

    let varNode = new VariableNode(
        varName,
        parentNode,
        ps.getPosition(nodeAST),
        idNumber
    );
    dep_graph.createEdge(parentNode, varNode, DependencyType.Member);
    return varNode;
}

export function createConstructorNode(nodeAST: ts.Node, parentNode: Node, dep_graph: DependencyGraph, idNumber: number) {
    let conName = ps.findNodeName(nodeAST);

    let conNode = new ConstructorNode(
        conName,
        parentNode,
        ps.getPosition(nodeAST),
        idNumber
    );
    dep_graph.createEdge(parentNode, conNode, DependencyType.Member);
    return conNode;
}

export function createNewNode(nodeAST: ts.Node, parentNode: Node, dep_graph: DependencyGraph, typeChecker: ts.TypeChecker) {
    let newName = "NewNode";
    let nodeIdentify = ps.getIdentify(nodeAST);
    if (nodeIdentify) {
        let symbol = ps.getSymbolFromNode(nodeIdentify, typeChecker);
        if (symbol) {
            const declaration = symbol.getDeclarations();
            if (declaration) {
                let newNode = new NewNode (
                    newName,
                    parentNode,
                    ps.getPosition(nodeAST),
                    ps.getNameForRefNode(declaration[0]),
                    declaration[0].getSourceFile().fileName,
                    ps.getPosition(declaration[0]),
                    NodeType.New
                );
                dep_graph.createEdge(parentNode, newNode, DependencyType.Member);
            }
        }
    }
}

export function createCallNode(nodeAST: ts.Node, parentNode: Node, dep_graph: DependencyGraph, typeChecker: ts.TypeChecker) {
    let callName = "callnode";
    
    let symbol = ps.getSymbolFromNode(nodeAST.getChildAt(0), typeChecker);
    if (symbol) {
        
        //if (symbol2) {console.log(symbol2)}
        //console.log(symbol.valueDeclaration);
        const declaration = symbol.getDeclarations();
        if (declaration) {
            //console.log(symbol);
            let callNode = new CallNode(
                callName,
                parentNode,
                ps.getPosition(nodeAST),
                ps.getNameForRefNode(declaration[0]),
                declaration[0].getSourceFile().fileName,
                ps.getPosition(declaration[0]),
                NodeType.Call);
            dep_graph.createEdge(parentNode, callNode, DependencyType.Member);
            //dep_graph.createEdge(callNode, parentNode, DependencyType.Member);
        }
        
    }
}

export function createTypeReferenceNode(nodeAST: ts.Node, parentNode: Node, dep_graph: DependencyGraph, typeChecker: ts.TypeChecker) {
    let typeReferenceName = "typeReferenceNode";
    let symbol = ps.getSymbolFromNode(nodeAST.getChildAt(0), typeChecker);
    if (symbol) {
        const declaration = symbol.getDeclarations();
        if (declaration) {
            let typeReferenceNode = new TypeReferenceNode(
                typeReferenceName,
                parentNode,
                ps.getPosition(nodeAST),
                ps.getNameForRefNode(declaration[0]),
                declaration[0].getSourceFile().fileName,
                ps.getPosition(declaration[0]),
                NodeType.TypeReference);
            dep_graph.createEdge(parentNode, typeReferenceNode, DependencyType.Member);
            //dep_graph.createEdge(typeReferenceNode, parentNode, DependencyType.Member);
        }
    }
}

export function createInheritanceNode(nodeAST: ts.Node, parentNode: Node, dep_graph: DependencyGraph, typeChecker: ts.TypeChecker) {
    let inheritanceName = "InheritanceNode";
    let symbol =ps. getSymbolFromNode(nodeAST.getChildAt(0), typeChecker);

    if (symbol) {
        const declaration = symbol.getDeclarations();
        if (declaration) {
            let inheritanceNode = new InheritanceNode(
                inheritanceName,
                parentNode,
                ps.getPosition(nodeAST),
                ps.getNameForRefNode(declaration[0]),
                declaration[0].getSourceFile().fileName,
                ps.getPosition(declaration[0]),
                NodeType.Inheritance);
            dep_graph.createEdge(parentNode, inheritanceNode, DependencyType.Member);
            //dep_graph.createEdge(inheritanceNode, parentNode, DependencyType.Member);
        }
    }
}