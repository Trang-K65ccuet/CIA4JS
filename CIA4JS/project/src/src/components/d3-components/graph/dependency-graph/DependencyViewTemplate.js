import VIEW_CONFIG_VARIABLES from "../../config/ViewConfig";
import { Node } from "./Node";

import {DependencyGraph} from "../DependencyGraph";
import NodeEvent from "../NodeEvent";
import JAVA_TYPE from "../../config/JavaType";
import {ViewUtils} from "../../../utils/ViewUtils";
import ContextMenuOption from "../../../context-menu/ContextMenuOption";
import NodeInforUltils from "../../../utils/NodeInforUltils";
import XML_TYPE from "../../config/XmlType";
import Utils from "../../../utils/BasicUltils";
import CentralView from "../../viewers/view-components/CentralView";
import {VIEW_IDS} from "../../viewers/view-components/central/CentralViewTabs";
import * as d3 from "d3";
import ViewConfig from "../../config/ViewConfig";
import ImpactDataManager from "../../../data-manager/impact/ImpactDataManager";
import DVRightView from "../../viewers/view-components/right/DVRightView";
import {
    createNodeContext,
    DV_GRAPH_CONTEXT_OPT1,
    DV_GRAPH_CONTEXT_OPT2
} from "../../viewers/view-components/central/ContextMenu";
import DVGraphData from "../../../data-manager/dependency-graph/DVGraphData";

export class DependencyGraphTemplate extends DependencyGraph {
    constructor(dataTree, dependencies, view, includesIDMaps, xmlNodeTree) {
        super(dataTree, dependencies, view, includesIDMaps, xmlNodeTree);

        let graph = this;

        this.rootNode = new Node(dataTree, graph);
        // // console.log(this.includesIDMaps)

        let temp = 1;
        this.rootNode.setPosition(VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.ROOT_POSITION.x + temp * 300, 100);
        // this.xmlNodeTree.setPosition(VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.ROOT_POSITION.x + temp * 300, 300);

        this.newNode(this.root, this.view);
        // this.expandNode(this.root)
    }

    addNodeToChangeSet(node) {
        // console.log(node);
        let nodeTitle = d3.select("#dependency-g")
            .select(`#id${node.data.id}`)
            .select(".title");

        nodeTitle.attr("fill", ViewConfig.FULLGRAPH_CONFIG.CHANGED_COLOR);

        ImpactDataManager.changeSet.set(node.data.id, node);

        DVRightView.updateChangeViewNodes();
    }

    changeColorOfChangeNode(node) {
        let nodeTitle = d3.select("#dependency-g")
            .select(`#id${node.data.id}`)
            .select(".title");

        if (ImpactDataManager.changeSet.get(node.data.id) !== undefined) {
            nodeTitle.attr("fill", ViewConfig.FULLGRAPH_CONFIG.CHANGED_COLOR);
        } else {
            nodeTitle.attr("fill", ViewConfig.FULLGRAPH_CONFIG.TITLE_COLOR);
        }
    }

    changeColorOfImpactNode(node) {
        let nodeTitle = d3.select("#dependency-g")
            .select(`#id${node.data.id}`)
            .select(".title");

        if (ImpactDataManager.impactSet.get(node.data.id) !== undefined) {
            nodeTitle.attr("fill", ViewConfig.FULLGRAPH_CONFIG.IMPACT_COLOR);
        } else {
            if (ImpactDataManager.changeSet.get(node.data.id) !== undefined) {
                nodeTitle.attr("fill", ViewConfig.FULLGRAPH_CONFIG.CHANGED_COLOR);
            } else {
                nodeTitle.attr("fill", ViewConfig.FULLGRAPH_CONFIG.TITLE_COLOR);
            }
        }
    }

    newXmlNode(node) {
        super.newXmlNode(node);

        this.addContextMenu(node);

        this.changeColorOfChangeNode(node)
        this.changeColorOfImpactNode(node)
    }

    newNode(node) {
        super.newNode(node);

        this.addContextMenu(node);

        this.changeColorOfChangeNode(node)
        this.changeColorOfImpactNode(node)
    }

    addContextMenu(node) {
        let graph = this;

        let nodeView = graph.getNodeView(node);
        nodeView.select(".title-text")

        if (VIEW_CONFIG_VARIABLES.noSourceCodeListNode.includes(node.data.entityClass)) {
            nodeView.on("contextmenu", function (e) {
                e.preventDefault();
                e.stopPropagation();

                createNodeContext(e, DV_GRAPH_CONTEXT_OPT2, node);
            });
        } else {
            nodeView.on("contextmenu", function (e) {
                e.preventDefault();
                e.stopPropagation();

                createNodeContext(e, DV_GRAPH_CONTEXT_OPT1, node);
            });
        }
    }

}