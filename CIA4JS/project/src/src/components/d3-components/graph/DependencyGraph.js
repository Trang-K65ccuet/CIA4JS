import * as d3 from "d3";
import {GraphTemplate} from "./GraphTemplate";
import NodeEvent from "./NodeEvent";
import VIEW_CONFIG_VARIABLES from "../config/ViewConfig";
import JAVA_TYPE from "../config/JavaType";
import CS_TYPE from "../config/CSType";
import NODEJS_TYPE from "../config/NodeJSType";
import JS_TYPE from "../config/JavascriptType";
import PHP_TYPE from "../config/PHPType";
import NodeInforUltils from "../../utils/NodeInforUltils";
import PROJECT_ICON from "../config/ViewIcon";
import ARCHITECTURE_LEVEL from "../config/ArchitectureLevel";
import {Node} from "./dependency-graph/Node";
import DVRightView from "../viewers/view-components/right/DVRightView";
import Utils from "../../utils/BasicUltils";
import LINK_UTILS from "../../utils/LinksUltis";
import {Link} from "./dependency-graph/Link";
import XML_TYPE from "../config/XmlType";
import {DOMUtils} from "../../utils/DOMUtils";
import CentralView from "../viewers/view-components/CentralView";
import {VIEW_IDS} from "../viewers/view-components/central/CentralViewTabs";
import DVGraphData from "../../data-manager/dependency-graph/DVGraphData";
import { VCGraphData } from "../../data-manager/version-compare-graph/VCGraphData";

export class DependencyGraph extends GraphTemplate {
    constructor(dataTree, dependencies, view, includesIDMaps, xmlNodeTree) {
        super(dataTree, view);

        // if (xmlNodeTree) {
        //     this.xmlNodeTree = new Node(xmlNodeTree, this);
        // }

        this.dependencies = dependencies;

        this.filterMode = {
            all: true,
            use: false,
            member: false,
            invocation: false,
            override: false,
            inheritance: false,
            spring: false,
        };

        this.linkData = [];

        this.includesIDMaps = includesIDMaps;

        this.links = view.select(".link_fullgraph").selectAll("g").remove();
    }

    changeFilterMode(mode) {
        this.filterMode = mode;
        // // console.log(this.filterMode);
        this.updateFullLinks();
        // // console.log(this.linkData)
    };


