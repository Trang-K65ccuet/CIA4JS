var Path_Util = {};

Path_Util.findLink = function (link) {
    var src = link.source;
    var des = link.target;
    var bounding_src = { x: src.x, y: src.y, width: classViewWidth, height: title_height + property_height * (src.attributes.length + src.methods.length) };
    var bounding_des = { x: des.x, y: des.y, width: classViewWidth, height: title_height + property_height * (des.attributes.length + des.methods.length) };
    var center_src = { x: bounding_src.x + bounding_src.width / 2, y: bounding_src.y + bounding_src.height / 2 };
    var center_des = { x: bounding_des.x + bounding_des.width / 2, y: bounding_des.y + bounding_des.height / 2 };
    var begin = Path_Util.findIntersection(center_src, center_des, bounding_src);
    var end = Path_Util.findIntersection(center_src, center_des, bounding_des);
    return { begin: begin, end: end };
}

Path_Util.findLinkOfTwoRect = function (bounding_src, bounding_des) {
    var center_src = { x: bounding_src.x + bounding_src.width / 2, y: bounding_src.y + bounding_src.height / 2 };
    var center_des = { x: bounding_des.x + bounding_des.width / 2, y: bounding_des.y + bounding_des.height / 2 };
    var begin = Path_Util.findIntersection(center_src, center_des, bounding_src);
    var end = Path_Util.findIntersection(center_des, center_src, bounding_des);
    return { begin: begin, end: end };
}

Path_Util.findIntersection = function (src, des, rect) {
    return Path_Util.lineIntersect(src.x, src.y, des.x, des.y, rect.x, rect.y, rect.x, rect.y + rect.height) ||
        Path_Util.lineIntersect(src.x, src.y, des.x, des.y, rect.x, rect.y, rect.x + rect.width, rect.y) ||
        Path_Util.lineIntersect(src.x, src.y, des.x, des.y, rect.x + rect.width, rect.y, rect.x + rect.width, rect.y + rect.height) ||
        Path_Util.lineIntersect(src.x, src.y, des.x, des.y, rect.x, rect.y + rect.height, rect.x + rect.width, rect.y + rect.height) ||
        { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
}

Path_Util.lineIntersect = function (line1StartX, line1StartY, line1EndX, line1EndY, line2StartX, line2StartY, line2EndX, line2EndY) {
    // if the lines intersect, the result contains the x and y of the
    // intersection (treating the lines as infinite) and booleans for whether
    // line segment 1 or line segment 2 contain the point
    let denominator, a, b, numerator1, numerator2, result = {
        x: null,
        y: null
    };
    denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - ((line2EndX - line2StartX) * (line1EndY - line1StartY));
    if (denominator == 0) {
        return null;
    }
    a = line1StartY - line2StartY;
    b = line1StartX - line2StartX;
    numerator1 = ((line2EndX - line2StartX) * a) - ((line2EndY - line2StartY) * b);
    numerator2 = ((line1EndX - line1StartX) * a) - ((line1EndY - line1StartY) * b);
    a = numerator1 / denominator;
    b = numerator2 / denominator;

    // if we cast these lines infinitely in both directions, they intersect
    // here:
    result.x = line1StartX + (a * (line1EndX - line1StartX));
    result.y = line1StartY + (a * (line1EndY - line1StartY));
    /*
     * // it is worth noting that this should be the same as: x = line2StartX + (b *
     * (line2EndX - line2StartX)); y = line2StartX + (b * (line2EndY -
     * line2StartY));
     */
    // if line1 is a segment and line2 is infinite, they intersect if:
    if (a < 0 || a > 1) {
        return null;
    }
    // if line2 is a segment and line1 is infinite, they intersect if:
    if (b < 0 || b > 1) {
        return null;
    }
    // if line1 and line2 are segments, they intersect if both of the above are
    // true
    return result;
};


Path_Util.createMarker = function (view, id, color) {
    view.append('svg:marker')
        .attr('id', id)
        .attr('viewBox', '-10 -10 20 20')
        .attr('refX', 6)
        .attr('markerWidth', 10).attr('markerHeight', 10)
        .attr('orient', 'auto')
        .append('svg:path').attr('d', 'M-8,-5 L8,0 L-8,5 L-5,0').attr('fill', color);
};

export default Path_Util;
