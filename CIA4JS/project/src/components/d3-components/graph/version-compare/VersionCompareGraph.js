import * as d3 from "d3";

import VIEW_CONFIG_VARIABLES from "../../config/ViewConfig";
import {
    createNodeContext,
    DV_GRAPH_CONTEXT_OPT3,
    DV_GRAPH_CONTEXT_OPT4
} from "../../viewers/view-components/central/ContextMenu";

import {VersionCompareNode} from "./VersionCompareNode";
import {DependencyGraph} from "../DependencyGraph";
import {VCGraphData} from "../../../data-manager/version-compare-graph/VCGraphData";

export class VersionCompareGraph extends DependencyGraph {
    constructor(dataTree, dependencies, view, includesIDMaps) {
        super(dataTree, dependencies, view, includesIDMaps)

        let graph = this;
        // console.log(dataTree)
        // console.log(graph)
        this.rootNode = new VersionCompareNode(dataTree, graph);
        // console.log(this.rootNode)
        
        // // console.log(this.includesIDMaps)

        let temp = 0;
        this.rootNode.setPosition(VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.ROOT_POSITION.x + temp * 300, 100);
        this.newNode(this.rootNode, this.view);
        // this.expandNode(this.rootNode);
        // this.updateFullLinks();
    }

    newNode(node) {
        super.newNode(node);

        let nodeView = this.getNodeView(node);
        let title = nodeView.select(".title")

        switch (node.status){
            case "changed":
                title.attr("fill", VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.CHANGED_COLOR);
                break;
            case "added":
                title.attr("fill", VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.ADDED_COLOR);
                break;
            case "deleted":
                title.attr("fill", VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.DELETED_COLOR);
                break;
        }
        // console.log(VCGraphData)
        if (VCGraphData.graphData.impactedNodesMap.has(node.data.id)) {
            title.attr("fill", VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.IMPACT_COLOR);
        }
        // console.log()
        this.addContextMenu(node);
        this.updateNode(node);
    }

    addContextMenu(node) {
        let graph = this;

        let nodeView = graph.getNodeView(node);
        nodeView.select(".title-text")
        
        if (VIEW_CONFIG_VARIABLES.noSourceCodeListNode.includes(node.data.entityClass)) {
            nodeView.on("contextmenu", function (e) {
                e.preventDefault();
                e.stopPropagation();

                createNodeContext(e, DV_GRAPH_CONTEXT_OPT4, node);
            });
        } else {
            nodeView.on("contextmenu", function (e) {
                e.preventDefault();
                e.stopPropagation();

                createNodeContext(e, DV_GRAPH_CONTEXT_OPT3, node);
            });
        }
    }

    createChildrenGraphNode(node, children) {
        //get child that is not null or undefined
        let filteredChild = [];
        // console.log(node)
        // console.log(children)

        children.forEach(child => {
            if (child !== null && child !== undefined) {
                filteredChild.push(child);
            }
        })

        let numRow = Math.floor(Math.sqrt(filteredChild.length));

        filteredChild.forEach((child, i) => {
           if (child !== null && child !== undefined) {
               let childNode = new VersionCompareNode(child, node.graph);
               
            // console.log(childNode)

               childNode.parent = node;
               childNode.setPosition(node.x + (i % numRow) * (VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.MIN_WIDTH_NODE + 40),
                   node.y + 50 + Math.floor(i / numRow) * 60);
               node.children.push(childNode);
               this.newNode(childNode);
           }
        });
    }
}