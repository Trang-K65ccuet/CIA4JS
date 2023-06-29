import DATA_PARSER from "../DataParser";
import LINK_UTILS from "../../utils/LinksUltis";
import CentralView from "../../d3-components/viewers/view-components/CentralView";
import {VIEW_IDS} from "../../d3-components/viewers/view-components/central/CentralViewTabs";
import {VCGraphData} from "./VCGraphData";
import {VersionCompareGraph} from "../../d3-components/graph/version-compare/VersionCompareGraph";
import DVGraphData from "../dependency-graph/DVGraphData";
import DVRightView from "../../d3-components/viewers/view-components/right/DVRightView";

function parseData(data) {
    VCGraphData.graphData = {};
    VCGraphData.graph = {};

    let projectRootNode = {
        id: "PROJECT_ROOT",
        entityClass: "ProjectRootNode",
        idClass: "ProjectRootNode",
        qualifiedName: "PROJECT",
        simpleName: "PROJECT",
        uniqueName: "PROJECT",
        dependencyTo: [],
        dependencyFrom: [],
        children: [
            data.rootNode
        ]
    };

    VCGraphData.graphData.dataTree = DATA_PARSER.parseNode(projectRootNode, 0, []);
    // console.log(VCGraphData.graphData.dataTree)

    VCGraphData.graphData.dataNodeList = DATA_PARSER.collectAllNodes(
        VCGraphData.graphData.dataTree
    );
    console.log(VCGraphData.graphData.dataNodeList)

    VCGraphData.graphData.dependencyList = LINK_UTILS.getDependenciesOfAllNodes(
        VCGraphData.graphData.dataNodeList
    );

    VCGraphData.graphData.addedNodes = data.addedNodes;
    VCGraphData.graphData.changedNodes = data.changedNodes;
    VCGraphData.graphData.deletedNodes = data.deletedNodes;

    VCGraphData.graphData.includesIdsMap = DATA_PARSER.createIncludesIdMap(
        VCGraphData.graphData.dataNodeList
    );

    // VCGraphData.graphData.nodeMap = new Map(VCGraphData.graphData.dataNodeList.map(i => [i.id, i]));

    let impactedNodes;
    if (data.impactedNodes) {
        impactedNodes = data.impactedNodes;
    } else {
        impactedNodes = [];
    }
    VCGraphData.graphData.impactedNodesMap = new Map(impactedNodes.map(node => [node.id, {
        nodeWeight: node,
        data: VCGraphData.graphData.includesIdsMap.get(node.id).data
    }]));

    // console.log(VCGraphData.graphData)
}

function generateVCGraph() {
    VCGraphData.graph = new VersionCompareGraph(VCGraphData.graphData.dataTree,
        VCGraphData.graphData.dependencyList,
        CentralView.getTab(VIEW_IDS.VERSION_COMPARE_ID).view,
        VCGraphData.graphData.includesIdsMap);

        let size = 1211
        let nodeLevel = 1
        if(VCGraphData.graphData.dependencyList !== undefined 
            && VCGraphData.graphData.dependencyList !== null) {
                size = VCGraphData.graphData.dependencyList.length;
        }
        nodeLevel = size < 2000 ? 3 : 2;

    // DVGraphData.graph.recursiveExpandNodeByNodeLevel(VCGraphData.graph.root, nodeLevel);
    // DVGraphData.graph.updateFullLinks();
    VCGraphData.graph.recursiveExpandNodeByNodeLevel(VCGraphData.graph.root, nodeLevel);
    VCGraphData.graph.updateFullLinks();
}

function clearData() {
    VCGraphData.graphData = null;
    VCGraphData.graph = null;
}

export const VCDataManager = {
    parseData,
    clearData,
    generateVCGraph
}