    newNode(node) {
        let contextMenu = document.querySelector(`.context-${node.data.id}`);
        if (contextMenu) {
            $.contextMenu( 'destroy', `#id${node.data.id}>.title-text` );
            $(`.context-${node.data.id}`).remove();
        }

        let graph = this;

        let parentView = (node.parent != undefined) ? this.getNodeView(node.parent) : graph.view;

        let nodeView = parentView.append('g')
            .data([node])

        nodeView.call(NodeEvent.drag);

        nodeView.attr("class", "id" + node.data.id).attr("id", "id" + node.data.id);
        nodeView.attr('x', node.x)
            .attr('y', node.y);

        let background = nodeView.append('rect')
            .classed('background', true)
            // .on("mouseover", NodeEvent.highlightDependencies)
            // .on('mouseout', NodeEvent.unHighlightDependencies);

        let title = nodeView.append("rect")
            .classed("title", true)
            .on("mouseover", function (e) {
                NodeEvent.highlightDependencies(e, node);
                // NodeEvent.showNodeInforWhenMouseHover(e, node, nodeView, graph.linkData);
            })
            .on('mouseout', function (e, node) {
                NodeEvent.unHighlightDependencies(e, node);
                // NodeEvent.clearNodeInforWhenMouseOut();
            });


        let text = nodeView.append('text')
            .classed('title-text', true)
            .on("mouseover", function (e) {
                NodeEvent.highlightDependencies(e, node);
                NodeEvent.showNodeInforWhenMouseHover(e, node, nodeView, graph.linkData);
            })
            .on('mouseout', function (e, node) {
                NodeEvent.unHighlightDependencies(e, node);
                NodeEvent.clearNodeInforWhenMouseOut();
            })

        let icon = nodeView.append("svg")
            .classed("node-icon", true)
            .attr("xmlns", "http://www.w3.org/2000/svg")
            .attr("x", node.x + VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.ICON_PADDING_LEFT)
            .attr("y", node.y + VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.ICON_PADDING_TOP)
            .attr("width", VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.ICON_SIZE)
            .attr("height", VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.ICON_SIZE)
            .attr("viewBox", "0 0 16 16")

        this.addNodeIcon(node, icon);

        text.attr("x", node.x + VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.TEXT_POSITION.x)
            .attr("y", node.y + VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.TEXT_POSITION.y)
            .attr("fill", "white")
            .style("cursor", "pointer")
            .attr("font-size", VIEW_CONFIG_VARIABLES.CLASSDRAWER_CONFIG.NORMAL_FONT_SIZE)
            // .on("mouseover", NodeEvent.onMouseOverTitleText)
            // .on("mouseout", NodeEvent.onMouseOutTitleText)
            .on("dblclick", graph.onDoubleClickNode)
            .text((node.data.entityClass === JAVA_TYPE.JAVA_ROOT_NODE) ?
                "SRC" :
                NodeInforUltils.convertNameToShorter(node.data, node.children));

        background.attr("x", node.x + VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.PADDING_NODE)
            .attr("y", node.y + VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.PADDING_NODE)
            .attr("rx", "3").attr("ry", "3")
            .attr("width", node.width - VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.PADDING_NODE)
            .attr("height", node.height - VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.PADDING_NODE)
            .attr("fill", "#E8E8E8")
            .attr("stroke", VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.STROKE_COLOR)
            .on("dblclick", function (event) {
                event.stopPropagation()
            });

        title.attr("x", node.x + VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.PADDING_NODE)
            .attr("y", node.y + VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.PADDING_NODE)
            .attr("rx", "3")
            .attr("ry", "3")
            .attr("width", node.width - VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.PADDING_NODE)
            .attr("height", VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.TITLE_HEIGHT_NODE)
            .attr("fill", VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.TITLE_COLOR)
            .on("dblclick", graph.onDoubleClickNode)
            .style("cursor", "pointer");
    }

    newXmlNode(node) {
        let graph = this

        let parentView = (node.parent != undefined) ? this.getNodeView(node.parent) : graph.view;

        let nodeView = parentView.append('g')
            .data([node])
            .call(NodeEvent.drag);

        nodeView.attr("class", "id" + node.data.id).attr("id", "id" + node.data.id);
        nodeView.attr('x', node.x)
            .attr('y', node.y);

        let background = nodeView.append('rect')
            .classed('background', true)
        // .on("mouseover", NodeEvent.highlightDependencies)
        // .on('mouseout', NodeEvent.unHighlightDependencies);

        let node_bounding = nodeView.node().getBoundingClientRect();

        let title = nodeView.append("rect")
            .classed("title", true)
        .on("mouseover", function (e) {
            NodeEvent.highlightDependencies(e, node);
            NodeEvent.showNodeInforWhenMouseHover(e, node, nodeView, graph.linkData);
        })
        .on('mouseout', function (e, node) {
            NodeEvent.unHighlightDependencies(e, node);
            NodeEvent.clearNodeInforWhenMouseOut();
        });


        let text = nodeView.append('text')
            .classed('title-text', true)
        .on("mouseover", function (e) {
            NodeEvent.highlightDependencies(e, node);
            NodeEvent.showNodeInforWhenMouseHover(e, node, nodeView, graph.linkData);
        })
        .on('mouseout', function (e, node) {
            NodeEvent.unHighlightDependencies(e, node);
            NodeEvent.clearNodeInforWhenMouseOut();
        })


        // .on("contextmenu", function (e) {
        //     if (node.data.entityClass !== JAVA_TYPE.JAVA_ROOT_NODE &&
        //         node.data.entityClass !== JAVA_TYPE.JAVA_PACKAGE_NODE) {
        //         createNodeContext(e, GRAPH_NODE_CONTEXT, node.data.id);
        //     }
        // });

        let icon = nodeView.append("svg")
            .classed("node-icon", true)
            .attr("xmlns", "http://www.w3.org/2000/svg")
            .attr("x", node.x + VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.ICON_PADDING_LEFT)
            .attr("y", node.y + VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.ICON_PADDING_TOP)
            .attr("width", VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.ICON_SIZE)
            .attr("height", VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.ICON_SIZE)
            .attr("viewBox", "0 0 16 16")

        this.addNodeIcon(node, icon);

        text.attr("x", node.x + VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.TEXT_POSITION.x)
            .attr("y", node.y + VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.TEXT_POSITION.y)
            .attr("fill", "white")
            .style("cursor", "pointer")
            .attr("font-size", VIEW_CONFIG_VARIABLES.CLASSDRAWER_CONFIG.NORMAL_FONT_SIZE)
            // .on("mouseover", NodeEvent.onMouseOverTitleText)
            // .on("mouseout", NodeEvent.onMouseOutTitleText)
            .on("dblclick", graph.onDoubleClickNode)
            .text((node.data.entityClass == XML_TYPE.XML_ROOT_NODE) ?
                "XML ROOT" :
                // NodeInforUltils.convertNameToShorter(node.data));
                node.data.name);

        background.attr("x", node.x + VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.PADDING_NODE)
            .attr("y", node.y + VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.PADDING_NODE)
            .attr("rx", "3").attr("ry", "3")
            .attr("width", node.width - VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.PADDING_NODE)
            .attr("height", node.height - VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.PADDING_NODE)
            .attr("fill", "#E8E8E8")
            .attr("stroke", VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.STROKE_COLOR)
            .on("dblclick", function (event) {
                event.stopPropagation()
            });

        title.attr("x", node.x + VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.PADDING_NODE)
            .attr("y", node.y + VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.PADDING_NODE)
            .attr("rx", "3")
            .attr("ry", "3")
            .attr("width", node.width - VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.PADDING_NODE)
            .attr("height", VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.TITLE_HEIGHT_NODE)
            .attr("fill", VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.TITLE_COLOR)
            .on("dblclick", graph.onDoubleClickNode)
            .style("cursor", "pointer");
    }

