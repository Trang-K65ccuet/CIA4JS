import * as d3 from 'd3';

import VIEW_CONFIG_VARIABLES from '../config/ViewConfig';
import CentralView from './view-components/CentralView';
import ViewManager from "./ViewManager";

function dragged(event, d) {
    //TODO: fix deprecated event funct
    event.sourceEvent.stopPropagation();
    // // console.log(d)
    let border = this.getBoundingClientRect();
    let bounding1 = d.div1.node().getBoundingClientRect();
    let bounding2 = d.div2.node().getBoundingClientRect();
    
    let mouse = d3.pointer(event, d3.select("body").node());
    if (d.orientation == "vertical") {
        // // console.log(this);
        // // console.log(mouse[1], bounding1, bounding2);
        bounding1.bot = bounding1.top + bounding1.height;
        if (mouse[1] < bounding1.top + VIEW_CONFIG_VARIABLES.VIEW_CONFIG.HEADER_HEIGHT)
            mouse[1] = bounding1.top + VIEW_CONFIG_VARIABLES.VIEW_CONFIG.HEADER_HEIGHT;
        else if (mouse[1] > bounding2.top + bounding2.height
            - VIEW_CONFIG_VARIABLES.VIEW_CONFIG.HEADER_HEIGHT)
            mouse[1] = bounding2.top + bounding2.height - VIEW_CONFIG_VARIABLES.VIEW_CONFIG.HEADER_HEIGHT;
        let exchangeHeight = mouse[1] - bounding1.bot;
        let newHeight1 = bounding1.height + exchangeHeight;
        let newHeight2 = bounding2.height - exchangeHeight;
        d.div1.style("height", newHeight1 + "px").style("width", "100%");
        d.div2.style("height", newHeight2 + "px").style("width", "100%");
        d.div2.style("top", mouse[1] + "px");
        d3.select(this).style("top", mouse[1] + "px");
    } else {
        // // console.log(this);
        // // console.log(mouse[0], bounding1, bounding2);
        if (mouse[0] < bounding1.left)
            mouse[0] = bounding1.left;
        else if (mouse[0] > bounding1.left + bounding1.width + bounding2.width
            - 2)
            mouse[0] = bounding1.left + bounding1.width + bounding2.width - 2;
        let exchangeWidth = mouse[0] - bounding2.left;
        let newWidth1 = bounding1.width + exchangeWidth;
        let newWidth2 = bounding2.width - exchangeWidth;
        // // console.log(exchangeWidth, ": ", newWidth1, "- ", newWidth2);
        d.div1.style("width", newWidth1 / $(window).width() * 100 + "%").style("height", "96vh");
        d.div2.style("width", newWidth2 / $(window).width() * 100 + "%").style("height", "96vh");
        d.div2.style("left", mouse[0] / $(window).width() * 100 + "%");
        d3.select(this).style("left", mouse[0] / $(window).width() * 100 + "%");
    }
        ViewManager.resize();

    let div_rect = d3.select("body").select(".class-view").node().getBoundingClientRect();
        CentralView.svgBounding = div_rect;
        d3.select("body").select(".class-view").select(".main-view")
            .style("width", 100+"%")
            .style("height", div_rect.height - VIEW_CONFIG_VARIABLES.VIEW_CONFIG.HEADER_HEIGHT+"px");

    boundingWidth();
}

let dragBorder = d3.drag().subject(node => node)
            .on("start", dragStarted)
            .on("drag",dragged)
            .on("end", dragended);

function boundingWidth() {
    let leftViewDiv = $(".left-view")[0],
        centralViewDiv = $(".class-view")[0],
        rightViewDiv = $(".right-view")[0],
        windowDiv = $(window);

    let leftViewDivWidth = leftViewDiv.getBoundingClientRect().width,
        centralViewDivWidth = centralViewDiv.getBoundingClientRect().width,
        rightViewDivWidth = rightViewDiv.getBoundingClientRect().width,
        windowWidth = windowDiv.width()

    let sum = leftViewDivWidth + centralViewDivWidth + rightViewDivWidth;

    // // console.log(sum - windowWidth)

    if (sum > windowWidth) {
        centralViewDivWidth = centralViewDivWidth - (sum - windowWidth);
    } else {
        centralViewDivWidth = centralViewDivWidth + (windowWidth - sum);
    }
    // // console.log(centralViewDivWidth + " / " + windowWidth)

    $(".class-view").css("width", `${centralViewDivWidth / windowWidth * 100}%`);
    $(".arch-level").css("left", `${leftViewDiv.width / $(window).width() * 100}%`);
}


function dragStarted(event, d) {
    event.sourceEvent.stopPropagation();
    // Event.clearTextWhenMouseOut();
  };

function dragended(event, d) {
    event.sourceEvent.stopPropagation();
}

let zoom = d3.zoom().scaleExtent([1/VIEW_CONFIG_VARIABLES.CLASS_VIEW_CONFIG.MAX_ZOOM,1/VIEW_CONFIG_VARIABLES.CLASS_VIEW_CONFIG.MIN_ZOOM])
    .on("zoom", function(event){
        let tab = CentralView.getCurrentTab();
        tab.view.attr("transform", event.transform);
    });

const ViewEvent = {
    dragBorder,
    zoom,
}
export default ViewEvent;