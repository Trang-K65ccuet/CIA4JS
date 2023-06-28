import DATA_PARSER from "../DataParser";

import LINK_UTILS from '../../utils/LinksUltis'

import {DependencyGraphTemplate} from "../../d3-components/graph/dependency-graph/DependencyViewTemplate";
import CentralView from '../../d3-components/viewers/view-components/CentralView';
import {VIEW_IDS} from "../../d3-components/viewers/view-components/central/CentralViewTabs";
import {VersionCompareGraph} from "../../d3-components/graph/version-compare/VersionCompareGraph";
import DVGraphData from "./DVGraphData";
import ImpactDataManager from "../impact/ImpactDataManager";
import Utils from "../../utils/BasicUltils";
import DVRightView from "../../d3-components/viewers/view-components/right/DVRightView";

const DVGraphDataManager = {
    parseData: function (data) {
        // console.log(data)
        DVGraphData.graphData = {};
        DVGraphData.graph = {};

        ImpactDataManager.dependencies = data.dependencies;
        ImpactDataManager.javaNodes = data.javaNodes;
        ImpactDataManager.totalNodes = data.totalNodes;

        ImpactDataManager.clearViewData();

        let xmlRootNode = {
            entityClass: "ResourceRootNode",
            idClass: "ResourceNode",
            id: "RESOURCE",
            qualifiedName: "RESOURCE_ROOT",
            uniqueName: "RESOURCE_ROOT",
            name: "RESOURCE",
            children: data.xmlNodes,
        }

        let projectRootNode = {
            id: "PROJECT",
            entityClass: "ProjectRootNode",
            idClass: "ProjectRootNode",
            qualifiedName: "PROJECT",
            simpleName: "PROJECT",
            uniqueName: "PROJECT",
            dependencyTo: [],
            dependencyFrom: [],
            children: [
                data.rootNode,
                //xmlRootNode
            ]
        };

        if(xmlRootNode.children) { 
            if(localStorage.getItem('language') == "java") {
                projectRootNode.children.push(xmlRootNode);
            }
        }
           

        DVGraphData.graphData.dataTree = DATA_PARSER.parseNode(projectRootNode, 0, []);

        DVGraphData.graphData.dataNodeList = DATA_PARSER.collectAllNodes(DVGraphData.graphData.dataTree);

        // DVGraphData.graphData.dependencyList = LINK_UTILS.preprocessDependencyList(data.dependencies)
        DVGraphData.graphData.dependencyList = data.orientedDependencies;

        DVGraphData.graphData.includesIdsMap = DATA_PARSER.createIncludesIdMap(
            DVGraphData.graphData.dataNodeList
        );

        // DVGraphData.graphData.nodeMap = new Map(DVGraphData.graphData.dataNodeList.map(i => [i.id, i]));

        // console.log(DVGraphData.graphData)
    },
    generateDVGraph() {
        DVGraphData.graph = new DependencyGraphTemplate(
            DVGraphData.graphData.dataTree,
            DVGraphData.graphData.dependencyList,
            CentralView.getTab(VIEW_IDS.DEPENDENCY_VIEW_ID).view,
            DVGraphData.graphData.includesIdsMap,
        );
        DVRightView.updateDependencyList(DVGraphData.graph.linkData);

        let size = 1211
        let nodeLevel = 1
        if(DVGraphData.graphData.dependencyList !== undefined 
            && DVGraphData.graphData.dependencyList !== null) {
                size = DVGraphData.graphData.dependencyList.length;
        }
        nodeLevel = size < 2000 ? 3 : 2;

        DVGraphData.graph.recursiveExpandNodeByNodeLevel(DVGraphData.graph.root, nodeLevel);
        DVGraphData.graph.updateFullLinks();
    },
    clearData() {
        DVGraphData.graphData = null;
        DVGraphData.graph = null;
    }
}

export default DVGraphDataManager;