    addNodeIcon(node, icon) {
        switch (node.data.entityClass) {
            //Java
            case JAVA_TYPE.JAVA_ROOT_NODE:
                icon.html(PROJECT_ICON.ROOTNODE_ICON);
                break;
            case JAVA_TYPE.JAVA_PACKAGE_NODE:
                icon.html(PROJECT_ICON.PACKAGE_ICON);
                break;
            case JAVA_TYPE.JAVA_CLASS_NODE:
                icon.html(PROJECT_ICON.CLASS_ICON);
                break;
            case JAVA_TYPE.JAVA_INTERFACE_NODE:
                icon.html(PROJECT_ICON.INTERFACE_NODE);
                break;
            case JAVA_TYPE.JAVA_ENUM_NODE:
                icon.html(PROJECT_ICON.ENUM_ICON);
                break;
            case JAVA_TYPE.JAVA_INITIALIZER_NODE:
                icon.html(PROJECT_ICON.INITIALIZE_ICON);
                break;
            case JAVA_TYPE.JAVA_METHOD_NODE:
                icon.html(PROJECT_ICON.METHOD_ICON);
                break;
            case JAVA_TYPE.JAVA_FIELD_NODE:
                icon.html(PROJECT_ICON.FIELD_ICON);
                break;
            case XML_TYPE.XML_FILE_NODE:
                icon.html(PROJECT_ICON.XML_FILE_NODE);
                break;
            case XML_TYPE.XML_TAG_NODE:
                icon.html(PROJECT_ICON.XML_TAG_NODE);
                break;
            case JAVA_TYPE.PROJECT_ROOT_NODE:
                icon.html(PROJECT_ICON.PROJECT_ROOT_NODE)
                break;
            case JAVA_TYPE.RESOURCE_ROOT_NODE:
                icon.html(PROJECT_ICON.RESOURCE_ROOT_NODE);
                break;
            // CSharp
            case CS_TYPE.CS_ROOT_NODE:
                icon.html(PROJECT_ICON.ROOTNODE_ICON);
                break;
            case CS_TYPE.CS_FOLDER_NODE:
                icon.html(PROJECT_ICON.CS_FOLDER_ICON);
                break;
            case CS_TYPE.CS_FILE_NODE:
                icon.html(PROJECT_ICON.CS_FILE_ICON);
                break;
            case CS_TYPE.CS_CLASS_NODE:
                icon.html(PROJECT_ICON.CLASS_ICON);
                break;
            case CS_TYPE.CS_STRUCT_NODE:
                icon.html(PROJECT_ICON.CS_STRUCT_ICON);
                break;
            case CS_TYPE.CS_INTERFACE_NODE:
                icon.html(PROJECT_ICON.INTERFACE_NODE);
                break;
            case CS_TYPE.CS_DELEGATE_NODE:
                icon.html(PROJECT_ICON.CS_DELEGATE_ICON);
                break;
            case CS_TYPE.CS_ENUM_NODE:
                icon.html(PROJECT_ICON.ENUM_ICON);
                break;
            case CS_TYPE.CS_EVENT_FIELD_NODE:
                icon.html(PROJECT_ICON.CS_EVENT_ICON);
                break;
            case CS_TYPE.CS_METHOD_NODE:
                icon.html(PROJECT_ICON.METHOD_ICON);
                break;
            case CS_TYPE.CS_LOCAL_FUNCTION_NODE:
                icon.html(PROJECT_ICON.CS_LOCAL_FUNCTION_ICON);
                break;
            case CS_TYPE.CS_PROPERTY_NODE:
                icon.html(PROJECT_ICON.CS_PROPERTY_ICON);
                break;
            case CS_TYPE.CS_FIELD_NODE:
                icon.html(PROJECT_ICON.FIELD_ICON);
                break;
            
            //NodeJS
            case NODEJS_TYPE.NODEJS_ROOT_NODE:
                icon.html(PROJECT_ICON.ROOTNODE_ICON);
                break;
            case NODEJS_TYPE.NODEJS_FOLDER_NODE:
                icon.html(PROJECT_ICON.CS_FOLDER_ICON);
                break;
            case NODEJS_TYPE.NODEJS_FILE_NODE:
                icon.html(PROJECT_ICON.PACKAGE_ICON);
                break;
            case NODEJS_TYPE.NODEJS_CLASS_NODE:
                icon.html(PROJECT_ICON.CLASS_ICON);
                break;
            case NODEJS_TYPE.NODEJS_INTERFACE_NODE:
                icon.html(PROJECT_ICON.INTERFACE_NODE);
                break;
            case NODEJS_TYPE.NODEJS_ENUM_NODE:
                icon.html(PROJECT_ICON.ENUM_ICON);
                break;
            case NODEJS_TYPE.NODEJS_METHOD_NODE:
                icon.html(PROJECT_ICON.METHOD_ICON);
                break;
            case NODEJS_TYPE.NODEJS_FUNCTION_NODE:
                icon.html(PROJECT_ICON.CS_LOCAL_FUNCTION_ICON);
                break;
            case NODEJS_TYPE.NODEJS_INHERITANCE_NODE:
                icon.html(PROJECT_ICON.CS_LOCAL_FUNCTION_ICON);
                break;
            case NODEJS_TYPE.NODEJS_CALL_NODE:
                icon.html(PROJECT_ICON.CS_LOCAL_FUNCTION_ICON);
                break;
            case NODEJS_TYPE.NODEJS_NEW_NODE:
                icon.html(PROJECT_ICON.CS_LOCAL_FUNCTION_ICON);
                break;
            case NODEJS_TYPE.NODEJS_OBJECT_NODE:
                icon.html(PROJECT_ICON.CS_LOCAL_FUNCTION_ICON);
                break;
            case NODEJS_TYPE.NODEJS_VARIABLE_NODE:
                icon.html(PROJECT_ICON.CS_LOCAL_FUNCTION_ICON);
                break;
            case NODEJS_TYPE.NODEJS_TYPE_NODE:
                icon.html(PROJECT_ICON.CS_LOCAL_FUNCTION_ICON);
                break;
            case NODEJS_TYPE.NODEJS_TYPE_REFERENCE_NODE:
                icon.html(PROJECT_ICON.CS_LOCAL_FUNCTION_ICON);
                break;
            
            //Javascript
            case JS_TYPE.JS_ROOT_NODE:
                icon.html(PROJECT_ICON.ROOTNODE_ICON);
                break;
            case JS_TYPE.JS_FOLDER_NODE:
                icon.html(PROJECT_ICON.CS_FOLDER_ICON);
                break;
            case JS_TYPE.JS_FILE_NODE:
                icon.html(PROJECT_ICON.PACKAGE_ICON);
                break;
            case JS_TYPE.JS_CLASS_NODE:
                icon.html(PROJECT_ICON.CLASS_ICON);
                break;
            case JS_TYPE.JS_INTERFACE_NODE:
                icon.html(PROJECT_ICON.INTERFACE_NODE);
                break;
            case JS_TYPE.JS_ENUM_NODE:
                icon.html(PROJECT_ICON.ENUM_ICON);
                break;
            case JS_TYPE.JS_METHOD_NODE:
                icon.html(PROJECT_ICON.METHOD_ICON);
                break;
            case JS_TYPE.JS_FUNCTION_NODE:
                icon.html(PROJECT_ICON.CS_LOCAL_FUNCTION_ICON);
                break;
            case JS_TYPE.JS_PROPERTY_NODE:
                icon.html(PROJECT_ICON.CS_PROPERTY_ICON);
                break;
            case JS_TYPE.JS_CONSTRUCTOR_NODE:
                icon.html(PROJECT_ICON.INITIALIZE_ICON);
                break;
            case JS_TYPE.JS_VARIABLE_NODE:
                icon.html(PROJECT_ICON.FIELD_ICON);
                break;
            //PHP
            case PHP_TYPE.PHP_ROOT_NODE:
                icon.html(PROJECT_ICON.ROOTNODE_ICON);
                break;
            case PHP_TYPE.PHP_PACKAGE_NODE:
                icon.html(PROJECT_ICON.PACKAGE_ICON);
                break;
            case PHP_TYPE.PHP_CLASS_NODE:
                icon.html(PROJECT_ICON.CLASS_ICON);
                break;
            case PHP_TYPE.PHP_INTERFACE_NODE:
                icon.html(PROJECT_ICON.INTERFACE_NODE);
                break;
            case PHP_TYPE.PHP_METHOD_NODE:
                icon.html(PROJECT_ICON.METHOD_ICON);
                break;
            case PHP_TYPE.PHP_ABSTRACT_NODE:
                icon.html(PROJECT_ICON.INITIALIZE_ICON)
                break;
            case PHP_TYPE.PHP_FIELD_NODE: 
                icon.html(PROJECT_ICON.FIELD_ICON)
                break;
        }
    }

