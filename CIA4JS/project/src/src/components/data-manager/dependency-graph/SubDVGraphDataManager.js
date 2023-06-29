import DATA_PARSER from "../DataParser";
import LINK_UTILS from "../../utils/LinksUltis";
import {DependencyGraphTemplate} from "../../d3-components/graph/dependency-graph/DependencyViewTemplate";
import CentralView from "../../d3-components/viewers/view-components/CentralView";
import {VIEW_IDS} from "../../d3-components/viewers/view-components/central/CentralViewTabs";
import SubDVGraphData from "./SubDVGraphData";
import {SubDependencyGraph} from "../../d3-components/graph/sub-dependency-graph/SubDependencyGraph";
import CiaAPI from "../../../api/CiaAPI";
import ImpactDataManager from "../impact/ImpactDataManager";
import { stack} from "d3";

const SubDVGraphDataManager = {
    parseData: function (data) {
        // console.log(data)
        SubDVGraphData.graphData = {};
        SubDVGraphData.graph = {};

        SubDVGraphData.graphData.dataTree = DATA_PARSER.parseNode(data.rootNode, 0, []);

        SubDVGraphData.graphData.dataNodeList = DATA_PARSER.collectAllNodes(SubDVGraphData.graphData.dataTree);

        // LINK_UTILS.preprocessDependencyList(data.allDependencies)

        SubDVGraphData.graphData.dependencyList = data.allDependencies

        SubDVGraphData.graphData.includesIdsMap = DATA_PARSER.createIncludesIdMap(
            SubDVGraphData.graphData.dataNodeList
        );

        // SubDVGraphData.graphData.nodeMap = new Map(SubDVGraphData.graphData.dataNodeList.map(i => [i.id, i]));
    },
    getImpactNodes(data1) {
        let data = JSON.parse(JSON.stringify(data1))
        let query = {
            dependencies: ImpactDataManager.dependencies,
            javaNodes: ImpactDataManager.javaNodes,
            totalNodes:ImpactDataManager.totalNodes,
            changedNodes: [data.nodeToGetImpact.id]
        }
        
        CiaAPI.getImpactNodes(query)
        .then(res => {
            res.nodes.sort(function(a,b){return a.id-b.id});
            let queue = [];
            queue.push(data.rootNode)
            console.log(data.rootNode)

            let s;
            let check = false;
            let deleteIndex = [];
            
            while(queue.length>0){
                s = queue.shift()
                check = false;
                deleteIndex = [];
                for(let i = 0; i < s.children.length; i++) {
                    check = false;
                    if(s.children[i].id === data.nodeToGetImpact.id) {
                        continue;
                    }
                    for(let j = 0; j < res.nodes.length; j++) {
                        if (s.children[i].id === res.nodes[j].id) {
                            queue.push(s.children[i]);
                            check = true;
                            break;
                        }
                    }
                    if(check === false) {
                        deleteIndex.push(i);
                    }
                };
                for( let i = 0; i<deleteIndex.length;i++) {
                    s.children.splice(deleteIndex[i],1)
                    for (let j = i + 1; j < deleteIndex.length; j++) {
                        deleteIndex[j]--;
                    }
                }

            }
            SubDVGraphData.graphData = {};
            SubDVGraphData.graph = {};
            SubDVGraphData.graphData.dataTree = DATA_PARSER.parseNode(data.rootNode, 0, []);
            SubDVGraphData.graphData.dataNodeList = DATA_PARSER.collectAllNodes(SubDVGraphData.graphData.dataTree);
            SubDVGraphData.graphData.dependencyList = data.allDependencies

            SubDVGraphData.graphData.includesIdsMap = DATA_PARSER.createIncludesIdMap(
               SubDVGraphData.graphData.dataNodeList
            );
            SubDVGraphData.graph = new SubDependencyGraph(
                SubDVGraphData.graphData.dataTree,
                SubDVGraphData.graphData.dependencyList,
                CentralView.getTab(VIEW_IDS.SUB_DEPENDENCY_VIEW_IMPACT_ID).view,
                SubDVGraphData.graphData.includesIdsMap,
            )
            SubDVGraphData.graph.recursiveExpandNodeByNodeLevel(SubDVGraphData.graph.root, 3);
            SubDVGraphData.graph.updateFullLinks();

        })
    },
    generateGraph() {
        SubDVGraphData.graph = new SubDependencyGraph(
            SubDVGraphData.graphData.dataTree,
            SubDVGraphData.graphData.dependencyList,
            CentralView.getTab(VIEW_IDS.SUB_DEPENDENCY_VIEW_ID).view,
            SubDVGraphData.graphData.includesIdsMap,
        )
    },
    clearData() {
        SubDVGraphData.graphData = null;
        SubDVGraphData.graph = null;
    }
}

export default SubDVGraphDataManager;