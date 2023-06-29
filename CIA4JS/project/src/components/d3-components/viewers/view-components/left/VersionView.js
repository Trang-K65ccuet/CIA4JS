import {DOMUtils} from "../../../../utils/DOMUtils";
import CentralViewDataManager from "../../../../data-manager/central-view/CentralViewDataManager";
import Utils from "../../../../utils/BasicUltils";
import TreeAPI from "../../../../../api/TreeAPI";
import {createVersionViewContext, VERSION_VIEW_CONTEXT_OPT} from "../central/ContextMenu";
import CentralView from "../CentralView";
import { VIEW_IDS } from "../central/CentralViewTabs";

const VersionView = {
  createView() {
      let versionView = document.querySelector(".version-view");
      if (versionView) {
          versionView.append(DOMUtils.createElementFromHTML(
              `
              <div class="version-view-title" id="version-view-title">
                   <div class="version-view-title-content">
                       <span>Version list</span>
                       <button type="button" class="btn btn-success btn-sm" data-bs-toggle="modal" data-bs-target="#versionUploadModal">
                          New version
                       </button>
                   </div>
              </div>
              `
          ));
          versionView.append(DOMUtils.createElementFromHTML(
              `
              <div class="version-view-content" id="version-view-content">                  
              </div>
              `
          ));
          // console.log(CentralViewDataManager.projectData)
      }

      VersionView.displayVersionList();
  },
    displayVersionList() {
      Utils.emptyContentDiv(["#version-view-content"]);
      let versionContent = document.getElementById('version-view-content');
      if (versionContent) {
        console.log('project data', CentralViewDataManager.projectData);
          CentralViewDataManager.projectData.versionList.forEach(version => {
                let versionItem;
                let currentVersion = CentralViewDataManager.getVersionByVersionName(CentralViewDataManager.currentVersionName);
                let laterVersion = CentralViewDataManager.getVersionByVersionName(CentralViewDataManager.laterVersionName);
                // console.log(version)
                // console.log(currentVersion)
                // console.log(laterVersion)
                // console.log(new Date())
                // console.log(CentralView.currentViewId)
                if (currentVersion.id === version.id) {
                    versionItem = versionContent.appendChild(DOMUtils.createElementFromHTML(
                        `
                    <div class="version-item" id="version-item-${version.name}">
                            <div class="version-item-content">
                                <div class="badge bg-dark">${version.name}</div>
                                <div class="badge bg-primary current-version-tag">Current version</div>
                            </div>
                    </div>
                    `
                    ));
                } else if ( CentralView.currentViewId !== null
                    && CentralView.currentViewId === VIEW_IDS.VERSION_COMPARE_ID
                    && laterVersion!== undefined 
                    &&  laterVersion.id === version.id) 
                    {
                    versionItem = versionContent.appendChild(DOMUtils.createElementFromHTML(
                        `
                    <div class="version-item" id="version-item-${version.name}">
                            <div class="version-item-content">
                                <div class="badge bg-dark">${version.name}</div>
                                <div class="badge bg-primary current-version-tag">Later version</div>
                            </div>
                    </div>
                    `
                    ));
                } else {
                    versionItem = versionContent.appendChild(DOMUtils.createElementFromHTML(
                        `
                    <div class="version-item" id="version-item-${version.name}">
                            <div class="version-item-content">
                                <div class="badge bg-dark">${version.name}</div>
                            </div>
                    </div>
                    `
                    ));
                }
                versionItem.addEventListener("contextmenu", (event) => {
                    let compareData = {
                        oldVersion: {
                            name: currentVersion.name,
                            path: currentVersion.path
                        },
                        newVersion: {
                            name: version.name,
                            path: version.path
                        }
                    };
                    // console.log(compareData)
                    createVersionViewContext(event, VERSION_VIEW_CONTEXT_OPT, compareData);
                })
          })
      }
    }
};

export default VersionView;