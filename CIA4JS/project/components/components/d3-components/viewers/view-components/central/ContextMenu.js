import * as d3 from 'd3';
import {ViewUtils} from "../../../../utils/ViewUtils";
import CentralView from "../CentralView";
import {VIEW_IDS} from "./CentralViewTabs";
import DVGraphData from "../../../../data-manager/dependency-graph/DVGraphData";
import DVRightView from "../right/DVRightView";
import TreeAPI from "../../../../../api/TreeAPI";
import {IndexedDB} from "../../../../../indexeddb/IndexedDB";
import {db} from "../../../../../app";
import CentralViewDataManager from "../../../../data-manager/central-view/CentralViewDataManager";
import VersionView from "../left/VersionView";
import ProjectParserAPI from "../../../../../api/ProjectParserAPI";
import SubDVGraphDataManager from '../../../../data-manager/dependency-graph/SubDVGraphDataManager';

export const DV_GRAPH_CONTEXT_OPT1 = [
    {
        title: "Open source code",
        action: function (event, d, node) {
            ViewUtils.switchSourceCodeLayer();
            // CentralView.swapLayers();
            ViewUtils.getSourceCodeDV(node.data.id);
        }
    },
    {
        title: "View detail graph",
        action: function (event, d, node) {
            let subRootNode = {
                rootNode: node.data,
                allDependencies: node.graph.dependencies
            }
            CentralView.addTab(CentralView.getTab(VIEW_IDS.SUB_DEPENDENCY_VIEW_ID), subRootNode);
        }
    },
    {
        title: "View node impact graph",
        action: function (event, d, node) {
            
            let subRootNode = {
                rootNode: DVGraphData.graphData.dataNodeList[0],
                allDependencies: node.graph.dependencies,
                nodeToGetImpact: node.data
            }
            CentralView.addTab(CentralView.getTab(VIEW_IDS.SUB_DEPENDENCY_VIEW_IMPACT_ID), subRootNode);
        }
    },
    {
        title: "Add to change set",
        action: function (event, d, node) {
            DVGraphData.graph.addNodeToChangeSet(node);
            DVRightView.changeToChangeImpactView();
        }
    },

];

export const DV_GRAPH_CONTEXT_OPT2 = [
    {
        title: "View detail graph",
        action: function (event, d, node) {
            let subRootNode = {
                rootNode: node.data,
                allDependencies: node.graph.dependencies
            }
            CentralView.addTab(CentralView.getTab(VIEW_IDS.SUB_DEPENDENCY_VIEW_ID), subRootNode);
        }
    },
    {
        title: "View node impact graph",
        action: function (event, d, node) {
            let subRootNode = {
                rootNode: DVGraphData.graphData.dataNodeList[0],
                allDependencies: node.graph.dependencies,
                nodeToGetImpact: node.data
            }
            CentralView.addTab(CentralView.getTab(VIEW_IDS.SUB_DEPENDENCY_VIEW_IMPACT_ID), subRootNode);
        }
    },
    {
        title: "Add to change set",
        action: function (event, d, node) {
            DVGraphData.graph.addNodeToChangeSet(node);
            DVRightView.changeToChangeImpactView();
        }
    },
    // {
    //     title: "Open source code",
    //     action: function (event, d, node) {
    //         ViewUtils.switchSourceCodeLayer();
    //
    //         ViewUtils.getSourceCode(node.data.id);
    //     }
    // },
];

export const DV_GRAPH_CONTEXT_OPT3 = [
    {
        title: "Open source code",
        action: function (event, d, node) {
            ViewUtils.switchSourceCodeLayer();
            // CentralView.swapLayers();
            
            console.log(node.data)
            ViewUtils.getSourceCodeVC(node.data.id);
        }
    },
    {
        title: "View detail graph",
        action: function (event, d, node) {
            let subRootNode = {
                rootNode: node.data,
                allDependencies: node.graph.dependencies
            }
            CentralView.addTab(CentralView.getTab(VIEW_IDS.SUB_DEPENDENCY_VIEW_ID), subRootNode);
        }
    }

];

