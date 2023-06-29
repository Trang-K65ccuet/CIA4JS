import * as d3 from 'd3';

import VIEW_CONFIG_VARIABLES from '../config/ViewConfig';
import NodeInforUltils from '../../utils/NodeInforUltils';
import DVRightView from "../viewers/view-components/right/DVRightView";
import DVGraphDataManager from "../../data-manager/dependency-graph/DVGraphDataManager";
import CentralView from "../viewers/view-components/CentralView";
import {VIEW_IDS} from "../viewers/view-components/central/CentralViewTabs";
import {VCGraphData} from "../../data-manager/version-compare-graph/VCGraphData";
import DVGraphData from "../../data-manager/dependency-graph/DVGraphData";
import SubDVGraphData from "../../data-manager/dependency-graph/SubDVGraphData";
import ImpactDataManager from "../../data-manager/impact/ImpactDataManager";

const NodeEvent = {}

NodeEvent.timeoutId = 0;

NodeEvent.dragged = function (event, node) {
    event.sourceEvent.stopPropagation();
    node.graph.moveNode(node, event.dx, event.dy);
    node.graph.collisionSolve(node);
    // if (node.graph instanceof DependencyGraphTemplate) {
    //     node.graph.collisionSolveRoot(node);
    // }
};
NodeEvent.dragstarted = function (event, node) {
   event.sourceEvent.stopPropagation();
    // Event.clearWhenMouseOut(node);
};
NodeEvent.dragended = function (event, node) {
    event.sourceEvent.stopPropagation();
};

NodeEvent.drag = d3.drag()
    .subject(node => node)
    .on("start", NodeEvent.dragstarted)
    .on("drag", NodeEvent.dragged)
    .on("end", NodeEvent.dragended);

NodeEvent.onDoubleClickNode = function(e, node) {
    e.stopPropagation();
    // console.log(node)
    if (node.children.length > 0 ) {
        node.graph.collapseNode(node);
        node.graph.resizeNodeByChildren(node.parent);
        // // console.log("doublecl close: " + node.children.length)
    } else {
        NodeEvent.expandNode(node);
        // // console.log("doublecl open: " + node.children.length)
    }
}

NodeEvent.expandNode = function(node) {
   if (node.data.children.length > 0) {
       node.graph.expandNode(node);
       node.graph.updateNode(node);
       // node.graph.resizeNodeByChildren(node);
       // node.graph.collisionSolve(node);
       node.graph.updateFullLinks();

       switch (CentralView.currentViewId) {
           case VIEW_IDS.DEPENDENCY_VIEW_ID:
               DVRightView.updateDependencyList(DVGraphData.graph.linkData);
               break;
           case VIEW_IDS.VERSION_COMPARE_ID:
               // DVRightView.updateDependencyList(VCGraphData.graph.linkData);
               break;
           case VIEW_IDS.SUB_DEPENDENCY_VIEW_ID:
               DVRightView.updateDependencyList(SubDVGraphData.graph.linkData);
               break;
            case VIEW_IDS.SUB_DEPENDENCY_VIEW_IMPACT_ID:
            DVRightView.updateDependencyList(SubDVGraphData.graph.linkData);
            break;
       }
   }
}

NodeEvent.getNodeTransform = function (node, xScale) {
    let bbox = node.node().getBBox(),
        bx = bbox.x,
        by = bbox.y,
        bw = bbox.width, bh = bbox.height,
        tx = -bx*xScale + vx + vw/2 - bw*xScale/2,
        ty = -by*xScale + vy + vh/2 - bh*xScale/2;

    return {translate: [tx, ty], scale: xScale}
}

NodeEvent.centerNode = function(event, d, i) {
    if (event.defaultPrevented) {
        return; // panning, not clicking
    }

    let scale = 2.0;

    let zoom = d3.zoom()
        .scale(scale)
        .scaleExtent([1, 5])
        .on("zoom", zoomed);

    let node = d3.select(this);
    let transform = NodeEvent.getNodeTransform(node, scale);
    // container.transition().duration(1000)
    //     .attr("transform", "translate(" + transform.translate + ")scale(" + transform.scale + ")");
    zoom.scale(transform.scale)
        .translate(transform.translate);
    // scale = transform.scale;
}

NodeEvent.expandNodeByLevel = function(node) {
    node.graph.expandNode(node);
    node.graph.updateNode(node);
    // node.graph.resizeNodeByChildren(node);
    // node.graph.collisionSolve(node);
}

