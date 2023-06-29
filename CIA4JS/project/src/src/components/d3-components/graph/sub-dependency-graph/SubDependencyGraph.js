import {DependencyGraph} from "../DependencyGraph";
import {Node} from "../dependency-graph/Node";
import VIEW_CONFIG_VARIABLES from "../../config/ViewConfig";
import {ViewUtils} from "../../../utils/ViewUtils";
import CentralView from "../../viewers/view-components/CentralView";
import {VIEW_IDS} from "../../viewers/view-components/central/CentralViewTabs";
import ContextMenuOption from "../../../context-menu/ContextMenuOption";
import {
    createNodeContext,
    DV_GRAPH_CONTEXT_OPT1,
    DV_GRAPH_CONTEXT_OPT2, SUB_DV_GRAPH_CONTEXT_OPT1, SUB_DV_GRAPH_CONTEXT_OPT2
} from "../../viewers/view-components/central/ContextMenu";

export class SubDependencyGraph extends DependencyGraph {
    constructor(dataTree, dependencies, view, includesIDMaps, xmlNodeTree) {
        super(dataTree, dependencies, view, includesIDMaps, xmlNodeTree);

        let graph = this;

        this.rootNode = new Node(dataTree, graph);
        // // console.log(this.includesIDMaps)

        let temp = 1;
        this.rootNode.setPosition(VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.ROOT_POSITION.x + temp * 300, 100);
        // this.xmlNodeTree.setPosition(VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.ROOT_POSITION.x + temp * 300, 300);

        this.newNode(this.root, this.view);
    }

    newXmlNode(node) {
        super.newXmlNode(node);

        this.addContextMenu(node);
    }

    newNode(node) {
        super.newNode(node);

        this.addContextMenu(node);
    }

    addContextMenu(node) {
        let graph = this;

        let nodeView = graph.getNodeView(node).select(".title-text");

        if (VIEW_CONFIG_VARIABLES.noSourceCodeListNode.includes(node.data.entityClass)) {
            nodeView.on("contextmenu", function (e) {
                createNodeContext(e, SUB_DV_GRAPH_CONTEXT_OPT2, node);
            });
        } else {
            nodeView.on("contextmenu", function (e) {
                createNodeContext(e, SUB_DV_GRAPH_CONTEXT_OPT1, node);
            });
        }
    }
}