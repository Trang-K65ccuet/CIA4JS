import ContextMenu from "./left/context-menu/ContextMenu";
import ProjectSearchView from "./left/ProjectSearchView";
import ProjectView from "./left/ProjectView";
import Utils from "../../../utils/BasicUltils";
import VersionView from "./left/VersionView";
const LeftView = {
	dataTree: {},
	createView: function (dataTree) {
		// Utils.emptyContentDiv([".left-view"]);
		//Create Project View
		ProjectView.createView(dataTree);

		// Create project search view
		ProjectSearchView.createView(dataTree);

		//Import contextmenu
		ContextMenu.createContextMenu();

		VersionView.createView();

		// Add delete button
		let remove_result = `<button type="button" class="remove-result">X</button>`;
		let remove_dom = Utils.createElementFromHTML(remove_result);
		$(".project-search-view").append(remove_dom);

		// TODO: Handle remove result button event
		$(".remove-result").on("click", function () {
			if ($(".project-search-view input")[0].value == "") return;
			else {
				// Clear search query
				$(".project-search-view input")[0].value = "";

				// Remove color on search
				$("#node-0 a, #node-0 li").each((index, element) => {
					if ($(element)[0].style !== undefined) {
						$(element)[0].style.color = "";
					}
				});

				// // Collapse nodes to depth = 1
				// $("#node-0 ul").hide();
				// $(`#node-0 > ul`).show();
			}
		});
	},
	redrawLeftView(dataTree) {
		ProjectView.redrawProjectView(dataTree);
		ProjectSearchView.redrawProjectSearchView(dataTree);
		ContextMenu.createContextMenu();
	}
};

export default LeftView;
