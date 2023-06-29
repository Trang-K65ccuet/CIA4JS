import * as d3 from 'd3';

import { 
    VIEW_COMPONENTS_DATA 
} from '../config/ViewComponents';

import ViewEvent from './ViewEvent';
import ViewCreator from './ViewCreator';

import CentralView from './view-components/CentralView';

function initBaseViews() {
    createDiv(d3.select(".content"), VIEW_COMPONENTS_DATA);
}

function createDiv(parentDiv, parent) {
    if (!parent.children)
      return;
    let preDiv;
    for (let i = 0; i < parent.children.length; i++) {
      let child = parent.children[i];

      let div = parentDiv.append("div")
                        .classed("view", true)
                        .classed(child.name, true)
                        .style("position", "absolute")
                        .style("width",child.width)
                        .style("height", child.height)
                        .style("top", child.top)
                        .style("left", child.left);

    if (i > 0) {
      parentDiv.append("div").data([ {
        orientation : parent.orientation,
        div1 : preDiv,
        div2 : div
      } ]).classed("view-border", true).style("position", "absolute").style(
          "width", function() {
            if (parent.orientation == "vertical")
              return "100%";
            else
              return "2px";
          }).style("height", function() {
        if (parent.orientation == "vertical")
          return "2px";
        else
          return "100%";
      }).style("top", child.top).style("left", child.left).style("cursor",
          function() {
            if (parent.orientation == "vertical")
              return "n-resize";
            else
              return "e-resize";
          })
          .call(ViewEvent.dragBorder);
    }
    preDiv = div;
    createDiv(div, child);
  }
}

function resize() {
  // CentralView.resize();
    let viewTitleDiv = $(".view-title")[0];
    if (viewTitleDiv) {
        let viewTabContainerDivWidth = viewTitleDiv.getBoundingClientRect().width;
        CentralView.title.style("width", `${(viewTabContainerDivWidth - 25) / viewTabContainerDivWidth * 100}%`);
    }
    CentralView.redrawTabTitle();
}


const ViewManager = {
    initBaseViews,
    resize,
    createDiv,
}

d3.select(window).on("resize", resize);

export default ViewManager;