    updateNode(node) {
        let nodeView = this.view.select(".id" + node.data.id);
        nodeView.attr("x", node.x)
            .attr("y", node.y)
            .attr("width", node.width)
            .attr("height", node.height);

        // // console.log('enter update node')

        nodeView.select(".background")
            .attr("x", node.x + VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.PADDING_NODE)
            .attr("y", node.y + VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.PADDING_NODE)
            .attr("width", node.width - VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.PADDING_NODE)
            .attr("height", node.height - VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.PADDING_NODE);

        nodeView.select(".title")
            .attr("x", node.x + VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.PADDING_NODE)
            .attr("y", node.y + VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.PADDING_NODE)
            .attr("width", node.width - VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.PADDING_NODE)
            .attr("height", VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.TITLE_HEIGHT_NODE);

        nodeView.select("text")
            .attr("x", node.x + VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.TEXT_POSITION.x)
            .attr("y", node.y + VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.TEXT_POSITION.y);

        nodeView.select(".node-icon")
            .attr("x", node.x + VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.ICON_PADDING_LEFT)
            .attr("y", node.y + VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.ICON_PADDING_TOP)
    }

    expandNodeByArchitectureLevel(level) {

        this.collapseNode(this.rootNode);

        switch (level) {
            case "lv1":
                this.recursiveExpandNodeByArchiLevel1(this.rootNode);
                break;
            case "lv2":
                this.recursiveExpandNodeByArchiLevel2(this.rootNode);
                break;
            case "lv3":
                this.recursiveExpandNodeByArchiLevel3(this.rootNode);
                break;
        }
        this.updateFullLinks();
    }

