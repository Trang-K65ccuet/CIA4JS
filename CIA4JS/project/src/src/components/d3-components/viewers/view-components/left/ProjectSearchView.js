import Utils from '../../../../utils/BasicUltils';
import DATA_PARSER from '../../../../data-manager/DataParser';

const ProjectSearchView = {
    createView: function (dataTree) {
        //Add Search Box
		this.addSearchBox();

		this.addEvent(dataTree);

    },
	redrawProjectSearchView(dataTree) {
		this.addEvent(dataTree);
	},
	addSearchBox() {
		let search_box = document.createElement("div");
		search_box.setAttribute("class", "view project-search-view");
		search_box.innerHTML = `<input type="text" placeholder="Search.." name="search">`;
		document.querySelector(".left-view").prepend(search_box);
	},
	addEvent(dataTree) {
		let temp = [];
		// search node in directory tree
		$(".project-search-view input").on("keydown", function search(e) {
			if (e.keyCode === 13) {
				// // console.log(temp)
				let parents = new Set();
				if (temp.length > 0) {
					//Remove previous search color
					temp.forEach((id) => {
						//check condition if node is file, there cannot a tag so need to check condition
						if (document.querySelector("#node-" + id + " > a") != null)
							document.querySelector("#node-" + id + " > a").style.color = "";
						else
							document.querySelector("#node-" + id).style.color ="";

						parents.add(Utils.findNodeParentById(dataTree, id));
					});
					// // console.log("parent", parents);
					if(parents !== undefined){
						parents.forEach(elem => {
							$("#node-" + elem + " > a").click();
						})
					}
				}

				// get result list on key enter press
				let searchList = [];
				const result = Utils.searchNodesByName(
					$(this).val(),
					DATA_PARSER.collectAllNodes(dataTree)
				);

				// open all ancestors node to current result
				if(result !== undefined)
					result.forEach((item) => {
						item.parentIds.forEach((id) => {
							let displayValue = document.querySelector(
								"#node-" + id + " > ul"
							).style.display;
							if (displayValue == "none") {
								document.querySelector(
									"#node-" + id + " > ul"
								).style.display = "";
							}
						});
						searchList.push(item.id);
					});

				// hightlight color in seach result
				searchList.forEach((id) => {
					//check condition if node is file, there cannot a tag so need to check condition
					if (document.querySelector("#node-" + id + " > a") != null)
						document.querySelector(
							"#node-" + id + " > a"
						).style.color = "#EB3941";
					else
						document.querySelector("#node-" + id).style.color =
							"#EB3941";
				});

				temp = searchList;
			}
		});
	}
}

export default ProjectSearchView;