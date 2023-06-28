import VIEW_CONFIG_VARIABLES from './ViewConfig'
import CentralView from "../viewers/view-components/CentralView";
import {VIEW_IDS} from "../viewers/view-components/central/CentralViewTabs";

const RIGHT_VIEW_DV = [
    {
        name: "dependency-list",
        width: "100%",
        height: "100%",
        // top: "50%",
        left: "0"
    }
]

const RIGHT_VIEW_VC = [
    {
        name: "changed-node-view",
        width: "100%",
        height: "33%",
        top: "0",
        left: "0"
    },
    {
        name: "added-node-view",
        width: "100%",
        height: "33%",
        top: "33%",
        left: "0"
    },
    {
        name: "deleted-node-view",
        width: "100%",
        height: "33%",
        top: "66%",
        left: "0"
    }
]


export const VIEW_COMPONENTS_DATA = {
    width: "100%",
    height: "100%",
    top: "0",
    left: "0",
    orientation: "horizontal",
    children: [
        {
            name: "left-view",
            width: "15%",
            height: "96vh",
            top: `${VIEW_CONFIG_VARIABLES.VIEW_CONFIG.NAVIGATION}vh`,
            left: "0%",
            orientation: "vertical",
            children: [
                {
                    name: "project-view",
                    width: "100%",
                    height: "60%",
                    top: "0",
                    left: "0%"
                },
                {
                    name: "version-view",
                    width: "100%",
                    height: "37%",
                    top: "63%",
                    left: "0%"
                }
            ]
        },
        {
            //change width = 70% if need right view
            name: "class-view",
            width: "84.9%", 
            height: "96vh",
            top: `${VIEW_CONFIG_VARIABLES.VIEW_CONFIG.NAVIGATION}vh`,
            left: "15%"
        },
        {
            //width=0.1% to make this view resizable if needed
            //change width = 15% and left = 85% if need right view
            name: "right-view",
            width: "0.1%",
            height: "96vh",
            top: `${VIEW_CONFIG_VARIABLES.VIEW_CONFIG.NAVIGATION}vh`,
            left: "99.9%",
            orientation: "vertical",
            children: []
        }
    ]
};



const SEARCHED_LEFT_VIEW_DATA = {
    name: "left-view",
    width: "15%",
    // height: "100%",
    top: "0%",
    left: "0%",
    orientation: "vertical",
    children: [
        {
            name: "project-search-view",
            width: "100%",
            height: "50%", //50
            top: "0",
            left: "0"
        },
        {
            name: "project-view",
            width: "100%",
            height: "50%", //50
            top: "50%", //50
            left: "0%"
        }
    ]
};

export const NON_SEARCHED_LEFT_VIEW_DATA = {
    name: "left-view",
    width: "15%",
    // height: "100%",
    top: "0",
    left: "0%",
    orientation: "vertical",
    children: [
        {
            name: "project-view",
            width: "100%",
            // height: "100%", //50
            top: "0%", //50
            left: "0%"
        }
    ]
};