    expandNodeByNodesMap(nodeId) {
        let graph = this;
        let nodeMap = graph.includesIDMaps.get(nodeId).includeIds;
        if (Array.isArray(nodeMap)) {
            nodeMap.forEach(item => {
                let nodeView = graph.getNodeViewData(item);
                // // console.log(nodeView)
                if (nodeView !== null) {
                    NodeEvent.expandNodeByLevel(nodeView);
                }
            })
        }
    }

    recursiveExpandNodeByNodeLevel(node, level) {
        if(node.data.children.length > 0 && node.level <= level) {
            // // console.log("expand")
            // console.log(level)
            NodeEvent.expandNodeByLevel(node);
            node.data.children.forEach(child => {
                if (child !== null && child != undefined) {
                    let childNode = this.getNodeViewData(child.id);
                    if (childNode !== null) {
                        this.recursiveExpandNodeByNodeLevel(childNode, level);
                    } else {
                        // console.log("Error on recursiveExpandNodeByNodeLevel()!")
                    }
                }
            });
        } else return;
    }

    recursiveExpandNodeByArchiLevel1(node) {
        if (node.data.children.length > 0 && ARCHITECTURE_LEVEL.lv1.indexOf(node.data.entityClass) >= 0) {
            NodeEvent.expandNodeByLevel(node);
            if (node.children.length > 0) {
                node.children.forEach(child => this.recursiveExpandNodeByArchiLevel1(child));
            }
        } else return;
    }

