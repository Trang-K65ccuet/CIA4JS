import NodeView from "./right/NodeView";
import DependencyListView from "./right/DVRightView";
import CentralView from "./CentralView";
import {VIEW_IDS} from "./central/CentralViewTabs";
import Utils from "../../../utils/BasicUltils";
import {DOMUtils} from "../../../utils/DOMUtils";
import VCRightView from "./right/VCRightView";

const RightView = {
    createView: function (graph) {
        // // console.log(dependencyGraph);
        RightView.displayRightView(graph);

        // let rightViewDiv = document.querySelector(".right-view");
        // Utils.emptyContentDiv([".right-view"]);
        // rightViewDiv.appendChild(DOMUtils.createElementFromHTML(
        //     "<div class='view right-view-component dependency-list'></div>"
        // ))
        // DependencyListView.createView(graph);
    },
    displayRightView(graph) {
        Utils.emptyContentDiv([".right-view"])
        let rightViewDiv = document.querySelector(".right-view");
        if (rightViewDiv) {
            if (CentralView.currentViewId === VIEW_IDS.DEPENDENCY_VIEW_ID ||
                CentralView.currentViewId === VIEW_IDS.SUB_DEPENDENCY_VIEW_IMPACT_ID ||
                CentralView.currentViewId === VIEW_IDS.SUB_DEPENDENCY_VIEW_ID) {
                rightViewDiv.appendChild(DOMUtils.createElementFromHTML(
                    "<div class='view right-view-component dv-right-view'></div>"
                ))
                DependencyListView.createView(graph);
            } else if (CentralView.currentViewId === VIEW_IDS.VERSION_COMPARE_ID) {
                rightViewDiv.appendChild(DOMUtils.createElementFromHTML(
                    "<div class='view right-view-component changed-node-view'></div>"
                ));

                rightViewDiv.appendChild(DOMUtils.createElementFromHTML(
                    "<div class='view right-view-component added-node-view'></div>"
                ));

                rightViewDiv.appendChild(DOMUtils.createElementFromHTML(
                    "<div class='view right-view-component deleted-node-view'></div>"
                ));

                rightViewDiv.appendChild(DOMUtils.createElementFromHTML(
                    "<div class='view right-view-component impact-node-view'></div>"
                ))

                VCRightView.createView();
            }
        }
    }
};

export default RightView;