export const DV_GRAPH_CONTEXT_OPT4 = [
    {
        title: "View detail graph",
        action: function (event, d, node) {
            let subRootNode = {
                rootNode: node.data,
                allDependencies: node.graph.dependencies
            }
            CentralView.addTab(CentralView.getTab(VIEW_IDS.SUB_DEPENDENCY_VIEW_ID), subRootNode);
        }
    }
];

export const SUB_DV_GRAPH_CONTEXT_OPT1 = [
    {
        title: "Open source code",
        action: function (event, d, node) {
            ViewUtils.switchSourceCodeLayer();

            ViewUtils.getSourceCodeDV(node.data.id);
        }
    },
    {
        title: "View detail graph",
        action: function (event, d, node) {
            let subRootNode = {
                rootNode: node.data,
                allDependencies: node.graph.dependencies
            }
            CentralView.addTab(CentralView.getTab(VIEW_IDS.SUB_DEPENDENCY_VIEW_ID), subRootNode);
        }
    }

];

export const SUB_DV_GRAPH_CONTEXT_OPT2 = [
    {
        title: "View detail graph",
        action: function (event, d, node) {
            let subRootNode = {
                rootNode: node.data,
                allDependencies: node.graph.dependencies
            }
            CentralView.addTab(CentralView.getTab(VIEW_IDS.SUB_DEPENDENCY_VIEW_ID), subRootNode);
        }
    },
];

export const VERSION_VIEW_CONTEXT_OPT = [
    {
        title: "Mark as current version",
        action: function (event, d, compareData) {
            CentralViewDataManager.currentVersionName = compareData.newVersion.name;
            let path = compareData.newVersion.path;
            VersionView.displayVersionList();
            let query = {
                path: path
            }
            let language = localStorage.getItem('language');
            ProjectParserAPI.parseProjectByPath(query, language).then(dataRes => {
                IndexedDB.getRecord(db, 'root-node').then(
                    result => {
                        let data = {
                            dvData: dataRes,
                            projectName: CentralViewDataManager.projectName,
                            versionName: compareData.newVersion.name
                        }
                        console.log(CentralView.currentViewId)
                        if (result === undefined) {
                            IndexedDB.insertRecord(db, data, 'root-node')
                                .then(() => {
                                    let tab = CentralView.getTab(VIEW_IDS.DEPENDENCY_VIEW_ID)
                                    // CentralView.addTab(tab);
                                    if (CentralView.currentViewId === VIEW_IDS.DEPENDENCY_VIEW_ID) {
                                        // CentralView.closeTab(tab);
                                        CentralView.addTab(tab);
                                    } else {
                                        CentralView.addTab(tab);
                                    }
                                });
                        } else {
                            IndexedDB.updateRecord(db, data, 'root-node')
                                .then(() => {
                                    let tab = CentralView.getTab(VIEW_IDS.DEPENDENCY_VIEW_ID)
                                    // CentralView.addTab(tab);
                                    if (CentralView.currentViewId === VIEW_IDS.DEPENDENCY_VIEW_ID) {
                                        // CentralView.closeTab(tab);
                                        CentralView.addTab(tab);
                                    } else {
                                        CentralView.addTab(tab);
                                    }
                                });
                        }
                    }
                )
            })
        }
    },
    {
        title: "Compare with current version",
        action: function (event, d, compareData) {
            // console.log(compareData)

            CentralViewDataManager.laterVersionName = compareData.newVersion.name;
            VersionView.displayVersionList()
            let query = {
                oldVersion: compareData.oldVersion.path,
                newVersion: compareData.newVersion.path
            }
            // console.log(query)
            TreeAPI.compareByPath(query).then(res => {
                IndexedDB.getRecord(db, 'version-compare').then(
                    result => {
                        console.log(CentralView.getTab(VIEW_IDS.VERSION_COMPARE_ID))
                        if (result === undefined) {
                            IndexedDB.insertRecord(db, res, 'version-compare')
                                .then(() => {
                                    if (CentralView.currentViewId === VIEW_IDS.VERSION_COMPARE_ID) {
                                        CentralView.closeTab(CentralView.getTab(VIEW_IDS.VERSION_COMPARE_ID));
                                        CentralView.addTab(CentralView.getTab(VIEW_IDS.VERSION_COMPARE_ID));
                                    } else {
                                        CentralView.addTab(CentralView.getTab(VIEW_IDS.VERSION_COMPARE_ID));
                                    }
                                });
                        } else {
                            IndexedDB.updateRecord(db, res, 'version-compare')
                                .then(() => {
                                    if (CentralView.currentViewId === VIEW_IDS.VERSION_COMPARE_ID) {
                                        CentralView.closeTab(CentralView.getTab(VIEW_IDS.VERSION_COMPARE_ID));
                                        CentralView.addTab(CentralView.getTab(VIEW_IDS.VERSION_COMPARE_ID));
                                    } else {
                                        CentralView.addTab(CentralView.getTab(VIEW_IDS.VERSION_COMPARE_ID));
                                    }
                                });
                        }
                    }
                )
            })
        }
    }
];

