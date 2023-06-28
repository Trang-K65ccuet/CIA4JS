import VIEW_CONFIG_VARIABLES from "../../config/ViewConfig";

export class Node {
    constructor(data, graph) {
        this.children = [];
        this.graph = graph;
        // // console.log(data)
        // // console.log(graph)
        this.level = data.depth + 1;
        this.data = data;
        this.x = 0;
        this.y = 0;
        this.width = VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.MIN_WIDTH_NODE;
        this.height = VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.MIN_HEIGHT_NODE;
        this.nodeView = null;
        // // console.log(this)
    }

    collapse() {
        let node = this;
        this.x = this.x;
        this.y = this.y;
        this.width = VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.MIN_WIDTH_NODE;
        this.height = VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.MIN_HEIGHT_NODE;

        // node.removeContextMenuAfterCollapse(node);

        this.children = [];
    }

    removeContextMenuAfterCollapse(node) {
        node.children.forEach(child => {
            if (child !== null && child !== undefined) {
                child.removeContextMenuAfterCollapse(child);
                $.contextMenu( 'destroy', `#id${child.data.id}>.title-text` );
                $(`.context-${child.data.id}`).remove();
            }
        })
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    setSize(width, height) {
        this.width = width;
        this.height = height;
    }

    getFileNode() {
        return this.doGetFileNode(this);
    }

    doGetFileNode(node) {
        if (!node || node.data.kind == "file") {
            return node;
        }
        else {
            return this.doGetFileNode(node.parent);
        }
    }
}