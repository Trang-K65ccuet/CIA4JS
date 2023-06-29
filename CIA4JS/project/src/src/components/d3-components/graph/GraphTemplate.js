import VIEW_CONFIG_VARIABLES from "../config/ViewConfig";

import NodeEvent from "./NodeEvent";

import { Node } from "./dependency-graph/Node";
import {DependencyGraphTemplate} from "./dependency-graph/DependencyViewTemplate";
import {VersionCompareNode} from "./version-compare/VersionCompareNode";
import Utils from "../../utils/BasicUltils";
import NodeInforUltils from "../../utils/NodeInforUltils";

export class GraphTemplate {
	constructor(dataAsTree, view) {
		// init view
		this.view = view;
		this.view.style(
			"font-size",
			VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.FONT_SIZE
		);
		this.view.selectAll("g").remove();

		// init root
		this.root = new Node(dataAsTree, this);
		this.root.setPosition(
			VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.ROOT_POSITION.x,
			VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.ROOT_POSITION.y
		);


	}

	moveNode(node, dx, dy) {
		node.x += dx;
		node.y += dy;
		if (node.children) {
			node.children.forEach(d => {
				this.moveNode(d, dx, dy);
			});
		}
	}


	collisionSolve(changedNode) {
		let changes = [changedNode];
		let parent = changedNode.parent;
		// Nếu là node gốc return
		if (!parent) return;
		if (this.getNodeView(parent).node() == null) return;
		let graph = this;
		let sibling = parent.children.slice(0, parent.children.length);
		while (changes.length > 0) {
			let change = changes.pop();
			sibling.splice(sibling.indexOf(change), 1);
			sibling.forEach(function (d, i) {
				let collision = Utils.checkCollision(change, d);
				if (collision[0] != 0 && collision[1] != 0) {
					if (Math.abs(collision[0]) <= Math.abs(collision[1])) {
						graph.moveNode(d, collision[0], 0);
					}
					else {
						graph.moveNode(d, 0, collision[1]);
					}
					changes.push(d);
				}
			});
			graph.updateNode(change);
		}
		// tiép tục cập nhật lớp cha
		this.resizeNodeByChildren(parent);
		this.collisionSolve(parent);
	}

	resizeNodeByChildren(parent) {
		if (!parent) return;
		if (!parent.children || parent.children.length == 0) return;
		if (this.getNodeView(parent).node() == null) return;
		// if() return;
		let padding = 2 * VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.PADDING_NODE;
		let minTopLeft = { x: 999999, y: 999999 };
		let maxBotRight = { x: -999999, y: -999999 };

		// Tìm vị trí bot-right và top-left xa nhất trong các node con
		parent.children.forEach(function (d, i) {
			if (d.x < minTopLeft.x) {
				minTopLeft.x = d.x;
			}
			if (d.x + d.width > maxBotRight.x) {
				maxBotRight.x = d.x + d.width;
			}
			if (d.y < minTopLeft.y) {
				minTopLeft.y = d.y;
			}
			if (d.y + d.height > maxBotRight.y) {
				maxBotRight.y = d.y + d.height;
			}
		});

		// cập nhật node cha
		parent.x = minTopLeft.x - padding;
		parent.y = minTopLeft.y - padding - VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.TITLE_HEIGHT_NODE;
		parent.width = maxBotRight.x - minTopLeft.x + 2 * padding;
		this.resizeNodeByChildren(parent.parent);
	}

	getNodeView(node) {
		return this.view.select(".id" + node.data.id);
	}

	recursiveSearch(id, node) {
		if (node.data.id == id) {
			return node;
		}

		let childrenList = node.children;
		let res = null;
		if (Utils.isValidObject(childrenList)) {
			childrenList.forEach((node) => {
				let temp = this.recursiveSearch(id, node);
				if (temp != null) res = temp;
			});
		}
		return res;
	}

	onDoubleClickNode(e, node) {
		if (document.querySelector("#node-" + node.data.id + " > ul") != null) {
			var displayValue = document.querySelector(
				"#node-" + node.data.id + " > ul"
			).style.display;
			if (displayValue == "none") {
				document.querySelector(
					"#node-" + node.data.id + " > ul"
				).style.display = "";
			}
		}
		NodeEvent.onDoubleClickNode(e, node);
	}
}
