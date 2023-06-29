import * as d3 from "d3";
import DVGraphDataManager from "../../../../data-manager/dependency-graph/DVGraphDataManager";
import DepthSlider from "./DepthSlider";
import ArchitectureLevelOption from "./ArchitectureLevelOption";
import CentralView from "../CentralView";
import {VIEW_IDS} from "./CentralViewTabs";
import {VCGraphData} from "../../../../data-manager/version-compare-graph/VCGraphData";
import DVGraphData from "../../../../data-manager/dependency-graph/DVGraphData";
import SubDVGraphData from "../../../../data-manager/dependency-graph/SubDVGraphData";

const ToolBarOption = {
    all: "all",
    inheritance: "inheritance",
    invocation: "invocation",
    override: "override",
    member: "member",
    use: "use",
    spring: "spring",
    jsf: "jsf"
}

export const ToolBar = {
    isSettingOn: false,
    filterMode : {},

    createToolBar: function(graph) {
        if(localStorage.getItem('language') == 'java') {
            ToolBar.generateToolBarComponent();
        } else {
            ToolBar.generateToolBarComponentForCSharp();
        }
        DepthSlider.create(graph);
        // ArchitectureLevelOption.createView();
    },


    generateToolBarComponent: function() {
        let bounding_rect = d3.select(".centralview-toolbar").node().getBoundingClientRect();
        let filterOption_ul = d3.select(".class-view").append("div")
            .classed("filter-mode-option", true)
            .attr('id', "filter-mode-option")
            .style("bottom", `25px`)
            .style("right", `0`)
            .style("width", `125px`)
            .style("position", "absolute")
            .style("background-color", "#3C3F41")
            .append("ul")
        ;
        // // console.log(bounding_rect);

        filterOption_ul.append("li")
            .classed("all-mode", true)
            .html("All dependency")
            .on("click", function(e) {
                ToolBar.changeOptionView(ToolBarOption.all);
            })
        ;

        filterOption_ul.append("li")
            .classed("invocation-mode", true)
            .html("Invocation")
            .on("click", function(e) {
                ToolBar.changeOptionView(ToolBarOption.invocation);
            })
        ;
        filterOption_ul.append("li")
            .classed("override-mode", true)
            .html("Override")
            .on("click", function(e) {
                ToolBar.changeOptionView(ToolBarOption.override);
            })
        ;
        filterOption_ul.append("li")
            .classed("inheritance-mode", true)
            .html("Inheritance")
            .on("click", function(e) {
                ToolBar.changeOptionView(ToolBarOption.inheritance);
            })
        ;
        filterOption_ul.append("li")
            .classed("member-mode", true)
            .html("Member")
            .on("click", function(e) {
                ToolBar.changeOptionView(ToolBarOption.member);
            })
        ;
        filterOption_ul.append("li")
            .classed("use-mode", true)
            .html("Use")
            .on("click", function(e) {
                ToolBar.changeOptionView(ToolBarOption.use);
            })
        ;
        filterOption_ul.append("li")
            .classed("spring-mode", true)
            .html("Spring")
            .on("click", function(e) {
                ToolBar.changeOptionView(ToolBarOption.spring);
            })
        ;
        ToolBar.checkOptionTabVisibility();
        filterOption_ul.append("li")
            .classed("jsf-mode", true)
            .html("JSF")
            .on("click", function(e) {
                ToolBar.changeOptionView(ToolBarOption.jsf);
            })
        ;
        ToolBar.checkOptionTabVisibility();

    },

    generateToolBarComponentForCSharp: function() {
        let bounding_rect = d3.select(".centralview-toolbar").node().getBoundingClientRect();
        let filterOption_ul = d3.select(".class-view").append("div")
            .classed("filter-mode-option", true)
            .attr('id', "filter-mode-option")
            .style("bottom", `25px`)
            .style("right", `0`)
            .style("width", `125px`)
            .style("position", "absolute")
            .style("background-color", "#3C3F41")
            .append("ul")
        ;
        // // console.log(bounding_rect);

        filterOption_ul.append("li")
            .classed("all-mode", true)
            .html("All dependency")
            .on("click", function(e) {
                ToolBar.changeOptionView(ToolBarOption.all);
            })
        ;

        filterOption_ul.append("li")
            .classed("invocation-mode", true)
            .html("Invocation")
            .on("click", function(e) {
                ToolBar.changeOptionView(ToolBarOption.invocation);
            })
        ;
        filterOption_ul.append("li")
            .classed("override-mode", true)
            .html("Override")
            .on("click", function(e) {
                ToolBar.changeOptionView(ToolBarOption.override);
            })
        ;
        filterOption_ul.append("li")
            .classed("inheritance-mode", true)
            .html("Inheritance")
            .on("click", function(e) {
                ToolBar.changeOptionView(ToolBarOption.inheritance);
            })
        ;
        filterOption_ul.append("li")
            .classed("member-mode", true)
            .html("Member")
            .on("click", function(e) {
                ToolBar.changeOptionView(ToolBarOption.member);
            })
        ;
        filterOption_ul.append("li")
            .classed("use-mode", true)
            .html("Use")
            .on("click", function(e) {
                ToolBar.changeOptionView(ToolBarOption.use);
            })
        ;
        ToolBar.checkOptionTabVisibility();
    },

    checkOptionTabVisibility: function() {
        if (this.isSettingOn) {
            d3.select(".filter-mode-option")
                .style("visibility", "visible");
        } else {
            d3.select(".filter-mode-option")
                .style("visibility", "hidden");
        }
    },
    changeOption(option) {
        if (option == "all") {
            ToolBar.filterMode.all = true;
            ToolBar.filterMode.use = false;
            ToolBar.filterMode.member = false;
            ToolBar.filterMode.invocation = false;
            ToolBar.filterMode.override = false;
            ToolBar.filterMode.inheritance = false;
            ToolBar.filterMode.spring = false;
            ToolBar.filterMode.jsf = false;
        } else {
            ToolBar.filterMode.all = false;
            if (option === "use") {
                ToolBar.filterMode.use = !ToolBar.filterMode.use;
            } else if (option === "member") {
                ToolBar.filterMode.member = !ToolBar.filterMode.member;
            } else if (option === "invocation") {
                ToolBar.filterMode.invocation = !ToolBar.filterMode.invocation;
            } else if (option === "override") {
                ToolBar.filterMode.override = !ToolBar.filterMode.override;
            } else if (option === "inheritance") {
                ToolBar.filterMode.inheritance = !ToolBar.filterMode.inheritance;
            } else if (option === "spring") {
                ToolBar.filterMode.spring = !ToolBar.filterMode.spring;
            }else if (option === "jsf") {
                ToolBar.filterMode.jsf = !ToolBar.filterMode.jsf;
            }
        }
        if (
            ToolBar.filterMode.use === false &&
            ToolBar.filterMode.member === false &&
            ToolBar.filterMode.invocation === false &&
            ToolBar.filterMode.override === false &&
            ToolBar.filterMode.inheritance === false &&
            ToolBar.filterMode.spring === false &&
            ToolBar.filterMode.jsf === false
        ) {
            ToolBar.filterMode.all = true;
        }
    },
    changeOptionView: function(toolBarOption) {
        ToolBar.changeOption(toolBarOption);

        if (CentralView.currentViewId === VIEW_IDS.DEPENDENCY_VIEW_ID) {
            DVGraphData.graph.changeFilterMode(ToolBar.filterMode);
        }
         else if (CentralView.currentViewId === VIEW_IDS.VERSION_COMPARE_ID) {
            VCGraphData.graph.changeFilterMode(ToolBar.filterMode);
        } else if (CentralView.currentViewId === VIEW_IDS.SUB_DEPENDENCY_VIEW_ID) {
             SubDVGraphData.graph.changeFilterMode(ToolBar.filterMode);
        } else if (CentralView.currentViewId === VIEW_IDS.SUB_DEPENDENCY_VIEW_IMPACT_ID) {
            SubDVGraphData.graph.changeFilterMode(ToolBar.filterMode);
       }

        if (ToolBar.filterMode.all === true) {
            d3.select(".all-mode").classed("isClicked", true);
        } else {
            d3.select(".all-mode").classed("isClicked", false);
        }

        if (ToolBar.filterMode.invocation === true) {
            d3.select(".invocation-mode").classed("isClicked", true);
        } else {
            d3.select(".invocation-mode").classed("isClicked", false);
        }

        if (ToolBar.filterMode.override === true) {
            d3.select(".override-mode").classed("isClicked", true);
        } else {
            d3.select(".override-mode").classed("isClicked", false);
        }

        if (ToolBar.filterMode.inheritance === true) {
            d3.select(".inheritance-mode").classed("isClicked", true);
        } else {
            d3.select(".inheritance-mode").classed("isClicked", false);
        }

        
        if (ToolBar.filterMode.member === true) {
            d3.select(".member-mode").classed("isClicked", true);
        } else {
            d3.select(".member-mode").classed("isClicked", false);
        }

        if (ToolBar.filterMode.use === true) {
            d3.select(".use-mode").classed("isClicked", true);
        } else {
            d3.select(".use-mode").classed("isClicked", false);
        }

        if (ToolBar.filterMode.spring === true) {
            d3.select(".spring-mode").classed("isClicked", true);
        } else {
            d3.select(".spring-mode").classed("isClicked", false);
        }

        if (ToolBar.filterMode.jsf === true) {
            d3.select(".jsf-mode").classed("isClicked", true);
        } else {
            d3.select(".jsf-mode").classed("isClicked", false);
        }
    }
}