    recursiveExpandNodeByArchiLevel2(node) {
        if (node.data.children.length > 0 &&
            (ARCHITECTURE_LEVEL.lv1.indexOf(node.data.entityClass) >= 0 ||
                ARCHITECTURE_LEVEL.lv2.indexOf(node.data.entityClass) >= 0)) {
            NodeEvent.expandNodeByLevel(node);
            if (node.children.length > 0) {
                node.children.forEach(child => this.recursiveExpandNodeByArchiLevel2(child));
            }
        } else return;
    }

    recursiveExpandNodeByArchiLevel3(node) {
        if (node.data.children.length > 0 &&
            (ARCHITECTURE_LEVEL.lv1.indexOf(node.data.entityClass) >= 0 ||
                ARCHITECTURE_LEVEL.lv2.indexOf(node.data.entityClass) >= 0 ||
                ARCHITECTURE_LEVEL.lv3.indexOf(node.data.entityClass) >= 0)) {
            NodeEvent.expandNodeByLevel(node);
            if (node.children.length > 0) {
                node.children.forEach(child => this.recursiveExpandNodeByArchiLevel3(child));
            }
        } else return;
    }


    expandNode(node) {
        this.getNodeView(node).remove();

        if (node.data.entityClass.includes("Xml") || node.data.entityClass === JAVA_TYPE.RESOURCE_ROOT_NODE) {
            node.graph.newXmlNode(node);
        } else {
            node.graph.newNode(node);
        }

        let childrenData = node.data.children;
        // console.log(childrenData)
        // console.log(node)

        node.children = [];

        this.createChildrenGraphNode(node, childrenData);
        this.view.select(".id" + node.data.id).attr("class", "id" + node.data.id).attr("id", "id" + node.data.id)
            .select(".title-text")
            .text((node.data.entityClass === JAVA_TYPE.JAVA_ROOT_NODE) ?
                "SRC" :
                NodeInforUltils.convertNameToShorter(node.data, node.children));;

        d3.select(`g#id${node.data.id}`).on('mousedown.drag', null);

        this.resizeNodeByChildren(node);
        this.collisionSolve(node);
        // // console.log(VCGraphData)
    }

