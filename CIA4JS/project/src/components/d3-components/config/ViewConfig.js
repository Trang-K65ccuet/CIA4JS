import JAVA_TYPE from "./JavaType";
import XML_TYPE from "./XmlType";
import CS_TYPE from "./CSType";
import NODEJS_TYPE from "./NodeJSType";
import JS_TYPE from "./JavascriptType";
import PHP_TYPE from "./PHPType";

const width = 1200, height = 1200;

const VISIBILITY = ["public","private","protected","default"];

const GRAPH_CONFIG = {
    CENTER_POSITION: {
        x: 100,
        y: 100
    },
    RADIUS: 200,
    ONE_NODE: [
        {x: 250, y: 100}
    ],
    TWO_NODE: [
        {x: 100, y: 100},
        {x: 400, y: 100}
    ],
    THREE_NODE: [
        {x: 250, y: 100},
        {x: 20,  y: 200},
        {x: 480, y:200}
    ],
    FOUR_NODE: [
        {x: 250,y: 100},
        {x: 250,y: 20},
        {x: 20,y:200},
        {x: 480,y: 200}
    ],
    PROPERTY_HOVER_MAIN_COLOR: "#424242",
    PROPERTY_HOVER_COLOR: "#444466",
    CALL_DEPENDENCE_COLOR: "#664444",
    USE_DEPENDENCE_COLOR: "#446644",
    INHERIT_DEPENDENCE_COLOR: "#444466"
};

const CHANGESET_VIEW_CONFIG = {
    BACKGROUND_COLOR: "#37474F",
    TEXT_COLOR: "white",
    TEXT_PADDING: 2,
    TRANSITION_DURATION: 300,
    LEVEL_BOX_WIDTH: 30,
    LEVEL_BOX_HEIGHT: 20
};

const noSourceCodeListNode = [
    JAVA_TYPE.JAVA_ROOT_NODE,
    JAVA_TYPE.JAVA_PACKAGE_NODE,
    JAVA_TYPE.PROJECT_ROOT_NODE,
    JAVA_TYPE.RESOURCE_ROOT_NODE,
    XML_TYPE.XML_TAG_NODE,
    XML_TYPE.XML_FILE_NODE,
    
    CS_TYPE.CS_ROOT_NODE,
    CS_TYPE.CS_FOLDER_NODE,

    NODEJS_TYPE.NODEJS_ROOT_NODE,
    NODEJS_TYPE.NODEJS_FOLDER_NODE,

    PHP_TYPE.PHP_ROOT_NODE,
    PHP_TYPE.PHP_PACKAGE_NODE,

    JS_TYPE.JS_ROOT_NODE,
    JS_TYPE.JS_FOLDER_NODE,
];

const CLASSDRAWER_CONFIG = {
    WIDTH: 200,
    TITLE_HEIGHT: 25,
    ATTR_PANEL_MINHEIGHT: 0,
    METHOD_PANEL_MINHEIGHT: 0,
    TITLE_FONT_SIZE: 12,
    NORMAL_FONT_SIZE: 12,
    FILL_COLOR: "white",
    STROKE_COLOR:  "black",
    HOVER_COLOR: "blue",
    PROPERTY_HEIGHT: 30,
    PROPERTY_PADDING: 1,
    PROPERTY_WIDTH: 200,
    STROKE_WIDTH: "2px",
    MAX_CLASSNAME_LENGTH: 14,
    MAX_NAME_LENGTH: 12,
    MAX_TYPE_LENGTH: 7,
    MAX_TEXT_LENGTH: 22
};

const PROJECT_VIEW_CONFIG = {
    BACKGROUND_COLOR: "#37474F",
    TEXT_COLOR: "white",
    SEARCH_TEXT_COLOR: "red",
    SEARCH_BOX_WIDTH: 110,
    TRANSITION_DURATION: 300,
    ICON_SIZE: 10,
    ARROW_ICON_SIZE: 5,
    PADDING_TOP: 0,
    PADDING_LEFT: 10,
    NODE_HEIGHT: 15,
    NODE_PADDING_LEFT: 20,
    TEXT_POSITION: {
        x: 14+ 10+ 8,
        y: 10
    } 
    // X = ICON_SIZE + ARROW_ICON_SIZE +
                                      // padding
};

