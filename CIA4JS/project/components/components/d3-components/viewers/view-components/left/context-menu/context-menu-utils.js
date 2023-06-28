import Utils from '../../../../../utils/BasicUltils';
import DVGraphDataManager from '../../../../../data-manager/dependency-graph/DVGraphDataManager';
import FileAPI from '../../../../../../api/FileAPI';
import { Notifier } from '../../../../../utils/NotiUltils';
import * as d3 from "d3";
import CentralView from "../../CentralView";
import {VIEW_IDS} from "../../central/CentralViewTabs";
import {ViewUtils} from "../../../../../utils/ViewUtils";
import DVGraphData from "../../../../../data-manager/dependency-graph/DVGraphData";

let ContextMenuUtils = {
    openInGraph: function() {
        $(".open-in-graph").on("click", (event) => {
			$('.tab-title > div')[0].click()
			let targetId =
				+event.target.closest("#contextmenu").dataset.targetNodeId;
			ContextMenuUtils.openParentNodeInGraph(targetId);
			$(`.id${targetId}`);
		});
    }, 
	openParentNodeInGraph: function (targetNodeId) {
		// // console.log(DVGraphData.graphData.includesIdsMap.get(targetNodeId))
		let parentId = DVGraphData.graphData.includesIdsMap.get(targetNodeId).data.parent;
		if (parentId === undefined) {
			// if targetNode === root
			return;
		} else {
			if (Utils.checkNodeInGraphOpened(parentId)) {
				return;
			}
			ContextMenuUtils.openParentNodeInGraph(parentId);
		}
		Utils.triggleDoubleClick(parentId);
	},
	collapseAllNodes: function() {
		$(".collapse-folder").on("click", (event) => {
			let targetId =
				+event.target.closest("#contextmenu").dataset.targetNodeId;
			$(`#node-${targetId} ul`).hide();
		});
	},
	expandAllNodes: function() {
		$(".expand-folder").on("click", (event) => {
			let targetId =
				+event.target.closest("#contextmenu").dataset.targetNodeId;
			$(`#node-${targetId} ul`).show();
		});
	},
	viewSourceCode: function() {
		$('.view-source').on('click', (event) => {
			ViewUtils.switchSourceCodeLayer();

			let targetId =
				+event.target.closest("#contextmenu").dataset.targetNodeId;
			console.log("777777777777777777777")
			ViewUtils.getSourceCodeDV(targetId);
		})
	}
	
}

export default ContextMenuUtils;