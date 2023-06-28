import Utils from "../../../../../utils/BasicUltils";
import ContextMenuUtils from './context-menu-utils';

let ContextMenu = {
	createContextMenu: function () {
		let contextHTML = `<div id="contextmenu">
                                <div class="list">
                                    <div class="open-in-graph">
                                        <i class="fa fa-magic"></i>
                                        Open in Graph
                                    </div>
									<div class="collapse-folder">
                                        <i class="fas fa-minus-square"></i>
                                        Collapse Folder
                                    </div>
									<div class="expand-folder">
                                        <i class="fas fa-plus-square"></i>
                                        Expand Folder
                                    </div>
									<div class="view-source">
										<i class="fas fa-arrow-alt-circle-up"></i>
										View Source Code
                                    </div>
                                </div>
                            </div>`;
		let contextDom = Utils.createElementFromHTML(contextHTML);
		$("body").append(contextDom);

		// var elems = document.querySelectorAll('.project-view li');
		let elems = $(".project-view li > a, .project-view li > span").get();

		elems.forEach((child) => {
			child.addEventListener("contextmenu", function (event) {
				event.preventDefault();
				let x = event.clientX + "px";
				let y = event.clientY + "px";
				let contextmenu = document.querySelector("#contextmenu");
				contextmenu.style.top = y;
				contextmenu.style.left = x;
				contextmenu.classList.add("active");
				let targetNodeId = event.target
					.closest("li[id^=node-]")
					.id.replace(/\D/g, "");
				contextmenu.dataset.targetNodeId = targetNodeId;
			});
		});

		window.addEventListener("click", function (event) {
			let contextmenu = document.querySelector("#contextmenu");

			if (contextmenu) {
				contextmenu.classList.remove("active");
			}
		});


		// Change view option for specific java node type
		let folder =
			$(`
			.root-node > a, 
			.package-node > a, 
			.xml-file-node > a,
			.xml-tag-node > a,
			.resource-root-node > a,
			.project-root-node > a
			`).get();

		folder.forEach(elem => {
			$(elem).on("contextmenu", () => {
				$('.view-source').hide();
			})
		})
		let file = $('.class-node > a, .interface-node > a, .method-node > a, .enum-node > a, .initialize-node > a, .field-node > a, .class-node > span, .interface-node > span, .enum-node > span, .initialize-node > span, .method-node > span, .field-node > span').get();
		file.forEach(elem => {
			$(elem).on("contextmenu", () => {
				$('.view-source').show();
			})
		})

		ContextMenuUtils.openInGraph();
		ContextMenuUtils.collapseAllNodes();
		ContextMenuUtils.expandAllNodes();
		ContextMenuUtils.viewSourceCode();

	},
};

// disable window context menu
window.addEventListener("contextmenu", (e) => e.preventDefault());

export default ContextMenu;
