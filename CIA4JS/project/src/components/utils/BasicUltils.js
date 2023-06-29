import Path_Util from "./LineUltils";
import DATA_PARSER from '../data-manager/DataParser';
import { Notifier } from './NotiUltils';
import DVGraphData from "../data-manager/dependency-graph/DVGraphData";

const Utils = {
    getDetailInfoAsHTML: function (d) {
        if (d == undefined)
            return "<b>" + "none"+ "</b>";

        if (d.kind == "class") {
            return "<b>" + d.name + "</b></br>"
                + " - " + d.visibility + ((d.isStatic == "true") ? " - static" : " ") + ((d.isFinal == "true") ? " - final" : " ") + ((d.isAbstract == "true") ? " - abstract" : " ") + "</br>"
                + " - " + d.numOfletiable + " attributes " + "</br>"
                + " - " + d.numOfmethod + " methods";
            /*  + " - " + d.numAttributes + " attributes " + "</br>"
            + " - " + d.numMethods + " methods" + "</br>";*/
        } else if (d.kind == "file") {
            if (d.hasOwnProperty('loc')) {
                if (d.children || d._children)
                    return "<b>" + d.name + "</b></br>"
                        + " - LOC: " + d.loc + "</br>"
                        + " - " + (d.children ? d.children.length : d.children.length) + " child" + Utils.generateTextDependency(d);
                else return "<b>" + d.name + "</b>" + Utils.generateTextDependency(d)
                    + " - LOC: " + d.loc;
            }
            else {
                if (d.children || d._children)
                    return "<b>" + d.name + "</b></br>"
                        + " - " + (d.children ? d.children.length : d.children.length) + " child" + Utils.generateTextDependency(d);
                else return "<b>" + d.name + "</b>" + Utils.generateTextDependency(d);
            }

        } else if (d.kind == "package") {
            return "<b>" + d.name + "</b></br>"
                + " - " + d.kind + "</br>"
                + " - " + (d.children ? d.children.length : d._children.length) + " files" + Utils.generateTextDependency(d);
        } else if (d.kind == "attribute") {
            return "<b>" + d.name + "</b></br>"
                + " - " + d.visibility + ((d.isStatic == "true") ? " - static" : " ") + ((d.isAbstract == "true") ? " - abstract" : " ") + ((d.isFinal == "true") ? " - final" : " ") + "</br>"
                + " - type: <b>" + d.type + "</b>";
        } else if (d.kind == "method") {
            return "<b>" + d.name + "()</b></br>"
                + " - " + d.visibility + ((d.isStatic == "true") ? " - static" : " ") + ((d.isAbstract == "true") ? " - abstract" : " ") + ((d.isFinal == "true") ? " - final" : " ") + "</br>"
                + " - return: <b>" + d.return + "</b></br>"
                + " - " + d.parameter.length + " parameters";
        } else if (d.kind == "xmlElement") {

            return "<b>" + d.name + "</b></br>"
                + " - lineNumber: " + d.lineNumber + "</br>"
                + " - columnNumber: " + d.columnNumber + "</br>"
                + Utils.generateTextTagAttr(d);

        }
        else {
            return "<b>" + d.name + "</b></br>"
                + " - " + d.kind + Utils.generateTextDependency(d);
        }
    }
    ,
    expand: function (d) {
        /*
         * if(d.type=="file") let children =
         * (d.children)?d.children:d._children;
         */
        if (d.children) {
            d._children = d.children;
            //._children = null;
        }
        /*
         * if(children) children.forEach(Utils.expand);
         */
    }
    ,
    collapse: function (d) {
        if (d._children) {
            d._children = null;
            d.children.forEach(Utils.collapse);
        }
    }
    ,
    expandAll: function (d) {
        if (d.kind == "class")
            return;

        if (!Utils.isValidObject(d._children) || d._children.length == 0) {
            d._children = d.children;
        }

        d._children.forEach(child => Utils.expandAll(child));
    }
    ,
    collapseAll: function (data) {
        if (data._children == null)
            return;

        data._children.forEach(Utils.collapse);
        Utils.collapse(data);
    }
    ,
    expandByDepth: function (data, depth) {
        if (depth <= 0)
            Utils.collapse(data);
        else
            Utils.expand(data);
        if (data.children) {
            data.children.forEach(function (d) {
                Utils.expandByDepth(d, depth + 1);
            })
        }
    }
    ,
    isExpanded: function (d) {
        if (d._attributes && d._attributes != null)
            return false;
        return true;
    }
    ,
    getAllExpandingNodeWithDepth: function (root, depth) {
        root.depth = depth;
        let nodes = [root];
        if (root._children) {
            root._children.forEach(function (child) {
                child.parent = root;
                nodes = nodes.concat(Utils.getAllExpandingNodeWithDepth(child, depth + 1));
            });
        }
        return nodes;
    }
    ,
    findPath: function (link) {
        let src = link.source;
        let des = link.target;
        let bounding_src = {x: src.x, y: src.y, width: CLASSDRAWER_CONFIG.WIDTH, height: src.height};
        let bounding_des = {x: des.x, y: des.y, width: CLASSDRAWER_CONFIG.WIDTH, height: des.height};
        // return Utils.middlePointLink(bounding_src,bounding_des);
        return Path_Util.findLinkOfTwoRect(bounding_src, bounding_des);
    }
    ,
    findPathForView: function (link, padding) {
        let src = link.source;
        let des = link.destination;
        let bounding_src = {
            x: src.x + padding,
            y: src.y + padding,
            width: src.width - padding,
            height: src.height - padding
        };
        let bounding_des = {
            x: des.x + padding,
            y: des.y + padding,
            width: des.width - padding,
            height: des.height - padding
        };
        // return Utils.middlePointLink(bounding_src,bounding_des);
        return Path_Util.findLinkOfTwoRect(bounding_src, bounding_des);
    },

    middlePointLink: function (rect1, rect2) {
        let verRelation = Utils.getVerticalRelation(rect1, rect2);
        let horRelation = Utils.getHorizontalRelation(rect1, rect2);
        if (verRelation == 0) {
            if (horRelation == 0)
                return {
                    begin: {x: rect1.x + rect1.width / 2, y: rect1.y + rect1.height / 2},
                    end: {x: rect2.x + rect2.width / 2, y: rect2.y + rect2.height / 2}
                };
            if (horRelation == 1)
                return {
                    begin: {x: rect1.x, y: rect1.y + rect1.height / 2},
                    end: {x: rect2.x + rect2.width, y: rect2.y + rect2.height / 2}
                };
            return {
                begin: {x: rect1.x + rect1.width, y: rect1.y + rect1.height / 2},
                end: {x: rect2.x, y: rect2.y + rect2.height / 2}
            };
        }
        if (verRelation == 1) {
            if (horRelation == 0)
                return {
                    begin: {x: rect1.x + rect1.width / 2, y: rect1.y},
                    end: {x: rect2.x + rect2.width / 2, y: rect2.y + rect2.height}
                };
            if (horRelation == 1)
                return {
                    begin: {x: rect1.x, y: rect1.y},
                    end: {x: rect2.x + rect2.width, y: rect2.y + rect2.height}
                };
            return {begin: {x: rect1.x + rect1.width, y: rect1.y}, end: {x: rect2.x, y: rect2.y + rect2.height}};
        }
        if (verRelation == -1) {
            if (horRelation == 0)
                return {
                    begin: {x: rect1.x + rect1.width / 2, y: rect1.y + rect1.height},
                    end: {x: rect2.x + rect2.width / 2, y: rect2.y}
                };
            if (horRelation == -1)
                return {
                    begin: {x: rect1.x + rect1.width, y: rect1.y + rect1.height},
                    end: {x: rect2.x, y: rect2.y}
                };
            return {begin: {x: rect1.x, y: rect1.y + rect1.height}, end: {x: rect2.x + rect2.width, y: rect2.y}};
        }
    }
    ,
    getHorizontalRelation: function (rect1, rect2) {
        if ((rect1.x + rect1.width) < rect2.x)
            return -1;
        else if ((rect2.x + rect2.width) < rect1.x)
            return 1;
        else
            return 0;
    }
    ,
    getVerticalRelation: function (rect1, rect2) {
        if ((rect1.y + rect1.height) < rect2.y)
            return -1;
        else if ((rect2.y + rect2.height) < rect1.y)
            return 1;
        else
            return 0;
    }
    ,
    // return collision corresponding obj1 position
    checkCollision: function (obj1, obj2) {
        let deltaX = 0, deltaY = 0;
        let BotRight1 = {x: obj1.x + obj1.width, y: obj1.y + obj1.height};
        let BotRight2 = {x: obj2.x + obj2.width, y: obj2.y + obj2.height};
        if (obj1.x <= obj2.x) {
            if (BotRight1.x <= obj2.x)
                return [0, 0];
            else {
                deltaX = BotRight1.x - obj2.x;
            }
        } else {
            if (BotRight2.x <= obj1.x)
                return [0, 0];

            else {
                deltaX = -Math.max(BotRight2.x - obj1.x, 0);
            }
        }
        if (obj1.y <= obj2.y) {
            if (BotRight1.y <= obj2.y)
                return [0, 0];
            else {
                deltaY = BotRight1.y - obj2.y;
            }
        } else {
            if (BotRight2.y <= obj1.y)
                return [0, 0];
            else {
                deltaY = -(BotRight2.y - obj1.y);
            }
        }
        ;
        return [deltaX, deltaY];
    }
    ,
    manhattanDistance: function (p1, p2) {
        return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
    }
    ,
    getRandomColor: function () {
        let letters = '0123456789ABCDEF'.split('');
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[15 - Math.floor(Math.random() * 3)];
        }
        return color;
    }
    ,
    parseBoolean: function (value) {
        return value == "true";
    }
    ,
    cloneObject: function (object) {
        let temp = jQuery.extend(true, {}, object);
        return jQuery.extend(true, {}, object);
    }
    ,
    findContainerBoxContain2Rect: function (rect1, rect2) {
        let result = {};
        result.x = (rect1.left < rect2.left) ? rect1.left : rect2.left;
        result.y = (rect1.top < rect2.top) ? rect1.top : rect2.top;
        result.right = ((rect1.left + rect1.width) > (rect2.left + rect2.width)) ? (rect1.left + rect1.width) : (rect2.left + rect2.width);
        result.bot = ((rect1.top + rect1.height) > (rect2.top + rect2.height)) ? (rect1.top + rect1.height) : (rect2.top + rect2.height);
        result.width = result.right - result.x;
        result.height = result.bot - result.y;
        return result;
    }
    ,
    getDisplayName: function (d) {
        if (d.kind == "attribute")
            return " - " + Data.getNodeById(d.classID).name + "." + d.name;
        else if (d.kind == "method")
            return " - " + Data.getNodeById(d.classID).name + "." + d.name + "()";
        else
            return " - " + d.name;
    }
    ,
    convertNameToShorterForDependenceView: function (d) {
        if (d.kind == "package") {
            let parts = d.name.split(".").reverse();
            if (parts.length > 2) return "..." + parts.splice(0, 2).reverse().join(".");
            return d.name;
        } else {
            let name;
            if (d.kind == "method") name = d.name + "()";
            else name = d.name;
            if (name.length > FULLGRAPH_CONFIG.MAX_NAME_LENGTH) return name.substring(0, FULLGRAPH_CONFIG.MAX_NAME_LENGTH - 3) + "...";
            else return name;
        }
    }
    ,
    findDependency: function (id) {
        let result;
        Data.dependences.forEach(function (dependency) {
            if (dependency.id == id) {
                result = dependency;
                return;
            }
        })
        return result;
    }
    ,
    generateTextTagAttr: function (d) {

        let a = "&nbsp";
        let b = d.listAttr.toString();
        if (b.length > 0)
        {
            let arrAttr = b.split(",");
            if (arrAttr.length > 0) {
                a += "<b>" + "Attributes (" + arrAttr.length + ")" + "</b></br>";
                arrAttr.forEach(function (oneCall) {
                    a += "&nbsp -"+ oneCall + "<br>";
                });
            }
        }
        else{
            a += "<b>" + "Attributes ("+b.length+")"+ "</b></br>";
        }
        return a;
    },
    generateTextDependency: function (d) {
        let call = [];
        let called = [];
        DependenceView.linkData.forEach(function (oneLink) {
            if (oneLink.source.data.id == d.id) {
                let temp = {};
                temp.name = oneLink.destination.data.name;
                temp.typeDependency = oneLink.typeDependency;
                call.push(temp);
            }
            if (oneLink.destination.data.id == d.id) {
                let temp = {};
                temp.name = oneLink.source.data.name;
                temp.typeDependency = oneLink.typeDependency;
                called.push(temp);
            }
        });
        let a = "";
        if (call.length > 0) {
            a = "</br><b>" + "Calls (" + call.length + ")" + "</b></br>";
            call.forEach(function (oneCall,i) {
                if (i < call.length - 1)  a += "&nbsp -" + oneCall.name + " : " + oneCall.typeDependency + "<br>";
                else a += "&nbsp -" + oneCall.name + " : " + oneCall.typeDependency;
            });
        }
        if (called.length > 0) {
            a += "</br><b>" + "Called by (" + called.length + ")" + "</b></br>";
            called.forEach(function (oneCall) {
                a += "&nbsp -" + oneCall.name + " : " + oneCall.typeDependency + "<br>";
            });

        }
        return a;
    }
    ,
    onPartitionDataResponse: function (callback) {
        let data = $("#load-data-form_ld-data").text();

        if (data != "") {
            callback(data);
        }

        setTimeout(this.onPartitionDataResponse(callback), 100);
    }
    ,

    loadChildrenData: function (node, type) {
        return new Promise((resolve, reject) => {
            let currentNode = Data.getNodeById(node.id);
            if (!Utils.isValidObject(currentNode) || currentNode.hasChildren == false)
                resolve(null);

            env.load_data_type = type;
            TREE_API.loadData(node.id).done(res => resolve(res));
        });
    }
    ,

    isValidObject(object) {
        return object != null && object != undefined;
    }
    ,

    isEmptyArray(object) {
        return this.isValidObject(object) && object.length == 0;
    },

    getMaxValueInArray(array) {
        let max = array[0];
        for (let i = 1; i < array.length; i++) {
            if (array[i] > max)
                max = array[i];
        }
        return max;
    },

    getPositionOfMaxValueInArray(array) {
        let max = 0;
        for (let i = 1; i < array.length; i++) {
            if (array[i] > array[max])
                max = i;
        }
        return max;
    },

    searchNodesByName(string, array) {
        if(string.length < 3) {
            Notifier.displayError('Too specific! Try with more characters.');
            return;
        }
        let result = array.filter((item) => item.simpleName.toLowerCase().includes(string.toLowerCase()))
        if(result.length==0){
            Notifier.displayError("There's no results!")
        } else return result;
    },

    findNodeById(root, id) {
        let allNodes = DATA_PARSER.collectAllNodes(root);
        let [node] = allNodes.filter((item) => item.id == id);
        return node;
    },

    findNodeParentById(root, id){
        let allNodes = DATA_PARSER.collectAllNodes(root);
        let node = allNodes.filter((item) => item.id == id);
        return node[0].parent;
    },

    removeUnusedComponents(queries){
        Array.from(queries).forEach(query => {
            const component = document.querySelector(query);
            if(component != null)
                component.remove();
        })
    },

    emptyContentDiv: function (components) {
        Array.from(components).forEach( e => {
            const component = document.querySelector(e);
            if(component != null)
                component.innerHTML = "";
        })
    },

    createElementFromHTML(htmlString) {
		let div = document.createElement("div");
		div.innerHTML = htmlString.trim();

		// Change this to div.childNodes to support multiple top-level nodes
		return div.firstChild;
	},
    /**
     * @param {number} id
     * @returns {boolean}
     * @description return true if node is opened, false if node is closed
     * */
    checkNodeInGraphOpened(id) {
        let checkNode = $(`.id${id}`);
        // not mounted in dom
        if(checkNode.length === 0){
            return false;
        }
        let childNodes = Utils.findNodeById(DVGraphData.graphData.dataTree, id).children;
        if(childNodes.length === 0){
            return false;
        }
        if($(`.id${id} [class^=id]`).length === 0) {
            return false;
        } 
        return true;
    },

    getMax(arr, prop) {
        let max;
        for (let i=0 ; i<arr.length ; i++) {
            if (max == null || parseInt(arr[i][prop]) > parseInt(max[prop]))
                max = arr[i];
        }
        return max;
    },

    triggleDoubleClick(nodeId) {
        let node = document.getElementById(`id${nodeId}`).children[2];
		node.dispatchEvent(new MouseEvent("dblclick"));
    }

}

export default Utils;
