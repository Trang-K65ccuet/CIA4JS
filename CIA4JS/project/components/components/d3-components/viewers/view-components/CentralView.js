import * as d3 from "d3";

import VIEW_CONFIG_VARIABLES from "../../config/ViewConfig";
import ViewEvent from "../ViewEvent";
import DVGraphDataManager from "../../../data-manager/dependency-graph/DVGraphDataManager";

import DVRightView from "./right/DVRightView";

import {VIEW_IDS} from "./central/CentralViewTabs";
import DependencyListView from "./right/DVRightView";
import {createAddTadMenu} from "./central/ContextMenu";
import ArchitectureLevelOption from "./central/ArchitectureLevelOption";
import {db, router} from "../../../../app";
import {IndexedDB} from "../../../../indexeddb/IndexedDB";
import {ToolBar} from "./central/ToolBar";
import {VCDataManager} from "../../../data-manager/version-compare-graph/VCDataManager";
import {VCGraphData} from "../../../data-manager/version-compare-graph/VCGraphData";
import DVGraphData from "../../../data-manager/dependency-graph/DVGraphData";
import CentralViewDataManager from "../../../data-manager/central-view/CentralViewDataManager";
import RightView from "./RightView";
import LeftView from "./LeftView";
import SubDVGraphDataManager from "../../../data-manager/dependency-graph/SubDVGraphDataManager";
import SubDVGraphData from "../../../data-manager/dependency-graph/SubDVGraphData";
import {DOMUtils} from "../../../utils/DOMUtils";
import ViewConfig from "../../config/ViewConfig";
import VersionView from "./left/VersionView";

export const TOOL_BAR_OPTIONS = {
    architecture: {
        id: "architecture-lv",
        name: "Architecture",
        allLevels: [
            {
                id: "lv1",
                name: "Level 1",
                description: "Architecture level for Rootnode",
            },
            {
                id: "lv2",
                name: "Level 2",
                description: "Architecture level for Package nodes",
            },
            {
                id: "lv3",
                name: "Level 3",
                description:
                    "Architecture level for class, interface and innitializer nodes",
            },
        ],
    },
    node: {
        id: "node-lv",
        name: "Node level",
    },
};

