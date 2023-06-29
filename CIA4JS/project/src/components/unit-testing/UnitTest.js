import { auth } from "../../app";
import { UploadDataManager } from "../upload/UploadDataManager";
import { DOMUtils } from "../utils/DOMUtils"
import { UnitTestingTemplate } from "./template/UnitTestingTemplate"
import { TestingDataManager } from "./TestingDataManager";
import Utils from "../utils/BasicUltils";

export const UnitTest = {
    viewId: "pc",

    mount() {
        TestingDataManager.setUnitTesting(this);
        console.log("Testing page...");
        auth.validateCreateView(TestingDataManager.getUnitTesting());
    },

    unMount() {
        Utils.emptyContentDiv([".content"]);
    },

    setViewId(id) {
        this.viewId = id;
    },
    
    createView() {
        let unitTestPage = DOMUtils.createElementFromHTML(UnitTestingTemplate);

        document.querySelector(".content").style.backgroundColor = "#E8E8E0";

        let testingPageWrapper = document.querySelector(".single-upload-wrapper");

        if (testingPageWrapper == null) {
            document.querySelector(".content").appendChild(unitTestPage);
        }
    }
}