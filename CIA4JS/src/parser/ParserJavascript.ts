import * as ts from 'typescript';
import * as fs from 'fs';
import * as ps from './ParserSource';
import * as cr from './CreateNode';
import { NodeType } from '../type/NodeType';
import { DependencyType } from '../type/DependencyType';
import { DefaultNode } from '../graph/DependencyGraph/DefaultNode';
import { Node } from '../graph/DependencyGraph/Node';
import { DependencyGraph } from '../graph/DependencyGraph/DependencyGraph';

export class ParserJavascript {
  readonly projectPath: string;
  root: Node;
  dep_graph: DependencyGraph;
  fileNames: string[] = [];
  idNumber: number = 0;

  constructor(projectPath: string) {
    this.projectPath = projectPath;
    this.dep_graph = new DependencyGraph(new DefaultNode("{ROOT}", "{ROOT}", projectPath, null, NodeType.Root, this.idNumber));
    this.root = this.dep_graph.root;
  }

  async parser() {
    await this.createFolderOrFileNode(this.root);
    const program = ts.createProgram({
      rootNames: this.fileNames,
      options: {
        target: ts.ScriptTarget.Latest,
        allowJs: true, // Allow TypeScript parser javascript
      },
    });
    this.generateAST(program, this.root);
    console.log("-------------------DEPENDENCIES-----------------------")
    this.generateDependencyEdge();
    this.dep_graph.removeRefNodeInGraph();
    this.dep_graph.removeRefNode(this.dep_graph.root);
    console.log("")
    console.log("-------------------DEP_GRAPH-------------------")
    this.dep_graph.printDepGraph(this.dep_graph.root, 0);
    console.log("-------------------JSON_VIEW----------------------")
    return this.dep_graph.toJSON()
  }

  private async createFolderOrFileNode(parentNode: DefaultNode) {
    const files = await fs.promises.readdir(parentNode.path);

    for (const file of files) {
      const filePath = `${parentNode.path}/${file}`;
      const stats = await fs.promises.stat(filePath);
      if (stats.isFile() && (filePath.endsWith(".js") || filePath.endsWith(".jsx") )) {
        this.fileNames.push(filePath);
        let fileNode = new DefaultNode(filePath, file, filePath, parentNode, NodeType.File, this.idNumber);
        this.dep_graph.addNode(fileNode);
        this.dep_graph.createEdge(parentNode, fileNode, DependencyType.Member);
      }
      if (stats.isDirectory()) {
        let folderNode = new DefaultNode(filePath, file, filePath, parentNode, NodeType.Folder, this.idNumber);
        this.dep_graph.addNode(folderNode);
        this.dep_graph.createEdge(parentNode, folderNode, DependencyType.Member);
        await this.createFolderOrFileNode(folderNode);
      }
    }
  }

  private generateAST(program: ts.Program, node: Node) {
    for (var child of node.getChildren()) {
      this.idNumber++;
      child.setIdNumber(this.idNumber);
      if (child.getType() === NodeType.File) {
        var sourceFile = program.getSourceFile(child.path);
        if (sourceFile) {
          this.traverseAST(sourceFile, program.getTypeChecker(), child);
        } else {
          console.log(`Error: sourceFile ${child.path} is undefined.`)
        }
      }
      if (child.getType() === NodeType.Folder) {
        this.generateAST(program, child);
      }
    }
  }

  private traverseAST(nodeAST: ts.Node, typeChecker: ts.TypeChecker, parentNode: Node) {
    
    if (ts.isFunctionDeclaration(nodeAST)) {
      this.idNumber++;
      let functionNode = cr.createFunctionNode(nodeAST, parentNode, this.dep_graph, this.idNumber)
      if (functionNode) {
        parentNode = functionNode
      }
    }

    if (ts.isVariableDeclaration(nodeAST)) {
      // nodeSavedInformation = ps.getInfoFromVariableDeclaration(nodeAST);
    }
    if (ts.isClassDeclaration(nodeAST)) {
      this.idNumber++;
      let classNode = cr.createClassNode(nodeAST, parentNode, this.dep_graph, this.idNumber)
      if (classNode) {
        parentNode = classNode
      }
    }

    if (ts.isInterfaceDeclaration(nodeAST)) {
      this.idNumber++;
      let interfaceNode = cr.createInterfaceNode(nodeAST, parentNode, this.dep_graph, this.idNumber);
      if (interfaceNode) {
        parentNode = interfaceNode;
      }
    }

    if (ts.isEnumDeclaration(nodeAST)) {
      this.idNumber++;
      let enumNode = cr.createEnumNode(nodeAST, parentNode, this.dep_graph, this.idNumber);
      if (enumNode) {
        parentNode = enumNode;
      }
    }

    if (ts.isPropertyDeclaration(nodeAST)) {
      this.idNumber++;
      let propertyNode = cr.createPropertyNode(nodeAST, parentNode, this.dep_graph, this.idNumber);
      if (propertyNode) {
        parentNode = propertyNode;
      }
    }

    if (ts.isMethodDeclaration(nodeAST)) {
      this.idNumber++;
      let methodNode = cr.createMethodNode(nodeAST, parentNode, this.dep_graph, this.idNumber);
      if (methodNode) {
        parentNode = methodNode;
      }
    }

    if (ts.isVariableDeclaration(nodeAST)) {
      this.idNumber++;
      let varNode = cr.createVariableNode(nodeAST, parentNode, this.dep_graph, this.idNumber);
      if (varNode) {
        parentNode = varNode;
      }
    }

    if (ts.isConstructorDeclaration(nodeAST)) {
      this.idNumber++;
      let varNode = cr.createConstructorNode(nodeAST, parentNode, this.dep_graph, this.idNumber);
      if (varNode) {
        parentNode = varNode;
      }
    }

    if (ts.isCallExpression(nodeAST)) {
      let callNode = cr.createCallNode(nodeAST, parentNode, this.dep_graph, typeChecker);
    }

    if (ts.isNewExpression(nodeAST)) {
      let newNode = cr.createNewNode(nodeAST, parentNode, this.dep_graph, typeChecker);
    }

    if (ts.isTypeReferenceNode(nodeAST) ) {
      let typeReferenceNode = cr.createTypeReferenceNode(nodeAST, parentNode, this.dep_graph, typeChecker);
    }

    if (ts.isExpressionWithTypeArguments(nodeAST) && ts.isHeritageClause(nodeAST.parent)) {
      let inheritanceNode = cr.createInheritanceNode(nodeAST, parentNode, this.dep_graph, typeChecker);
    }

    ts.forEachChild(nodeAST, (childNodeAST) => {
      this.traverseAST(childNodeAST, typeChecker, parentNode);
    });
  }

  private generateDependencyEdge() {
    for (let node of this.dep_graph.getNodes()) {
      if (node.getType() === NodeType.TypeReference) {
        ps.createDependencyEdge(node, this.dep_graph, DependencyType.Use);
      } 

      if (node.getType() === NodeType.Call) {
        console.log(node.getParent()?.getType);
        ps.createDependencyEdge(node, this.dep_graph, DependencyType.Invocation);
      } 

      if (node.getType() === NodeType.New) {
        ps.createDependencyEdge(node, this.dep_graph, DependencyType.Use);
      }
      
      if (node.getType() === NodeType.Inheritance) {
        ps.createDependencyEdge(node, this.dep_graph, DependencyType.Inheritance);
      }
    }

    for (let node of this.dep_graph.getNodes()) {
      if (node.getType() === NodeType.Class) {
        ps.createDependencyEdge(node, this.dep_graph, DependencyType.Override);
      }
    }
  }
}
