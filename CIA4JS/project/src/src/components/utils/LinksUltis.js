const FILTER_MOD = {
    ALL: "all",
    INHERITANCE: "inheritance",
    INVOCATION: "invocation",
    OVERRIDE: "override",
    USE: "use",
    MEMBER: 'member',
    SPRING: 'spring',
    JSF: 'jsf',
}

function generateArrows(node) {
    let arrows = { callerNode: node.id, calleeNodes: [] };
    arrows.calleeNodes = getAllIdOfDependencyTo(node.dependencyTo);

    return arrows;
}

function getDependenciesOfAllNodes(nodes) {
    let dependencies = [];

    nodes.map(node => {
        dependencies = dependencies.concat(generateArrows(node));
    })
    return dependencies;
}

function preprocessDependencyList(dependencyList) {
    let dependencyMap = new Map();

    dependencyList.forEach(dependency => {
        if (!dependencyMap.has(dependency.callerNode)) {
            let callerObject = {
                callerNode: dependency.callerNode,
                callerNodes: []
            }
            let calleeObject = {
                calleeId: dependency.calleeNode,
                type: dependency.dependency
            }
            callerObject.calleeIds.push(calleeObject);

            dependencyMap.set(dependency.callerNode, callerObject)
        } else {
            let calleeObject = {
                calleeId: dependency.calleeNode,
                type: dependency.type
            }
            dependencyMap.get(dependency.callerNode).calleeIds.push(calleeObject);
        }
    })
    return [...dependencyMap.values()];
}

function getAllIdOfDependencyTo(dependencyTo) {
    let res = [];
    dependencyTo.map(d => res.push({
        dependency: d.dependency,
        node: d.node.id
    }))
    return res;
}

function filterLinks(graph) {
    let filteredDependencies = [];

    // // console.log(graph.dependencies)

    graph.dependencies.forEach(caller => {
        // // console.log(caller);
        filteredDependencies.push({
            callerNode: caller.callerNode,
            calleeNodes: filtering(caller.calleeNodes, graph.filterMode),
        })
    })
    // // console.log(filteredDependencies);
    return filteredDependencies;
}

function filtering(calleeIds, filterMode) {
    let filtered = calleeIds;

    if (filterMode.all == true) {
        return filtered;
    }

    let keys = Object.keys(filterMode);
    let values = Object.values(filterMode);
    let filters = new Set();
    let keyArr = [];
    for(let i=0; i<keys.length; i++) {
        if (values[i] == true) {
            keyArr.push(keys[i]);
        }
    }

    for(let i = 0; i < filtered.length; i++) {
        if (keyArr.includes(FILTER_MOD.INHERITANCE) && filtered[i].dependency.inheritance > 0) {
            filters.add(filtered[i]);
        }
        // if (keyArr.includes(FILTER_MOD.MEMBER) && filtered[i].dependency.member > 0) {
        //     filters.add(filtered[i]);
        // }
        if (keyArr.includes(FILTER_MOD.OVERRIDE) && filtered[i].dependency.override > 0) {
            filters.add(filtered[i]);
        }
        if (keyArr.includes(FILTER_MOD.INVOCATION) && filtered[i].dependency.invocation > 0) {
            filters.add(filtered[i]);
        }
        if (keyArr.includes(FILTER_MOD.USE) && filtered[i].dependency.use > 0) {
            filters.add(filtered[i]);
        }
        if (keyArr.includes(FILTER_MOD.SPRING) && filtered[i].dependency.spring > 0) {
            filters.add(filtered[i]);
        }
        if (keyArr.includes(FILTER_MOD.JSF) && filtered[i].dependency.jsf > 0) {
            filters.add(filtered[i]);
        }
    }
    
    return filters;
}

const LINK_UTILS = {
    getDependenciesOfAllNodes,
    filterLinks,
    preprocessDependencyList
};

export default LINK_UTILS;