export function createAddTadMenu(event, data) {
    // // console.log(data)
    d3.selectAll('#add-tab-context').remove();

   d3.select(".content").selectAll('#add-tab-context')
        .data([ 1 ]).enter().append('div').attr('id', 'add-tab-context');

    d3.select('#add-tab-context').classed("active", true)
        .style("top", `${event.clientY}px`)
        .style("left", `${event.clientX - 160}px`);

    let list = d3.selectAll('#add-tab-context').append('ul');
    list.selectAll('li').data(data).enter().append('li').html(function(d,i) {
        // // console.log(d);
        return d.title;
    }).on('click', function(event, d, i) {
        // // console.log(d)
         d.action(event, d);
    });

    window.addEventListener("click", function (event) {
        let contextmenu = d3.select("#add-tab-context");

        contextmenu.classed("active", false);
        let list = d3.selectAll('#add-tab-context').remove();
    });
}

export function createNodeContext(event, data, node) {
    d3.selectAll('#add-tab-context').remove();

    d3.select(".content").selectAll('#add-tab-context')
        .data([ 1 ]).enter().append('div').attr('id', 'add-tab-context');

    d3.select('#add-tab-context').classed("active", true)
        .style("top", `${event.clientY}px`)
        .style("left", `${event.clientX - 160}px`)
        .style("width", `150px`);

    let list = d3.selectAll('#add-tab-context').append('ul');
    list.selectAll('li').data(data).enter().append('li').html(function(d,i) {
        // // console.log(d);
        return d.title;
    }).on('click', function(event, d, i) {
        // // console.log(d)
        d.action(event, d, node);
    });

    window.addEventListener("click", function (event) {
        let contextmenu = d3.select("#add-tab-context");

        contextmenu.classed("active", false);
        let list = d3.selectAll('#add-tab-context').remove();
    });
}

export function createVersionViewContext(event, data, compareData) {
    d3.selectAll('#add-tab-context').remove();

    d3.select(".content").selectAll('#add-tab-context')
        .data([ 1 ]).enter().append('div').attr('id', 'add-tab-context');

    d3.select('#add-tab-context').classed("active", true)
        .style("top", `${event.clientY}px`)
        .style("left", `${event.clientX}px`)
        .style("width", `205px`);

    let list = d3.selectAll('#add-tab-context').append('ul');
    list.selectAll('li').data(data).enter().append('li').html(function(d,i) {
        // // console.log(d);
        return d.title;
    }).on('click', function(event, d, i) {
        // // console.log(d)
        d.action(event, d, compareData);
    });

    window.addEventListener("click", function (event) {
        let contextmenu = d3.select("#add-tab-context");

        contextmenu.classed("active", false);
        let list = d3.selectAll('#add-tab-context').remove();
    });
}