    createChildrenGraphNode(node, children) {
        // // console.log(node);

        //get child that is not null or undefined
        let filteredChild = [];

        children.forEach(child => {
            if (child !== null && child !== undefined) {
                filteredChild.push(child);
            }
        })

        let numRow = Math.floor(Math.sqrt(filteredChild.length));


        filteredChild.forEach((child, i) => {
           if (child !== null && child !== undefined) {
               let childNode = new Node(child, node.graph);

               childNode.parent = node;
               childNode.setPosition(node.x + (i % numRow) * (VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.MIN_WIDTH_NODE + 40),
                   node.y + 50 + Math.floor(i / numRow) * 60);
               node.children.push(childNode);
               if (node.data.entityClass.includes("Xml") || node.data.entityClass === JAVA_TYPE.RESOURCE_ROOT_NODE) {
                   this.newXmlNode(childNode);
               } else {
                   this.newNode(childNode);
               }
           }
        });
    }

    collapseNode(node) {

        this.lastActiveNode = node;
        this.getNodeView(node).remove();
        node.collapse();
        if (node.data.entityClass.includes("Xml") || node.data.entityClass === JAVA_TYPE.RESOURCE_ROOT_NODE) {
            this.newXmlNode(node);
        } else {
            this.newNode(node);
        }

        this.updateFullLinks();
        DVRightView.updateDependencyList(this.linkData);
    }

    moveNode(node, dx, dy) {
        // // console.log(this.root)
        node.x += dx;
        node.y += dy;
        if (node.children) {
            node.children.forEach(d => {
                this.moveNode(d, dx, dy);
            });
        }
        this.updateNode(node);
        this.updateLinkOfNode(node);
    }

    collisionSolve(changedNode) {
        // // console.log(changedNode)
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
        parent.height = maxBotRight.y - minTopLeft.y + 2 * padding + VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.TITLE_HEIGHT_NODE;
        this.updateNode(parent);
        this.resizeNodeByChildren(parent.parent);
        this.updateLinkOfNode(parent);
        // if (parent.graph instanceof DependencyGraphTemplate) {
        //     this.collisionSolveRoot(parent);
        // }
    }

    drawLink() {
        let graph = this;
        // // console.log("drawLinks")
        this.links.remove();

        this.links = this.view.append('g').attr("class", "link_fullgraph").selectAll("line").data(this.linkData)
            .enter()
            .append("line")
            .attr('id', link => `${link.source.data.id}-${link.destination.data.id}`)
            .attr("x1", link => link.begin.x)
            .attr("y1", link => link.begin.y)
            .attr("x2", link => link.end.x)
            .attr("y2", link => link.end.y)
            .attr("marker-end", "url(#end-arrow-fullgraph)")
            .attr("stroke", VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.LINE_STROKE_COLOR)
            .attr("stroke-width", link => {
                // // console.log(link)
                let linkWeight = graph.calculateSumWeight(link.weight);
                return graph.calculateLinkStroke(linkWeight);
            });

        this.links
            .on("mouseover", (event, link) => {
            // // console.log(link)
            NodeEvent.highlightDependency(event, link, graph);
            })
            .on("mouseout", (event, link) => {
                NodeEvent.unHighlightDependency(event, link, graph);
            })
            .on("click", (event, link) => {
                event.preventDefault();

                if (CentralView.currentViewId === VIEW_IDS.DEPENDENCY_VIEW_ID) {
                    DVRightView.changeToDependencyListView();
                    DVRightView.closeAllDependencies();
                    DVRightView.openDependency(link.source.data.id, link.destination.data.id);

                    DOMUtils.scrollIfNeeded(
                        document.getElementById(`dp-${link.source.data.id}-${link.destination.data.id}`),
                        document.getElementById('dependency-list-content')
                    );
                }
            })

    }

    calculateSumWeight(linkWeight) {
        return linkWeight.invocation + linkWeight.inheritance + linkWeight.use
            + linkWeight.override + linkWeight.spring + linkWeight.jsf;
    }

    calculateLinkStroke(sumLinkWeight) {
        let strokeWidth = 2;
        if (sumLinkWeight <= 10) {
            strokeWidth = 2.5;
        } else if (sumLinkWeight > 10 && sumLinkWeight <= 20) {
            strokeWidth = 3
        } else if (sumLinkWeight > 20 && sumLinkWeight <= 30) {
            strokeWidth = 3.5;
        } else if (sumLinkWeight > 30 && sumLinkWeight <= 40) {
            strokeWidth = 4;
        } else if (sumLinkWeight > 40 && sumLinkWeight <= 50) {
            strokeWidth = 4.5;
        } else if (sumLinkWeight > 50){
            strokeWidth = 5;
        }
        return strokeWidth;
    }

