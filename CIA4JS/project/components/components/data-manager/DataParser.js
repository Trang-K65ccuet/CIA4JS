function parseNode(node, depth, parentIds) {
	if (node !== null) {
		let parsedNode = JSON.parse(JSON.stringify(node));
		parsedNode.depth = depth;
		parsedNode.parentIds = parentIds;
		parentIds = parentIds.concat(node.id);

		if (parsedNode.simpleName === "{ROOT}") {
			parsedNode.simpleName = "SRC"
		}

		if (parsedNode.name) {
			parsedNode.simpleName = parsedNode.name;
		}
		// // console.log(node)

		if (node.children !== undefined && node.children.length > 0) {
			parsedNode.children = node.children.map((child) => {
				// // console.log(child)
				if (child !== null && child !== undefined) {
					// // console.log(child)
					child.parent = node.id;
					return parseNode(child, depth + 1, parentIds);
				}
			});
		}
		return parsedNode;
	} else {
		// console.log("Node is null!")
	}
}

function collectAllNodes(node) {
	let nodes = [node];

	if (node.children) {
		node.children.map((child) => {
			if (child !== null && child !== undefined) {
				// // console.log(child)
				child.parent = node.id;
				nodes = nodes.concat(collectAllNodes(child));
			}
		});
	}
	return nodes;
}

function collectChildrenId(children) {
	let ids = [];
	children.map((child) => ids.push(child.id));

	return ids;
}

function createIncludesIdMap(nodes) {
	let includeIdsMap = new Map();
	nodes.forEach((node) => {
		if (node !== null && node !== undefined) {
			let copyNode = JSON.parse(JSON.stringify(node));
			let includeIds = copyNode.parentIds;

			includeIds.push(node.id);
			let data = {
				simpleName: copyNode.simpleName,
				id: copyNode.id,
				includeIds: includeIds,
				data: copyNode
			};

			includeIdsMap.set(node.id, data);
		}
	});

	return includeIdsMap;
}

const DATA_PARSER = {
	//parse node functions
	parseNode,

	//collect nodes
	collectAllNodes,

	//Collect includeIds and
	createIncludesIdMap,
};

export default DATA_PARSER;
