import project_list from "../../fake_data/git/allRepos.json";

import {ProjectPageTemplate} from "./ProjectPageTemplate";
import {DOMUtils} from "../utils/DOMUtils";
import {auth, db, router} from "../../app";
import Utils from "../utils/BasicUltils";
import ProjectAPI from "../../api/ProjectAPI";
import ProjectDataManager from "./ProjectDataManager";
import {GitDataManager} from "../data-manager/git-service/GitDataManager";
import CONFIG from "../../../config";
import {IndexedDB} from "../../indexeddb/IndexedDB";
import { ViewUtils } from "../utils/ViewUtils";
import ProjectParserAPI from "../../api/ProjectParserAPI";
import CentralViewDataManager from "../data-manager/central-view/CentralViewDataManager";
import { VIEW_IDS } from "../d3-components/viewers/view-components/central/CentralViewTabs";

export const ProjectPage = {
    mount() {
        auth.validateAuth(ProjectPage.createView);
        DOMUtils.showNavLink();
        this.getProjectList();
    },
    getProjectList() {
        if (CONFIG.username !== null) {
            let query = {
                user: CONFIG.username
            }
            ProjectAPI.getAllProjectByUser(query)
                .then(res => {
                    ProjectDataManager.projectList = res;
                })
        } else {
            IndexedDB.getRecord(db, 'username').then(
                d => {
                    // console.log(d)
                    CONFIG.username = d;
                    let query = {
                        user: CONFIG.username
                    }
                    ProjectAPI.getAllProjectByUser(query)
                        .then(res => {
                            ProjectDataManager.projectList = res;
                        })
                }
            )
        }
    },
    unMount() {
        Utils.emptyContentDiv([".content"]);
    },
    createView() {
        let projectPageTemplate = DOMUtils.createElementFromHTML(ProjectPageTemplate);

        document.querySelector(".content").style.backgroundColor = "#E8E8E8";
        let homepage_wrapper = document.querySelector(".project-wrapper");
        if (homepage_wrapper == null) {
            document.querySelector(".content").appendChild(projectPageTemplate);
        }

        ProjectPage.addModalEventListener();
        ProjectPage.setBtnEvent();
        ProjectPage.displayAllProject();
        // ProjectPage.addTokenEventListener();
        },

    addModalEventListener() {
        const modals = document.querySelectorAll("[data-modal]");

       if (modals) {
           modals.forEach(function (trigger) {
               const modal = document.querySelector(`#${trigger.dataset.modal}`);

               const modalClose = document.querySelector(`#${trigger.dataset.modal} .js-modal-close`);

               const modalContainer = document.querySelector(`#${trigger.dataset.modal} .js-modal-container`);

               function showModal() {
                   modal.classList.add('open');
               }

               function hideModal() {
                   modal.classList.remove('open');
               }

               trigger.addEventListener('click', showModal);
               modalClose.addEventListener('click', hideModal);
               modal.addEventListener('click', hideModal);

               modalContainer.addEventListener('click', function(event) {
                   event.stopPropagation();
               })
           });
       } else {
           // console.log("Modals is null!!!")
       }
    },

    setBtnEvent() {
        let button = document.querySelector("#upload");

        if (button) {
           button.addEventListener("click", (e) => {
               router.navigate("upload");
            })
        }
    },

    displayAllProject() {
        let projectListDiv = document.getElementById("project-page-list");

        if (projectListDiv) {

            ProjectAPI.getAllProjectByUser(CONFIG.username)
            .then(respond => {
                return respond.content
            }).then(function(data){
                ProjectPage.getTopRecentProjects(data).forEach((proj, i) => {
                    console.log(proj.language);
                    console.log('project'. proj);
                    projectListDiv.appendChild(
                        DOMUtils.createElementFromHTML(`
                        <div class="accordion-item mb-3">
                            <h2 class="accordion-header" id="heading${i}">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${i}" aria-expanded="true" aria-controls="collapse${i}">
                                    <strong>${proj.name}</strong>
                                </button>
                            </h2>
                            <div id="collapse${i}" class="accordion-collapse collapse" aria-labelledby="heading${i}" data-bs-parent="#project-page-list">
                                <div class="accordion-body">
                                    <div><strong>Language:</strong> ${proj.language}</div>
                                    <div><strong>Versions:</strong> ${proj.version.length} versions</div>
                                    <div id = ${proj.name}></div>
                                </div>
                            </div>
                        </div>

                            // <li class="project-list-item proj-item">
                            //     <div class="proj-col proj-name">${proj.name}</div>
                            //     <div class="proj-col proj-owner">${proj.owner.login}</div>
                            //     <div class="proj-col proj-description">
                            //         ${(proj.description !== null) ? proj.description : ""}/
                            //     </div>
                            //     <div class="proj-col proj-language">
                            //         ${(proj.language !== null) ? proj.language : ""}
                            //     </div>
                            //     <div class="proj-col proj-updated-dated">${proj.updated_at_string}</div>
                            // </li>
                        `)
                    );
                    ProjectPage.getVersionList(proj.name, proj.version, proj.language);
                    //console.log ("hello" + localStorage.getItem('language'));
                })
            })
        } else {
            // console.log("projectListDiv not found");
        }
    },
    getVersionList(name,versions,language) {
        let projectDiv = document.getElementById(name);
        if(projectDiv) {
            versions.forEach((ver, i) => {
                projectDiv.appendChild(
                    DOMUtils.createElementFromHTML(`
                    <li class=${name+"verList"}>
                        <b>${versions[i].name}</b>
                    </li>
                    `)
                )
            })
        }

        let verListDiv = document.querySelectorAll("."+name+"verList");
        if(verListDiv) {
            let filePath;
            verListDiv.forEach((m, i) => {
                verListDiv[i].addEventListener('click', function() {
                    filePath = './project/anonymous/tmp-prj/'+ name + '-' + versions[i].name + '.zip.project'
                    // console.log(filePath)
                    let query = {
                        // path: './project/anonymous/tmp-prj/RestfulApiApplication-v1.0.zip.project'
                        path: filePath
                    }
                    localStorage.setItem('language', language);
                    ViewUtils.createLoading();
                    ProjectParserAPI.parseProjectByPath(query, language)
                    .then(parserRes => {
                        if (parserRes) {
                            CentralViewDataManager.projectName = name;
                            CentralViewDataManager.currentVersionName = versions[i].name;
                            IndexedDB.getRecord(db, 'root-node').then(
                                result => {
                                    if (result === undefined)
                                        IndexedDB
                                            .insertRecord(db, parserRes, 'root-node')
                                            .then(() => {
                                                CentralViewDataManager.viewMode = VIEW_IDS.DEPENDENCY_VIEW_ID;
                                                router.navigate("workspace/dependency");
                                            });
                                    else
                                        IndexedDB
                                            .updateRecord(db, parserRes, 'root-node')
                                            .then(() => {
                                                CentralViewDataManager.viewMode = VIEW_IDS.DEPENDENCY_VIEW_ID;
                                                router.navigate("workspace/dependency");
                                            });
                                }
                            );
                        }
                    })
                })
            })
        }
    },

    getTopRecentProjects(recent_projects) {
        let topRecentProjects = [];

        recent_projects.forEach(project => {
            let customizesProject = {};
            customizesProject.name = project.name;
            customizesProject.owner = CONFIG.username;
            customizesProject.version = project.versionList;
            customizesProject.language = project.language;

            // customizesProject.language = project.language;
            // customizesProject.description = project.description;
            // customizesProject.owner = project.owner.login;
            // customizesProject.updated_at_string = project.updated_at.slice(0, 10).trim();
            // customizesProject.updated_at = new Date(customizesProject.updated_at_string);
            // customizesProject.name = project.name;

            topRecentProjects.push(customizesProject);

        })
        topRecentProjects.sort((a, b) => b.updated_at - a.updated_at);
        return topRecentProjects;
    },

}