const CLASS_VIEW_CONFIG = {
    BACKGROUND_COLOR: "#ffffff",
    HEADER_FONT_SIZE: "14px",
    TAB_SEGMENT_WIDTH: 1,
    TAB_SEGMENT_COLOR: "#fff",
    ZOOM_ICON_SIZE: 20,
    ZOOM_ICON_RIGHT: 20,
    ZOOM_ICON_BOTTOM: 20,
    ZOOM_DELTA: 0.2,
    MAX_ZOOM: 5,
    MIN_ZOOM: 0.2,
    ACTIVEBAR_COLOR: "teal",
    ACTIVEBAR_HEIGHT: 3,
    TAB_SERVICE_ICON_SIZE: 10,
    ICON_MARGIN: 5
};
const VIEW_CONFIG = {
    NAVIGATION: 4,
    HEADER_HEIGHT: 25,
    HEADER_FULLHEIGHT: 30,
    MIN_HEIGHT_VIEW : 2000,
    TITLE_COLOR: "#263238",
    ICON_SIZE: 15,
    STATUS_ICON_SIZE : 15,
    SCROLLBAR_HEIGHT : 5
};

const FULLGRAPH_CONFIG = {
    EXTERNAL_LIB: "#ba7752",
    ROOT_POSITION: {x: 300, y: 300},
    MIN_WIDTH_NODE: 170,
    MIN_HEIGHT_NODE: 30, // = TITLE_HEIGHT_NODE + PADDING_NODE
    FONT_SIZE: "12px",
    PADDING_NODE: 3,
    ICON_SIZE: 22,
    ICON_PADDING_LEFT : 9,
    ICON_PADDING_TOP: 6,
    TITLE_HEIGHT_NODE: 27,
    TITLE_COLOR: "#263238",
    DEFAULT_COLOR: "#E8E8E8",
    ADDED_COLOR: "#2BC48A",
    CHANGED_COLOR: "#F7B011",
    DELETED_COLOR: "#FB5252",
    IMPACT_COLOR: "#5400AA",
    STROKE_COLOR: "#424242",
    MAX_NAME_LENGTH: 20,
    CHANGE_HIGHLIGHT_COLOR: "#4242CD",
    IMPACT_HIGHLIGHT_COLOR: "#CD4242",
    DEPEND_STROKE_COLOR: "#ee2222",
    DEPENDED_STROKE_COLOR: "#2E8BC0",
    HIGHLIGHT_STROKE_COLOR: "#FFB900",
    LINE_STROKE_COLOR: "#777777",
};

FULLGRAPH_CONFIG.ICON_POSITION = {
    x: (FULLGRAPH_CONFIG.TITLE_HEIGHT_NODE- 14) / 2 + 6,
    y: (30-20)
};
// FONT_SIZE
FULLGRAPH_CONFIG.TEXT_POSITION = {
    x: FULLGRAPH_CONFIG.ICON_SIZE + FULLGRAPH_CONFIG.ICON_POSITION.x ,
    y: FULLGRAPH_CONFIG.TITLE_HEIGHT_NODE - 14 / 2 + FULLGRAPH_CONFIG.PADDING_NODE / 2 ,
};

const LOAD_DATA_MODE = {
    PROJECT_VIEW: 1,
    DEPENDENCY_VIEW: 2,
    CHANGE_IMPACT_VIEW: 3,
    PACKAGE_DIAGRAM_VIEW: 4,
}

const DEPENDENCY_DISPLAYING_MODE = {
    NONE: 0,
    PARTIAL: 1,
    ALL: 2

}

const DATA_FLOW_MODE = {
    FULL: 0,
    VIEW_TO_DATABASE: 1
}

const VIEW_CONFIG_VARIABLES = {
    //VIEW CONFIG
    VISIBILITY,
    GRAPH_CONFIG,
    CHANGESET_VIEW_CONFIG,
    CLASSDRAWER_CONFIG,
    PROJECT_VIEW_CONFIG,
    CLASS_VIEW_CONFIG,
    VIEW_CONFIG,
    FULLGRAPH_CONFIG,

    //MODE CONFIG
    LOAD_DATA_MODE,
    DEPENDENCY_DISPLAYING_MODE,
    DATA_FLOW_MODE,
    noSourceCodeListNode

}
export default VIEW_CONFIG_VARIABLES;