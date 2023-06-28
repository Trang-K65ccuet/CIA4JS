import {DOMUtils} from "../utils/DOMUtils";
import {SingleProjectUploadTemplate} from "./template/SingleProjectUploadTemplate";
import {SingleProjectUploadEvent} from "./SingleProjectUploadEvent";
import {UploadFromGithubTemplate} from "./from-source-code/UploadFromGithubTemplate";
import {UploadFromPCTemplate} from "./from-pc/UploadFromPCTemplate";
import {FromPcFormEvent} from "./from-pc/FromPcFormEvent";

import { FileDetailForm } from "./template/FileDetailForm";
import {auth, db} from "../../app";
import {UploadDataManager} from "./UploadDataManager";
import Utils from "../utils/BasicUltils";
import FromGitFormEvent from "./from-source-code/FromGitFormEvent";
import GitDataManager from "./from-source-code/GitDataManager";
import VersionCompareUploadTemplate from "./version-compare/VersionCompareUploadTemplate";
import VersionCompareUploadEvent from "./version-compare/VersionCompareUploadEvent";
import ProjectAPI from "../../api/ProjectAPI";
import ToastTemplate from "../common/toast/ToastTemplate";
import CONFIG from "../../../config";


export const SingleProjectUpload = {
    viewId: "pc",

    mount() {
        UploadDataManager.setSingleProjectUpload(this);
        console.log("00000000000000000000000");
        auth.validateCreateView(UploadDataManager.getSingleProjectUpload());
    },

    unMount() {
        Utils.emptyContentDiv([".content"]);
    },

    setViewId(id) {
        this.viewId = id;
    },

    getProjectList() {
        let query = {
            user: "ducduongn"
        }
      ProjectAPI.getAllProjectByUser(CONFIG.username).then(res => {
        // console.log(res)
          if (res && res.content) {
              UploadDataManager.projectList = res.content
              // // console.log(UploadDataManager.projectList)
          }
      }).catch(error => {
          // console.log(error);
          ToastTemplate.emptyToast();
          ToastTemplate.addToast("Error getting project list");
          ToastTemplate.showToast();
      });
    },

    createView() {
        let uploadPage = DOMUtils.createElementFromHTML(SingleProjectUploadTemplate);

        this.getProjectList();

        document.querySelector(".content").style.backgroundColor = "#E8E8E8";
        let uploadPage_wrapper = document.querySelector(".single-upload-wrapper");

        if (uploadPage_wrapper == null) {
            document.querySelector(".content").appendChild(uploadPage);
        }


        SingleProjectUploadEvent.addMenuHeaderEvent();
        SingleProjectUploadEvent.addGitTokenModalEvent();

        this.createForm();
    },
    createForm() {
        Utils.emptyContentDiv([".upload-page-container"]);

        switch (this.viewId) {
            case "github":
                this.createFromGithubUploadForm();
                if (document.getElementById('sidebar').classList.contains('active')) {
                    $('#sidebar').toggleClass('active');
                }
                break;
            case "vc":
                this.createVersionCompareUploadForm();
                if (!document.getElementById('sidebar').classList.contains('active')) {
                    $('#sidebar').toggleClass('active');
                }
                break;
            default:
                this.createFromPcUploadForm();
                if (document.getElementById('sidebar').classList.contains('active')) {
                    $('#sidebar').toggleClass('active');
                }
                break;
        }
    },
    createFromPcUploadForm() {
        let uploadPageContainer = document.querySelector(".upload-page-container");

        // let fileDetailForm = DOMUtils.createElementFromHTML(FileDetailForm);
        // if (fileDetailForm !== null) {
        //     uploadPageContainer.appendChild(fileDetailForm);
        // }
        
        let formTemplate = DOMUtils.createElementFromHTML(UploadFromPCTemplate);

        if (uploadPageContainer) {
            uploadPageContainer.appendChild(formTemplate);

            FromPcFormEvent.displaySideBarForm();
            FromPcFormEvent.addNewProjForm();
            FromPcFormEvent.addEventProjectAndVersionNameInput();
            FromPcFormEvent.addEventProjectLanguage();
            FromPcFormEvent.addSideBarMenuHeaderEvent();
            FromPcFormEvent.addUploadFileEvent(db);
        }

    },
    createVersionCompareUploadForm() {
        let uploadPageContainer = document.querySelector(".upload-page-container");

        let formTemplate = DOMUtils.createElementFromHTML(VersionCompareUploadTemplate);

        if (uploadPageContainer) {
            uploadPageContainer.appendChild(formTemplate);

            VersionCompareUploadEvent.displaySideBarForm();
            VersionCompareUploadEvent.addSideBarMenuHeaderEvent();
            VersionCompareUploadEvent.utils(db)
        }

    },

    createFromGithubUploadForm() {
        let uploadPageContainer = document.querySelector(".upload-page-container");

        let formTemplate = DOMUtils.createElementFromHTML(UploadFromGithubTemplate);

        if (uploadPageContainer) {
            uploadPageContainer.appendChild(formTemplate);

            // Display side bar
            FromGitFormEvent.displaySideBarForm();

            //Add event for side bar
            FromGitFormEvent.addGitFormEventListener();

            //Add submit event
            FromGitFormEvent.submitSourceControl();
        }
    },

}