NodeEvent.highlightDependencies = function (event, node) {
    event.stopPropagation();
    // // console.log(node.graph.links);
    let links = node.graph.links;
    links.filter(link => (link.source.data.id === node.data.id)).attr('stroke', VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.DEPEND_STROKE_COLOR)
                                                .attr("marker-end", "url(#depend-arrow-fullgraph)");

    links.filter(link => (link.destination.data.id === node.data.id)).attr('stroke', VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.DEPENDED_STROKE_COLOR)
                                                     .attr("marker-end", "url(#depended-arrow-fullgraph)");

    links.filter(link => (link.source.data.id !== node.data.id && link.destination.data.id !== node.data.id)).style("opacity", 0.1);


    // node.graph.links.filter(link => (link.source===node)).attr('stroke', FULLGRAPH_CONFIG.DEPEND_STROKE_COLOR).attr("marker-end","url(#depend-arrow-fullgraph)");
    // node.graph.links.filter(link => (link.destination===node)).attr('stroke', FULLGRAPH_CONFIG.DEPENDED_STROKE_COLOR).attr("marker-end","url(#depended-arrow-fullgraph)");
    // node.graph.links.filter(link => (link.source!==node&&link.destination!==node)).style("opacity", 0.0);
}

NodeEvent.unHighlightDependencies = function (event, node) {
    event.stopPropagation();
    // node.graph.links.filter(link => (link.source===node||link.destination===node)).attr('stroke', FULLGRAPH_CONFIG.LINE_STROKE_COLOR).attr("marker-end","url(#end-arrow-fullgraph)");
    node.graph.links.filter(link => (link.source.data.id === node.data.id || link.destination.data.id === node.data.id))
                                        .attr('stroke', VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.LINE_STROKE_COLOR)
                                        .attr("marker-end", "url(#end-arrow-fullgraph)");

    node.graph.links.filter(link => (link.source.data.id !== node.data.id || link.destination.data.id!== node.data.id))
        .style("opacity", 1.0);
}

NodeEvent.highlightDependency = function (event, linkParam, graph) {
    event.stopPropagation();

    graph.links.filter(link => (link.source.data.id === linkParam.source.data.id) && (link.destination.data.id === linkParam.destination.data.id))
        .attr('stroke', VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.HIGHLIGHT_STROKE_COLOR)
        .attr("marker-end", "url(#highlight-arrow)")
    ;

    graph.links.filter(link => (link.source.data.id !== linkParam.source.data.id ||
        link.destination.data.id !== linkParam.destination.data.id))
        .style("opacity", 0.1);

}


NodeEvent.unHighlightDependency = function (event, linkParam, graph) {
    event.stopPropagation();

    graph.links.filter(link => (link.source === linkParam.source || link.destination === linkParam.destination))
        .attr('stroke', VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.LINE_STROKE_COLOR)
        .attr("marker-end", "url(#end-arrow-fullgraph)")
        .style('z-index', 1)
    ;

    graph.links.filter(link => (link.source !== linkParam.source || link.destination !== linkParam.destination))
        .style("opacity", 1.0);

}

NodeEvent.showNodeInforWhenMouseHover = function (event, node, nodeView, linkData) {
    d3.selectAll(".hoverInforTab").remove();
    event.stopPropagation();

    let bounding = nodeView.node().getBoundingClientRect();
    // // console.log('bounding', bounding)
    // // console.log(node.data)

    if (!NodeEvent.timeoutId) {
        NodeEvent.timeoutId = window.setTimeout(function () {
            let nodeInforTab =  d3.select('body')
                                    .selectAll('.hoverInforTab')
                                    .data([node.data])
                                    .enter()
                                    .append('div')
                                    .attr('class', 'hoverInforTab')
                                    .attr('style', 'position: absolute; max-height:300px;max-width:500px;overflow:auto');
                                    // .on('mouseout', function(e) {
                                    //     d3.select('hoverInforTab').remove();
                                    // });

                nodeInforTab.style('left', `${bounding.x}px`)
                            .style('top', `${bounding.y + VIEW_CONFIG_VARIABLES.VIEW_CONFIG.HEADER_HEIGHT -10}px`);


                nodeInforTab.append('span').html(NodeInforUltils.buildHtml(node.data, linkData));


                d3.select('.hoverInforTab').on('mouseenter', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    // // console.log('mouse in infor')
                })
                
                d3.select('.hoverInforTab').on('mouseleave', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    // // console.log('mouse out infor')
                    d3.selectAll('.hoverInforTab').remove();
                })
        }, 700);
    }
}

NodeEvent.clearNodeInforWhenMouseOut = function() {
    window.clearTimeout(NodeEvent.timeoutId);
    NodeEvent.timeoutId = null;
};

export default NodeEvent;