const CentralView = {
    tabFullList: [
        {
            name: "Dependency graph",
            id: "dependency",
            icon: "fas fa-random"
        },
        {
            name: "Source code",
            id: "source-code",
            icon: "fas fa-file-code"
        },
        {
            name: "Version compare",
            id: "version-compare",
            icon: "fas fa-file-code"
        },
        {
            name: "Impact node graph",
            id: "sub-node-impact-view",
            icon: "fas fa-random"
        },
        {
            name: "Sub dependency graph",
            id: "sub-node-view",
            icon: "fas fa-random"
        }
        // {name: "Source Code View", id: "sourcecode-view"}
    ],
    view: {},
    svgBounding: {},
    currentTabs: [],
    tabContain : [],
    layerId: false,
    currentViewId: VIEW_IDS.DEPENDENCY_VIEW_ID,


    createView: function () {
        let central_rect = d3
            .select(".class-view")
            .node()
            .getBoundingClientRect();
        // // console.log(central_rect.width);
        let mainView = d3
            .select(".class-view")
            .append("div")
            .attr("class", "main-view");


        CentralView.title = d3
            .select("body")
            .select(".class-view")
            .append("div")
            .classed("view-title", true)
            .style("position", "absolute")
            .style("width", "100%")
            .append("div")
            .classed("view-tab-container", true);

        let viewTitleDiv = $(".view-title")[0];
        let viewTabContainerDivWidth = viewTitleDiv.getBoundingClientRect().width;

        CentralView.title
            .style("position", "absolute")
            .style("width", `${(viewTabContainerDivWidth - 25) / viewTabContainerDivWidth * 100}%`)
            .style("height", `100%`)

        //add tab button
        d3.select(".view-title")
            .append("div")
            .classed("add-tab", true)
            .on("click", function (e) {
                e.stopPropagation();
                createAddTadMenu(e, CentralView.tabContain.filter(tab => tab.title !== "Version compare"));
            })
            .append("i")
            .attr("class", "fas fa-plus");

        CentralView.view = mainView
            .append("div")
            .attr("id", "common-views")
            .attr("class", "cv-layer")
            // .attr("width", "100%")
            // .attr("height", "100%")
            .on("dblclick", function (event) {
                event.stopPropagation();
            });

        // create source code view
        let code_layer = mainView
            .append("div")
            .attr("id", "code-layer")
            .attr("class", "cv-layer")
            .style('padding-left', '5px')
        CentralView.source_code_view = code_layer.append("div")
            .attr("id", "code-editor1")
            .attr("class", "noselectionVC left")
            CentralView.source_code_view = code_layer.append("div")
            .attr("id", "code-editor2")
            .attr("class", "noselectionVC right")
            CentralView.source_code_view = code_layer.append("div")
            .attr("id", "code-editor3")
            .attr("class", "noselectionDV")
        // .style("width", central_rect.width + "px")
        // .style("height", central_rect.height - VIEW_CONFIG_VARIABLES.VIEW_CONFIG.HEADER_HEIGHT + "px");

        //create central toolbar
        this.createToolBar();
        this.createAnnotation();

        CentralView.svgBounding = CentralView.view
            .node()
            .getBoundingClientRect();

        // View.draw_background(CentralView.view, VIEW_CONFIG_VARIABLES.CLASS_VIEW_CONFIG.BACKGROUND_COLOR);
        CentralView.createTab(
            CentralView.title,
            CentralView.view
        );
        // CentralView.defMarks();
        // CentralView.createStatusBar(CentralView.status);
        // CentralView.switchTab(VIEW_IDS.DEPENDENCY_VIEW_ID);
        CentralView.closeUnnecessaryTabYet();

        // // console.log(CentralViewDataManager.viewMode);

        if (CentralViewDataManager.viewMode === VIEW_IDS.DEPENDENCY_VIEW_ID) {
            CentralView.addTab1stTime(CentralView.tabFullList.find(tab => tab.id === "dependency"))
        } else {
            CentralView.addTab1stTime(CentralView.tabFullList.find(tab => tab.id === "version-compare"))
        }
    },

    createAnnotation() {
        let mainView = document.querySelector(".main-view");
        if (mainView) {
            mainView.appendChild(DOMUtils.createElementFromHTML(
                `
                    <div id="main-view-annotation">
                        <div class="annotation-title">
                            <b>Annotation</b>                        
                        </div>
                        <div class="annotation-content">
                            <div>
                                <span><i class="bi bi-square-fill" style="color: ${ViewConfig.FULLGRAPH_CONFIG.CHANGED_COLOR}"></i></span>
                                Changed node
                            </div>
                            <div>
                                <span><i class="bi bi-square-fill" style="color: ${ViewConfig.FULLGRAPH_CONFIG.ADDED_COLOR}"></i></span>
                                Added node
                            </div>
                            <div>
                                <span><i class="bi bi-square-fill" style="color: ${ViewConfig.FULLGRAPH_CONFIG.DELETED_COLOR}"></i></span>
                                Deleted node
                            </div>
                            <div>
                                <span><i class="bi bi-square-fill" style="color: ${ViewConfig.FULLGRAPH_CONFIG.IMPACT_COLOR}"></i></span>
                                Impact node
                            </div>
                        </div>
                    <div>
                `
            ))
        }
    },

    createToolBar: function () {
        let toolBar = d3
            .select(".class-view")
            .append("div")
            .classed("centralview-toolbar", true);

        let architectureBar = toolBar
            .append("div")
            .classed("architecture-bar", true);
        let nodeBar = toolBar.append("div").classed("node-bar", true);

        let size = 1211
        let nodeLevel = 2
        // console.log(DVGraphData.graphData)
        if (CentralView.currentViewId !== null
            && CentralView.currentViewId === VIEW_IDS.VERSION_COMPARE_ID) {
                if (VCGraphData.graphData.dependencyList !== undefined 
                    && VCGraphData.graphData.dependencyList !== null) {
                        // console.log(VCGraphData.graphData.dependencyList.length)
                        size = VCGraphData.graphData.dependencyList.length;
                        
                    }
            } else {
                if(DVGraphData.graphData !== null
                    && DVGraphData.graphData.dependencyList !== undefined 
                    && DVGraphData.graphData.dependencyList !== null) {
                        size = DVGraphData.graphData.dependencyList.length;
                }
            }
        // if(DVGraphData.graphData !== null
        //     && DVGraphData.graphData.dependencyList !== undefined 
        //     && DVGraphData.graphData.dependencyList !== null) {
        //         size = DVGraphData.graphData.dependencyList.length;
        // } else if (VCGraphData.graphData !== null
        //     && VCGraphData.graphData.dependencyList !== undefined 
        //     && VCGraphData.graphData.dependencyList !== null) {
        //         console.log(VCGraphData.graphData.dependencyList.length)
        //         size = VCGraphData.graphData.dependencyList.length;
                
        //     }
        nodeLevel = size < 2000 ? 3 : 2;

        // // generate option for node level
        // architectureBar
        //     .append("button")
        //     .classed("node-bar-title", true)
        //     .html(<span>${TOOL_BAR_OPTIONS.architecture.name} </span><i class="fas fa-sort-up" width="1em">)
        //     .on('click mouseenter mouseout', (e) => {
        //         if (e.type === 'click') {
        //             ArchitectureLevelOption.isSettingOn = !ArchitectureLevelOption.isSettingOn;
        //             ArchitectureLevelOption.checkOptionTabVisibility();
        //         }
        //     });

        // generate option for node level
        architectureBar
            .append("div")
            .classed("node-bar-title", true)
            .html(
                `<span>${TOOL_BAR_OPTIONS.node.name}<span id="level-output">: ${nodeLevel}</span></span>`
            );

        //create filter btn
        toolBar
            .append("div")
            .classed("dependency-setting", true)
            .on("click mouseenter mouseout", function (e) {
                if (e.type === "click") {
                    ToolBar.isSettingOn =
                        !ToolBar.isSettingOn;
                    ToolBar.checkOptionTabVisibility();
                }
                // else if (e.type === "mouseenter") {
                // 	e.stopPropagation();
                // 	// // // console.log(x, y)
                // 	setTimeout(function () {
                // 		d3.select("body")
                // 			.append("div")
                // 			.classed("btn-name", true)
                // 			.style("top", ${e.clientY - 20}px)
                // 			.style("left", ${e.clientX + 10}px)
                // 			.html("<span>Filtering dependency</span>");
                // 	}, 500);
                // } else {
                // 	setTimeout(function () {
                // 		d3.selectAll(".btn-name").remove();
                // 	}, 300);
                // }
            })
            .append("i")
            .attr("class", "fas fa-sort-up");
    },

    createTab: function (title, view) {
        let title_rect = title.node().getBoundingClientRect();

        // CentralView.currentTabs.push(this.tabFullList[0]);
        // CentralView.currentTabs.push(tabDetails[1]);

        let tabWidth = (title_rect.width) / CentralView.tabFullList.length;

        CentralView.tabFullList.forEach(function (tab, index) {
            let posX = index * tabWidth;
            // // console.log(posX)
            let tabTitle = title
                .append("div")
                .classed("tab-title", true)
                .data([tab])
                .style("left", `${posX / (tabWidth.width) * 100}%`)
                .style("position", "absolute")
                .style(
                    "background-color",
                    VIEW_CONFIG_VARIABLES.VIEW_CONFIG.TITLE_COLOR
                )
                .style("width", `${posX / (tabWidth.width) * 100}%`)
                .style("height", `100%`)
                .on("click", function (d) {
                    if (tab.isContain) {
                        // // console.log(d.id)
                        CentralView.switchTab(tab.id);
                    }
                });

            tabTitle
                .append("div")
                .attr("class", "tab-name")
                .html(`${tab.name} `);

            tabTitle
                .append("span")
                .classed("tab-icon", true)
                .on("click", function (event) {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    CentralView.closeTab(tab);
                })
                .append("i")
                .attr("class", "fas fa-times");

            tabTitle.classed("activeBar", true);

            tab.title = tabTitle;

            let svg = view
                .append("svg")
                .attr("id", "svg-" + tab.id)
                .attr("class", "svg-view")
                .attr("width", "100%")
                .attr("height", "100%");

            CentralView.defMarks(svg);

            if (tab.id == VIEW_IDS.SOURCE_CODE_VIEW_ID) {
                tab.view = svg;
                let rightview = document.querySelector(".right-view");
                rightview.setAttribute("display","none");
            } else {
                tab.view = svg
                    .append("g")
                    .attr("class", "content")
                    .attr("id", tab.id + "-g");
            }

            // CentralView.view.call(ViewEvent.zoom);

            tab.svg = svg;
            tab.scale = 1;
            tab.active = true;
            tab.isContain = true;
            CentralView.currentTabs.push(tab);

            svg.call(ViewEvent.zoom);
        });

        // CentralView.swapLayers();

        //contained by hidden tab
        CentralView.tabContain = [];
        CentralView.tabFullList.forEach(function (tab) {
            if (CentralView.currentTabs.indexOf(tab) < 0) {
                CentralView.tabContain.push({
                    title: tab.name,
                    action: function () {
                        // // console.log("Add tab")
                        CentralView.addTab(tab);
                    },
                });
            }
        });
    },

    closeTab: function (tab) {
        if (tab.id === VIEW_IDS.SOURCE_CODE_VIEW_ID && this.currentTabs.length === 1) {
            CentralView.swapLayers();
        }

        let currentTab = CentralView.getCurrentTab();
        let current = CentralView.currentTabs.indexOf(currentTab);
        let count = CentralView.currentTabs.length;
        let i = CentralView.currentTabs.indexOf(tab);
        CentralView.currentTabs.splice(i, 1);
        tab.isContain = false;
        tab.isContain = false;
        tab.svg.attr("visibility", "hidden");
        CentralView.redrawTabTitle();
        CentralView.tabContain.push({
            title: tab.name,
            action: function () {
                // d3.select(".d3-context-menu").style("display", "none");
                CentralView.addTab(tab);
            },
        });
        if (CentralView.currentTabs.length === 0) {
            tab.active = false;
            tab.svg.attr("visibility", "hidden");
            CentralView.currentViewId = null
        } else if (i == current) {
            if (i != count - 1) {
                CentralView.switchTab(CentralView.currentTabs[i].id);
            } else {
                CentralView.switchTab(CentralView.currentTabs[i - 1].id);
            }
        }
        if (tab.id === VIEW_IDS.DEPENDENCY_VIEW_ID) {
            $("#dependency-g").empty();
        } else if (tab.id === VIEW_IDS.VERSION_COMPARE_ID) {
            $("#version-compare-g").empty();
        }
        // switch (tab.id) {
        //     // case VIEW_IDS.DEPENDENCY_VIEW_ID:
        //     //     DVGraphDataManager.clearData();
        //     //     break;
        //     case VIEW_IDS.VERSION_COMPARE_ID:
        //         // VCDataManager.clearData();
        //         break;
        //     case VIEW_IDS.SUB_DEPENDENCY_VIEW_ID:
        //         // SubDVGraphDataManager.clearData();
        //         break;
        // }
    },

    swapLayers: function () {
        $(".cv-layer").each((i, el) => {
            if (i !== 0) {
                $(el)
                    .css("visibility", "visible")
                    .css("z-index", "1");
                $(el).prev()
                    .css("visibility", "hidden")
                    .css("z-index", "0");
                $(el).insertBefore($(el).prev());
            }
        });
        this.layerId = !this.layerId;
    },

    displayAnnotation() {
        let viewAnnotation = document.getElementById("main-view-annotation");
        if (CentralView.currentViewId === VIEW_IDS.VERSION_COMPARE_ID) {
            viewAnnotation.classList.add("show");
        } else {
            viewAnnotation.classList.remove("show");
        }
    },


    switchTab: function (id) {
        if (CentralView.currentViewId !== id || CentralView.currentViewId == null) {
            
            CentralView.currentViewId = id;
            VersionView.displayVersionList()
            
            if ((id === VIEW_IDS.SOURCE_CODE_VIEW_ID && !this.layerId) ||
                (id !== VIEW_IDS.SOURCE_CODE_VIEW_ID && this.layerId)) {
                if (id === VIEW_IDS.SOURCE_CODE_VIEW_ID) {
                    d3.select(".centralview-toolbar").style("visibility", "hidden");
                } else {
                    d3.select(".centralview-toolbar").style("visibility", "visible");
                }
                let filterOption = document.getElementById("filter-mode-option");
                if (filterOption) {
                    filterOption.style.visibility = "hidden"
                }
                CentralView.swapLayers();
            }

            let first = $(".svg-view").first()

            $(".svg-view").each((i, el) => {
                if ($(el).attr("id").includes(id) && !$(el).attr("id").includes("source-code")) {
                    $(el).insertBefore(first);
                }
            });

            CentralView.currentTabs.forEach(function (tab) {
                // console.log(tab.id===id)
                if (tab.id !== id) {
                    tab.active = false;
                    tab.svg.attr("visibility", "hidden");
                    tab.title.classed("activeBar", false);
                } else {
                    tab.active = true;
                    tab.svg.attr("visibility", "visible");
                    tab.title.classed("activeBar", true);
                    // CentralView.addTabOption(tab);
                }
            });

            this.displayAnnotation();

            if (DVGraphData.graph !== null &&
                DVGraphData.graphData !== null &&
                CentralView.currentViewId === VIEW_IDS.DEPENDENCY_VIEW_ID) {
                RightView.displayRightView(DVGraphData.graphData);
                DVRightView.updateDependencyList(DVGraphData.graph.linkData);
                LeftView.redrawLeftView(DVGraphData.graphData.dataTree);
            }

            if (SubDVGraphData.graph !== null &&
                SubDVGraphData.graphData !== null &&
                CentralView.currentViewId === VIEW_IDS.SUB_DEPENDENCY_VIEW_ID) {
                RightView.displayRightView(SubDVGraphData.graphData);
                DVRightView.updateDependencyList(SubDVGraphData.graph.linkData);
                LeftView.redrawLeftView(SubDVGraphData.graphData.dataTree);
            }

            if (SubDVGraphData.graph !== null &&
                SubDVGraphData.graphData !== null &&
                CentralView.currentViewId === VIEW_IDS.SUB_DEPENDENCY_VIEW_IMPACT_ID) {
                RightView.displayRightView(SubDVGraphData.graphData);
                DVRightView.updateDependencyList(SubDVGraphData.graph.linkData);
                LeftView.redrawLeftView(SubDVGraphData.graphData.dataTree);
            }
            // // console.log(VCGraphData)

            if (VCGraphData.graphData !== null && CentralView.currentViewId === VIEW_IDS.VERSION_COMPARE_ID) {
                LeftView.redrawLeftView(VCGraphData.graphData.dataTree);
                // DependenceListView.updateDependencyList(VCGraphData.graph.linkData);
                RightView.displayRightView()
            }
        }
    },

    getTab: function (id) {
        return CentralView.tabFullList.find((tab) => tab.id == id);
    },

    getCurrentTab: function () {
        return CentralView.tabFullList.find(function (tab) {
            return tab.active;
        });
    },

    addTab1stTime(tab) {
        // console.log(tab)
        CentralView.addTabToTabContains(tab);

        if (tab.id === VIEW_IDS.DEPENDENCY_VIEW_ID) {
            CentralView.parsedDVFromIndexDb(tab, DVGraphDataManager.generateDVGraph)
        } else if (tab.id === VIEW_IDS.VERSION_COMPARE_ID) {
            CentralView.parseVCFromIndexDb(tab, VCDataManager.generateVCGraph);
        }

        tab.title.style("visibility", "visible");
    },
    addTab: function (tab, subRootNode) {
        CentralView.addTabToTabContains(tab);
        console.log(tab.id)
        if (tab.id === VIEW_IDS.VERSION_COMPARE_ID) {
            CentralView.parseVCFromIndexDb(tab, VCDataManager.generateVCGraph)
        } else if (tab.id === VIEW_IDS.DEPENDENCY_VIEW_ID) {
            CentralView.parsedDVFromIndexDb(tab, DVGraphDataManager.generateDVGraph);
        } else if (tab.id === VIEW_IDS.SUB_DEPENDENCY_VIEW_ID) {
            CentralView.switchTab(VIEW_IDS.SUB_DEPENDENCY_VIEW_ID)
            if (subRootNode) {
                SubDVGraphDataManager.parseData(subRootNode);
                SubDVGraphDataManager.generateGraph();
            }
        } else if (tab.id === VIEW_IDS.SUB_DEPENDENCY_VIEW_IMPACT_ID) {
            CentralView.switchTab(VIEW_IDS.SUB_DEPENDENCY_VIEW_IMPACT_ID)
            if (subRootNode) {
                SubDVGraphDataManager.getImpactNodes(subRootNode)
            }
        } else {
            CentralView.switchTab(VIEW_IDS.SOURCE_CODE_VIEW_ID)
        }
        tab.title.style("visibility", "visible");
    },

    parsedDVFromIndexDb(tab, cb) {
        // console.log(DVGraphData)
        IndexedDB
            .getRecord(db, "root-node")
            .then((d) => {
                if (d === undefined) {
                    router.navigate("upload");
                } else {
                    DVGraphDataManager.parseData(d.dvData == undefined ? d : d.dvData);
                    CentralView.switchTab(tab.id);
                    if (cb) {
                        cb();
                    }
                    // // console.log(d)
                }
            })
    },

    addTabToTabContains(tab) {
        let position = this.tabFullList.indexOf(tab);

        tab.isContain = true;
        if (CentralView.currentTabs.indexOf(tab) < 0) {
            this.currentTabs.splice(position, 0, tab);
            // // console.log(CentralView.currentTabs)
            this.redrawTabTitle();
            CentralView.tabContain.forEach(function (tabName, i) {
                if (tabName.title === tab.name) {
                    CentralView.tabContain.splice(i, 1);
                }
            })
        }
    },

    parseVCFromIndexDb(tab, cb) {
        // console.log(VCGraphData)
        IndexedDB
            .getRecord(db, "version-compare")
            .then((d) => {
                // console.log(d)
                if (d === undefined) {
                    router.navigate("upload");
                } else {
                    VCDataManager.parseData(d.dvData == undefined ? d : d.dvData);
                    CentralView.switchTab(tab.id);
                    if (cb) {
                        cb();
                    }
                    console.log(tab.id)
                    
                }
            })
    },

    redrawTabTitle: function () {
        let div_rect = CentralView.title.node().getBoundingClientRect();

        let numTabs = CentralView.currentTabs.length;
        // // console.log(numTabs)

        if (numTabs == 0) {
            this.tabFullList.forEach(function (tab, index) {
                tab.active = false;
                tab.svg.attr("visibility", "hidden");
                tab.title.style("left", "0px")
                    .style("visibility", "hidden");
            })
        } else {
            let remove = 0;
            let tabWidth = (div_rect.width) / numTabs;
            // // console.log(tabWidth)
            this.tabFullList.forEach(function (tab, index) {
                if (tab.isContain) {
                    index = index - remove;
                    tab.title.style("left", `${index * tabWidth / div_rect.width * 100}%`)
                        .style("width", `${tabWidth / (div_rect.width) * 100}%`);

                } else {
                    tab.title.style("left", `0px`).style("visibility", "hidden");
                    remove++;
                }
            })
        }

    },

    closeUnnecessaryTabYet: function () {
        CentralView.tabFullList.forEach(function (tab) {
            CentralView.closeTab(tab);
        });

    },

    resize: function () {
        let div_rect = d3
            .select("body")
            .select(".class-view")
            .node()
            .getBoundingClientRect();
        CentralView.svgBounding = div_rect;
        d3.select("body")
            .select(".class-view")
            .select(".main-view")
            .style("width", 100 + "%")
            .style(
                "height",
                div_rect.height -
                VIEW_CONFIG_VARIABLES.VIEW_CONFIG.HEADER_HEIGHT +
                "px"
            );

        // Set position for dependency filter
        let bounding_rect = d3
            .select(".centralview-toolbar")
            .node()
            .getBoundingClientRect();

        d3.select(".filter-mode-option")
            .style("top", `${bounding_rect.y}px`)
            .style("left", `${bounding_rect.x + bounding_rect.width}px`);

        let viewTitleDiv = $(".view-title")[0];
        let viewTabContainerDivWidth = viewTitleDiv.getBoundingClientRect().width;
        CentralView.title.style("width", `${(viewTabContainerDivWidth - 25) / viewTabContainerDivWidth * 100}%`);

        // //Set position for arch level
        // let bounding_rect_of_arch = d3.select('.node-bar-title').node().getBoundingClientRect();
        // d3.select('.arch-level')
        //     .style("top", `${bounding_rect_of_arch.y}px`)
        //     .style("left", `${bounding_rect_of_arch.left + bounding_rect_of_arch.width}px`)
        //     .style("width", `${bounding_rect_of_arch.width}px`)
    },

    createMark: function (id, color, view) {
        view.append("svg:defs")
            .append("svg:marker")
            .attr("id", id)
            .attr("viewBox", "-10 -10 20 20")
            .attr("refX", 6)
            .attr("markerWidth", 10)
            .attr("markerHeight", 10)
            .attr("orient", "auto")
            .append("svg:path")
            .attr("d", "M-5,-5 L8,0 L-5,5 L-5,0")
            .attr("fill", color);
    },

    defMarks: function (view) {
        // definition arrow mark for link between class
        CentralView.createMark("end-arrow", "#000", view);
        CentralView.createMark("end-arrow-fullgraph", VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.LINE_STROKE_COLOR, view);
        CentralView.createMark(
            "depended-arrow-fullgraph",
            VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.DEPENDED_STROKE_COLOR,
            view
        );
        CentralView.createMark(
            "depend-arrow-fullgraph",
            VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.DEPEND_STROKE_COLOR,
            view
        );
        CentralView.createMark(
            "highlight-arrow",
            VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.HIGHLIGHT_STROKE_COLOR,
            view
        );
    },
};

export default CentralView;