    updateLinkOfNode(node) {
        // // console.log("updateLinkOfnode " + node.data.id)
        this.links.filter(link => {
            if (link.source === node || link.destination === node) {
                link.updateLine();
                return true;
            }
            return false;
        })
            .attr("x1", link => link.begin.x).attr("y1", link => link.begin.y)
            .attr("x2", link => link.end.x).attr("y2", link => link.end.y);
    }

    updateFullLinks() {
        // Walk through all dependencies
        let graph = this;
        this.filteredDependencies = LINK_UTILS.filterLinks(graph);
        graph.linkData = [];
        this.filteredDependencies.forEach(function (caller) {
            // // console.log("callerId: : "+ caller.calleeId)
            graph.getNearestNodeOnGraph(caller.callerNode, function (error, srcNode) {
                if (error) return;
                let src = srcNode.node.datum();
                // // console.log(caller.callerId + " " + src.data.id);
                caller.calleeNodes.forEach(function (callee) {
                    if(callee.dependency.member > 0) return;
                    let destID = callee.node;
                    // // console.log("calleeid: "+ callee.calleeId)
                    graph.getNearestNodeOnGraph(destID, function (error, destNode) {
                        if (error) return;

                        let dest = destNode.node.datum();
                        // // console.log(callee.calleeId + " " + dest.data.id);

                        if (src.data.id == dest.data.id) {
                            // // console.log("Samee")
                            return;
                        }
                        // // console.log(src,dest);
                        let foundLink = graph.linkData.find(function (d) {
                            return src.data.id === d.source.data.id && dest.data.id === d.destination.data.id
                        });
                        let callerNodeData;
                        let calleeNodeData;
                        // console.log(CentralView.currentViewId)
                        if (CentralView.currentViewId === VIEW_IDS.VERSION_COMPARE_ID) {
                            callerNodeData = VCGraphData.graphData.includesIdsMap.get(caller.callerNode).data;
                            calleeNodeData = VCGraphData.graphData.includesIdsMap.get(callee.node).data
                        } else {
                            callerNodeData = DVGraphData.graphData.includesIdsMap.get(caller.callerNode).data;
                            calleeNodeData = DVGraphData.graphData.includesIdsMap.get(callee.node).data
                        }

                        let innerDependency = {
                            fromNode: JSON.parse(JSON.stringify(callerNodeData)),
                            toNode: JSON.parse(JSON.stringify(calleeNodeData)),
                            weight: callee.dependency
                        }

                        if (foundLink === undefined) {
                            let link = new Link(src, dest, callee.dependency, innerDependency);
                            graph.linkData.push(link);
                        } else {
                            foundLink.updateWeight(callee.dependency);
                            foundLink.updateInnerDependencies(innerDependency);
                        }
                    })
                })
            });
        });
        this.drawLink();
        DVRightView.updateDependencyList(graph.linkData);
        // console.log(DVGraphData.graph)
    }

    getNearestNodeOnGraph(nodeId, cb) {
        let graph = this;
        // // console.log(nodeId)
        // // console.log(this.includesIDMaps.get(nodeId))
        let includeIdMaps = this.includesIDMaps.get(nodeId);

        if (includeIdMaps !== undefined && includeIdMaps !== null) {
            let ids = includeIdMaps.includeIds;
            if (ids) {
                // ids.push(nodeId);
                for (let i = ids.length - 1; i >= 0; i--) {
                    let node = graph.view.select(".id" + ids[i]);
                    if (node.node() != null) return cb(undefined, {node: node, id: ids[i]});
                }
            }
        }
        return cb(new Error('[' + nodeId + ']' + 'node not found'));
    }

    getNodeView(node) {
        return this.view.select(".id" + node.data.id);
    }

    getNodeViewById(nodeId) {
        return this.view.select(".id" + nodeId);
    }

    getNodeViewData(nodeId) {
        let nodeView = this.view.select(".id" + nodeId);
        if (nodeView !== null) {
            return nodeView.data()[0];
        }
        return null;
    }
}