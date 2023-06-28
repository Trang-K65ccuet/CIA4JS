import Utils from "../../utils/BasicUltils";
import CentralView from "../../d3-components/viewers/view-components/CentralView";
import {VIEW_IDS} from "../../d3-components/viewers/view-components/central/CentralViewTabs";

const CentralViewDataManager = {
    viewMode : VIEW_IDS.DEPENDENCY_VIEW_ID,
    unMountCentralView: function () {
        this.cleanCentralView();
        Utils.emptyContentDiv([".content"]);
    },

    cleanCentralView() {
        CentralView.view = {};
        CentralView.svgBounding = {};
        CentralView.currentTabs = [];
        CentralView.layerId = false;
        CentralView.currentViewId = null;
    },
    projectData: {},
    projectName: null,
    currentVersionName: null,
    laterVersionName: null,
    newVersionName: null,
    newVersionFile: null,

    clearNewVersionData() {
        this.newVersionName = null;
        this.newVersionFile = null;
    },
    checkIfVersionExist(inputVersionName) {
        let check = false;
        if (CentralViewDataManager.projectData.versionList) {
            CentralViewDataManager.projectData.versionList.forEach(version => {
                if (version.name === inputVersionName) {
                    check = true;
                    return check;
                }
            })
        }
        return check;
    },
    getVersionByVersionName(versionName) {
        // console.log(versionName)
        // console.log(this.projectData.versionList)
        return this.projectData.versionList.find(version => version.name === versionName)
    }
}

export default CentralViewDataManager;

