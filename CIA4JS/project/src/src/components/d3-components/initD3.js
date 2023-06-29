import ViewManager from "./viewers/ViewManager";
import DVGraphDataManager from "../data-manager/dependency-graph/DVGraphDataManager"
import LeftView from "./viewers/view-components/LeftView";
import CentralView from "./viewers/view-components/CentralView";
import RightView from "./viewers/view-components/RightView";
import {ToolBar} from "./viewers/view-components/central/ToolBar";
import DVGraphData from "../data-manager/dependency-graph/DVGraphData";
import {ViewUtils} from "../utils/ViewUtils";
import {IndexedDB} from "../../indexeddb/IndexedDB";
import Utils from "../utils/BasicUltils";
import {auth, db, router} from "../../app";
import CentralViewDataManager from "../data-manager/central-view/CentralViewDataManager";
import {VIEW_IDS} from "./viewers/view-components/central/CentralViewTabs";
import {VCDataManager} from "../data-manager/version-compare-graph/VCDataManager";
import {VCGraphData} from "../data-manager/version-compare-graph/VCGraphData";
import ImpactDataManager from "../data-manager/impact/ImpactDataManager";
import ProjectAPI from "../../api/ProjectAPI";
import {DOMUtils} from "../utils/DOMUtils";
import ToastTemplate from "../common/toast/ToastTemplate";
import FileUtils from "../utils/FileUtils";
import TreeAPI, {newVersionCompare} from "../../api/TreeAPI";
import VersionView from "./viewers/view-components/left/VersionView";

