import DVGraphDataManager from '../../../../data-manager/dependency-graph/DVGraphDataManager';
import * as d3 from 'd3';
import Utils from '../../../../utils/BasicUltils';
import CentralView from "../CentralView";
import {VIEW_IDS} from "./CentralViewTabs";
import {VCGraphData} from "../../../../data-manager/version-compare-graph/VCGraphData";
import DVGraphData from "../../../../data-manager/dependency-graph/DVGraphData";
import SubDVGraphData from "../../../../data-manager/dependency-graph/SubDVGraphData";
import DVRightView from "../right/DVRightView";

let debounceTimer = null;

const DepthSlider = {
    isSettingOn: false,
    create: function(graph) {
        d3.select(".architecture-bar")
			.append("div")
			.classed("nodelevel-wrapper", true)
			.style("padding-left", "5px")
			.append("input")
			.classed("nodelevel-input", true)
			.attr("type", "range")
			.attr("min", 1)
			.attr("max", Utils.getMax(graph.graphData.dataNodeList, "depth").depth)
			.attr("value", 1)
			.on("input", (e) => {
				$("#level-output")[0].innerHTML = ": " + e.target.value;

				$(".nodelevel-input").on("change", (e) => {
                    
                    if(debounceTimer) {
                        clearTimeout(debounceTimer);
                    }
                    
                    debounceTimer = setTimeout(() => {

                        // let old = Date.now();
                        switch (CentralView.currentViewId) {
                            case VIEW_IDS.DEPENDENCY_VIEW_ID:
                                const start = Date.now();
                                DVGraphData.graph.recursiveExpandNodeByNodeLevel(DVGraphData.graph.root, e.target.value);
                                // console.log(Date.now() - start)
                                DVGraphData.graph.updateFullLinks();
                                DVRightView.updateDependencyList(DVGraphData.graph.linkData);
                                break;
                            case VIEW_IDS.VERSION_COMPARE_ID:
                                VCGraphData.graph.recursiveExpandNodeByNodeLevel(VCGraphData.graph.root, e.target.value);
                                VCGraphData.graph.updateFullLinks();
                                DVRightView.updateDependencyList(VCGraphData.graph.linkData);
                                break;
                            case VIEW_IDS.SUB_DEPENDENCY_VIEW_ID:
                                SubDVGraphData.graph.recursiveExpandNodeByNodeLevel(SubDVGraphData.graph.root, e.target.value);
                                SubDVGraphData.graph.updateFullLinks();
                                DVRightView.updateDependencyList(SubDVGraphData.graph.linkData);
                                break;
                            case VIEW_IDS.SUB_DEPENDENCY_VIEW_IMPACT_ID:
                                SubDVGraphData.graph.recursiveExpandNodeByNodeLevel(SubDVGraphData.graph.root, e.target.value);
                                SubDVGraphData.graph.updateFullLinks();
                                DVRightView.updateDependencyList(SubDVGraphData.graph.linkData);
                                break;
                        }
                        // alert((Date.now() - old)/1000);
                    }, 50);

                });
			});
    },
    checkOptionTabVisibility: function() {
        if (this.isSettingOn) {
            d3.select(".nodelevel-wrapper")
              .style("visibility", "visible");
        } else {
            d3.select(".nodelevel-wrapper")
              .style("visibility", "hidden");
        }
    }, 
}

export default DepthSlider;