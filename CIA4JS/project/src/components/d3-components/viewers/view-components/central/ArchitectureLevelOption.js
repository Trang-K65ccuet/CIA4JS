import * as d3 from "d3";
import CentralView from "../CentralView";
import {VIEW_IDS} from "./CentralViewTabs";
import {VCGraphData} from "../../../../data-manager/version-compare-graph/VCGraphData";
import DVGraphData from "../../../../data-manager/dependency-graph/DVGraphData";
import SubDVGraphData from "../../../../data-manager/dependency-graph/SubDVGraphData";
var ArchitectureLevelOption = {
	isSettingOn: false,
	createView: function () {
        this.generateContextMenu();
    },
	checkOptionTabVisibility: function () {
		if (this.isSettingOn) {
			d3.select(".arch-level").style("visibility", "visible");
		} else {
			d3.select(".arch-level").style("visibility", "hidden");
		}
	},
	generateContextMenu: function () {
		let bounding_rect = $('.node-bar-title')[0].getBoundingClientRect();
		let centralViewDiv = $(".class-view")[0].getBoundingClientRect();
		let leftViewDiv = $(".left-view")[0].getBoundingClientRect();
		let archContext = d3
			.select(".content")
			.append("div")
			.classed("arch-level", true)
			.style("top", `${bounding_rect.y}px`)
			.style("left", `${leftViewDiv.width / $(window).width() * 100}%`)
			.style("transform", "translate(0%, -100%)")
			.style("width", `${bounding_rect.width}px`)
			// .style("height", `100px`)
			.style("position", "absolute")
			.style("background-color", "#3C3F41")
			.style('overflow-x', 'hidden')
			.style('white-space', 'nowrap')
			.style('text-overflow', 'ellipsis')
			.append("ul");

		archContext
			.append("li")
			.classed("arch-level-1", true)
			.html("RootNode")
			.on("click", function (e) {
				switch (CentralView.currentViewId) {
					case VIEW_IDS.DEPENDENCY_VIEW_ID:
						DVGraphData.graph.expandNodeByArchitectureLevel('lv1');
						break;
					case VIEW_IDS.VERSION_COMPARE_ID:
						VCGraphData.graph.expandNodeByArchitectureLevel('lv1');
						break;
					case VIEW_IDS.SUB_DEPENDENCY_VIEW_ID:
						SubDVGraphData.graph.expandNodeByArchitectureLevel('lv1');
						break;
					case VIEW_IDS.SUB_DEPENDENCY_VIEW_IMPACT_ID:
						SubDVGraphData.graph.expandNodeByArchitectureLevel('lv1');
						break;
				}
			});

		archContext
			.append("li")
			.classed("arch-level-2", true)
			.html("PackageNode")
			.on("click", function (e) {

				switch (CentralView.currentViewId) {
					case VIEW_IDS.DEPENDENCY_VIEW_ID:
						DVGraphData.graph.expandNodeByArchitectureLevel('lv2');
						break;
					case VIEW_IDS.VERSION_COMPARE_ID:
						VCGraphData.graph.expandNodeByArchitectureLevel('lv2');
						break;
					case VIEW_IDS.SUB_DEPENDENCY_VIEW_ID:
						SubDVGraphData.graph.expandNodeByArchitectureLevel('lv2');
						break;
					case VIEW_IDS.SUB_DEPENDENCY_VIEW_IMPACT_ID:
						SubDVGraphData.graph.expandNodeByArchitectureLevel('lv2');
						break;
				}
			});
		archContext
			.append("li")
			.classed("arch-level-3", true)
			.html("Fold All Nodes")
			.on("click", function (e) {
				switch (CentralView.currentViewId) {
					case VIEW_IDS.DEPENDENCY_VIEW_ID:
						DVGraphData.graph.expandNodeByArchitectureLevel('lv3');
						break;
					case VIEW_IDS.VERSION_COMPARE_ID:
						VCGraphData.graph.expandNodeByArchitectureLevel('lv3');
						break;
					case VIEW_IDS.SUB_DEPENDENCY_VIEW_ID:
						SubDVGraphData.graph.expandNodeByArchitectureLevel('lv3');
						break;
					case VIEW_IDS.SUB_DEPENDENCY_VIEW_IMPACT_ID:
						SubDVGraphData.graph.expandNodeByArchitectureLevel('lv3');
						break;
				}
			});
        ArchitectureLevelOption.checkOptionTabVisibility();
	},
};

export default ArchitectureLevelOption;