export const ViewInitializer = {
    mount() {
        if (CentralViewDataManager.viewMode === VIEW_IDS.DEPENDENCY_VIEW_ID) {
            auth.validateAuth(() => {
                ViewUtils.createLoading();
                IndexedDB.getRecord(db, 'root-node').then(
                    d => {
                        console.log('d', d);
                        // // console.log("dv")
                        if (d) {
                            IndexedDB.getRecord(db, 'username').then(
                                usernameData => {
                                    let query = {
                                        user: usernameData,
                                        name: d.projectName === undefined ? CentralViewDataManager.projectName : d.projectName
                                    }
                                    // console.log(query)
                                    // console.log(query)
                                    ProjectAPI.getAllProjectByUser(query).then(res => {
                                        let index = res.content[res.content.length - 1];
                                        // console.log(res)
                                        CentralViewDataManager.projectData = res.content[res.content.length - 1];
                                        let str = index.versionList[0].file
                                        str = str.substring(0, str.lastIndexOf('-'))
                                        // console.log(str)
                                        CentralViewDataManager.projectName = d.projectName == undefined ? str : d.projectName;
                                        CentralViewDataManager.currentVersionName = d.versionName == undefined ? index.versionList[index.versionList.length - 1].name : d.versionName;
                                        Utils.removeUnusedComponents([
                                            ".loader-wrapper"
                                        ]);
                                        ViewInitializer.initializeDVView(d.dvData == undefined ? d : d.dvData );
                                    })
                                        .catch(error => {
                                            // console.log(error)
                                            Utils.removeUnusedComponents([
                                                ".loader-wrapper"
                                            ]);
                                            router.navigate("upload");
                                        });
                                })
                        } else {
                            router.navigate("upload");
                            Utils.removeUnusedComponents([
                                ".loader-wrapper"
                            ]);
                        }
                    }
                )
            })
        } else {
            auth.validateAuth(() => {
                ViewUtils.createLoading();
                IndexedDB.getRecord(db, 'version-compare').then(
                    d => {
                        // // console.log("vc")
                        // console.log(d)
                        if(d){
                            ViewInitializer.initializeVCView(d);
                            Utils.removeUnusedComponents([
                                ".loader-wrapper"
                            ]);
                        } else {
                            router.navigate("upload");
                            Utils.removeUnusedComponents([
                                ".loader-wrapper"
                            ]);
                        }
                    }
                )
            })
        }
    },
    unMount() {
        CentralViewDataManager.cleanCentralView();

        //unmount
        ImpactDataManager.changedNodes = [];

        Utils.emptyContentDiv([".content"]);
        Utils.removeUnusedComponents(["#contextmenu"])
        $.contextMenu( 'destroy' );
        $(`.context-menu-list`).remove();
    },
    initializeDVView(data) {
        // // console.log(data)
        //Initialize View
        // console.log("999999999999999999999")
        ViewManager.initBaseViews();

        DVGraphDataManager.clearData();

        //Parse Data
        DVGraphDataManager.parseData(data);

        //create Central View
        CentralView.createView();

        // DVGraphDataManager.generateDVGraph();

        LeftView.createView(DVGraphData.graphData.dataTree);
        RightView.createView(DVGraphData.graphData);

        ViewInitializer.createVersionViewModal();
        ViewInitializer.addEventVersionModal();

        ToolBar.createToolBar(DVGraphData);
    },
    createVersionViewModal() {
        let contentDiv = document.querySelector(".content");
        if (contentDiv) {
            contentDiv.appendChild(DOMUtils.createElementFromHTML(`
            <div class="modal fade" id="versionUploadModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="versionUploadModalLabel" aria-hidden="true">
              <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="versionUploadModalLabel">Upload new version</h5>
                  </div>
                  <div class="modal-body">
                      <div class="mb-3">
                          <div class="input-group mb-3">
                            <span class="input-group-text" id="inPutGroupProjectName">Project name</span>
                            <input value="${CentralViewDataManager.projectData.name}" id="frompc-ver" type="text" class="form-control" aria-describedby="inPutGroupProjectName" disabled>
                          </div>
                          <div class="input-group mb-3">
                            <span class="input-group-text" id="inputGroupVer">Version name</span>
                            <input id="version-view-ver-name" type="text" class="form-control" aria-describedby="inputGroupVer">
                            <div class="invalid-feedback"> Version name has already existed in Project Name.</div>
                          </div>
                          <input class="form-control" type="file" id="newVersionFile">
                       </div>
                  </div>
                  <div class="modal-footer">
                    <button id="version-view-form-close" type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button id="version-view-form-submit" type="button" class="btn btn-primary">Save changes</button>
                  </div>
                </div>
              </div>
            </div>                
            `))
        }
    },
    addEventVersionModal() {
        ViewInitializer.addValidateEvent();
        ViewInitializer.addEventFormClose();
        ViewInitializer.addFileInputEvent();
        ViewInitializer.addSubmitBtnEvent();
    },
    addSubmitBtnEvent() {
        let submitBtn = document.getElementById('version-view-form-submit');
        if (submitBtn) {
            submitBtn.addEventListener('click', (event) => {
                // console.log("submit")
                let versionNameInput = document.getElementById('version-view-ver-name');
                if (versionNameInput) {
                    let inputValue = versionNameInput.value;
                    CentralViewDataManager.newVersionName = inputValue;
                    if (CentralViewDataManager.checkIfVersionExist(inputValue) || inputValue.length === 0) {
                        if (CentralViewDataManager.checkIfVersionExist(inputValue)) {
                            ToastTemplate.emptyToast();
                            ToastTemplate.addToast(
                                "Version name is already existed!",
                                "Please using another version name");

                            ToastTemplate.showToast();
                        }
                        else {
                            ToastTemplate.emptyToast();
                            ToastTemplate.addToast(
                                "Version name is empty!",
                                "Please fill in version name");

                            ToastTemplate.showToast();
                        }
                    }
                    else {
                        // console.log("acc")
                        CentralViewDataManager.newVersionFile = FileUtils.renameFile(
                            CentralViewDataManager.newVersionFile,
                            CentralViewDataManager.projectName + "-" + versionNameInput.value + ".zip"
                        );
                        let form = new FormData();
                        form.append(
                            "file",
                            CentralViewDataManager.newVersionFile,
                            CentralViewDataManager.newVersionFile.name
                        );
                        // // console.log(CentralViewDataManager.newVersionFile)
                        // // console.log(form)
                        let version = CentralViewDataManager.getVersionByVersionName(CentralViewDataManager.currentVersionName);
                        if (version !== undefined) {
                            let path = version.path;
                            let filePath = './project/anonymous/tmp-prj/'+ CentralViewDataManager.projectName + '-' + versionNameInput.value + '.zip.project'
                            TreeAPI
                                .newVersionCompare(version.path, form)
                                .then(res => {
                                    // // console.log(res);

                                    IndexedDB.getRecord(db, 'version-compare').then(
                                        result => {
                                            if (result === undefined) {
                                                IndexedDB.insertRecord(db, res, 'version-compare')
                                                    .then(() => {
                                                        ViewInitializer.saveVersion(filePath)
                                                    });
                                            } else {
                                                IndexedDB.updateRecord(db, res, 'version-compare')
                                                    .then(() => {
                                                        ViewInitializer.saveVersion(filePath)
                                                    });
                                            }
                                        }
                                    )
                                })
                        } else {
                            // console.log("Current version name not existed");
                        }
                    }
                } else {
                    // console.log("version name input name not found");
                }

            })
        }
    },
    saveVersion(res) {
        let query = {
            projectName: CentralViewDataManager.projectName,
            versionName: CentralViewDataManager.newVersionName,
            newVersionPath: res,
            projectId: CentralViewDataManager.projectData.id
        };

        ProjectAPI.saveVersion2(query)
            .then(saveVersionRes => {
                    ProjectAPI.getAllProjectByUser(query).then(res => {
                        if (res) {
                            res.content.forEach(element => {
                                if (element.name === query.projectName) {
                                    CentralViewDataManager.projectData = element;
                                }
                            });

                            if (CentralView.currentViewId === VIEW_IDS.VERSION_COMPARE_ID) {
                                CentralView.closeTab(CentralView.getTab(VIEW_IDS.VERSION_COMPARE_ID));
                                CentralView.addTab(CentralView.getTab(VIEW_IDS.VERSION_COMPARE_ID));
                            } else {
                                CentralView.addTab(CentralView.getTab(VIEW_IDS.VERSION_COMPARE_ID));
                            }
                            VersionView.displayVersionList();
                            ViewInitializer.clearModalFormData();
                            $('#versionUploadModal').modal('toggle');
                        }
                    })
            });
    },
    addEventFormClose() {
      let closeBtn = document.getElementById('version-view-form-close');
      if (closeBtn) {
          closeBtn.addEventListener('click', (event) => {
             ViewInitializer.clearModalFormData();
          });
      }
    },
    clearModalFormData() {
        let versionNameInput = document.getElementById('version-view-ver-name');
        if (versionNameInput) {
            versionNameInput.classList.remove('is-valid');
            versionNameInput.classList.remove('is-invalid');
            versionNameInput.value = "";
        }
        let newVersionFileInput = document.getElementById('newVersionFile');
        if (newVersionFileInput) {
            newVersionFileInput.value = null;
            CentralViewDataManager.newVersionFile = null;
        }
    },
    addFileInputEvent() {
        let newVersionFileInput = document.getElementById('newVersionFile');
        if (newVersionFileInput) {
            newVersionFileInput.addEventListener('change', event => {
                CentralViewDataManager.newVersionFile = newVersionFileInput.files[0];
                // console.log(CentralViewDataManager.newVersionFile)
            })
        }
    },
    addValidateEvent() {
        let versionNameInput = document.getElementById('version-view-ver-name');
        if (versionNameInput) {
            versionNameInput.addEventListener('input', (event) => {
                let inputValue = versionNameInput.value;
                if (CentralViewDataManager.checkIfVersionExist(inputValue) || inputValue.length === 0) {
                    versionNameInput.classList.remove('is-valid');
                    versionNameInput.classList.add('is-invalid');
                } else {
                    versionNameInput.classList.add('is-valid');
                    versionNameInput.classList.remove('is-invalid');
                }
            })
        }
    },
    initializeVCView(data) {
        // console.log(data)
        ViewManager.initBaseViews();

        //Clear data
        VCDataManager.clearData();

        //Parse Data
        VCDataManager.parseData(data);
        // VCDataManager.generateVCGraph();
        
        // console.log(VCGraphData.graphData.dataTree)

        //create Central View
        CentralView.createView();

        // VCDataManager.generateVCGraph();

        //create left and right view for Dependency
        // console.log(VCGraphData.graphData.dataTree)
        LeftView.createView(VCGraphData.graphData.dataTree);

        
        RightView.createView(VCGraphData.graphData);

        //Create tool bar
        ToolBar.createToolBar(VCGraphData);
    }
}