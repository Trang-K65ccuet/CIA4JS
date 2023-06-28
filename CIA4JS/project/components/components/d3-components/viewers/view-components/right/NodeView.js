import * as d3 from 'd3';

const NodeView = {
    createView: function () {
        NodeView.createTitle();
    }, 

    createTitle: function () {
        let title_div = d3.select("body").select('.node-view').append("div")
                                .classed("right-view-title", true)
                                .classed("node-view", true);
        
        //create icon
        title_div.append("span").append("i").attr("class", "fab fa-linode");
        
        //create name
        title_div.append("b").html("Node view")
                                
    }
};

export default NodeView;