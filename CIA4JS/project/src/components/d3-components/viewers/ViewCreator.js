import LeftView from "./view-components/LeftView";
import RightView from "./view-components/RightView";
import CentralView from "./view-components/CentralView";

function createAllViews(dataTree) {
    LeftView.createView(dataTree);
    // RightView.createView();
    // console.log("9999999999999999999999")
    CentralView.createView();
}

const ViewCreator = {
    createAllViews,
}

export default ViewCreator;