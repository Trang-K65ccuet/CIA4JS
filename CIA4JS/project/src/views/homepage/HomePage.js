import {DOMUtils} from "../../components/utils/DOMUtils";
import {HomePageTemplate} from "./HomePageTemplate";
import ROUTE from "../../api/ApiRoute";
import recent_projects from "../../fake_data/git/someRepo.json";
import {auth} from "../../app";
import Utils from "../../components/utils/BasicUltils";
import ProjectAPI from "../../api/ProjectAPI";
import { router } from './../../app';
import {ViewUtils} from "../../components/utils/ViewUtils";
import { FromPcFormEvent } from "../../components/upload/from-pc/FromPcFormEvent";
import CONFIG from '../../../config';
import {IndexedDB} from '../../indexeddb/IndexedDB';
import {db} from './../../app';
import ProjectParserAPI from "../../api/ProjectParserAPI";
import TreeAPI from "../../api/TreeAPI";
import ToastTemplate from "../../components/common/toast/ToastTemplate";
import CentralViewDataManager from "../../components/data-manager/central-view/CentralViewDataManager";
import { VIEW_IDS } from "../../components/d3-components/viewers/view-components/central/CentralViewTabs";
import FromPcDataManager from "../../components/upload/from-pc/FromPcDataManager";
import { async } from "regenerator-runtime";


export const HomePage = {
    mount() {
        auth.validateAuth(this.createView);
    },
    unMount() {
        Utils.emptyContentDiv([".content"]);
    },
    createView() {
        let template = DOMUtils.createElementFromHTML(HomePageTemplate);

        // $("")

        document.querySelector(".content").style.backgroundColor = "#E8E8E8";
        let homepage_wrapper = document.querySelector(".homepage-wrapper");
        if (homepage_wrapper == null) {
            document.querySelector(".content").appendChild(template);

            HomePage.displayAddNewProject();
            HomePage.displayRecentProject();
        }
    },
    displayAddNewProject() {
        let wrapperList = document.querySelector(".recent-projects");

        wrapperList.appendChild(DOMUtils.createElementFromHTML(
            `<div>
                <i class="fas fa-user-clock"></i>
                <b class="add-newproject" style="font-weight: 300">Add new project!</b> 
            </div>`
        ))
            
        let menu = document.querySelectorAll(".add-newproject");
        menu.forEach((m, i) => {
            menu[i].addEventListener('click', function() {
                router.navigate('upload');
                // // console.log(CONFIG.username)
            });
        });
    },
   displayRecentProject() {
        let wrapperList = document.querySelector(".recent-projects");
        wrapperList.appendChild(DOMUtils.createElementFromHTML(
            `<div>
                <i class="fas fa-user-clock"></i>
                Recent projects
            </div>`
        ))
        
        wrapperList.appendChild(DOMUtils.createElementFromHTML(
            `<ul class="recent_project_list"></ul>`
        ))

        // fake data
        const projectList = recent_projects;
        // // console.log(CONFIG.username)
        let username;
        if(CONFIG.username === null){
            auth.logOut();
        } else {
            // // console.log("1111111")
            // // console.log(CONFIG.username)
            username = CONFIG.username;

            let projects = [];

                // get data from mySQL
            ProjectAPI.getAllProjectByUser(username)
            .then(respond => {
                console.log('respond', respond);
                return respond.content
            }).then(function(data){
                const projectListNew = data
                let projectListDiv = document.querySelector(".recent_project_list");
                console.log('data: ' + (JSON.stringify(data)));

                HomePage.getTopRecentProjects(projectListNew).forEach(project => {
                    console.log('project1111: ' + JSON.stringify(project));
                    projects.push({name: project.name, user: project.user, version: project.version, language: project.language})

                    projectListDiv.appendChild(
                        DOMUtils.createElementFromHTML(
                            `<li class="recent_project">
                                <form action="/workspace/dependency" id="upload-project">
                                    <b id="projectName-content">${project.name}</b>
                                    <br>
                                    <div class="pro-description">
                                        <div class="proj-info">User:&emsp;&emsp;&emsp;${project.user}</div>
                                        <div class="proj-info">Version:&emsp;&emsp;${project.version}</div>
                                        <div class="proj-info">Update at:&emsp;&emsp;${project.updated_at_string}</div>
                                        
                                        <div class="proj-info">Language:&emsp;&emsp;${project.language}</div>
                                        
                                    </div>
                                </form>
                            </li>`
                        )
                    )
                });

                let recentProjDoc = document.querySelectorAll(".recent_project");
                let filePath;
                recentProjDoc.forEach((m, i) => {
                    let fileName = projects[i].name
                    let fileVersion = projects[i].version

                    // bỏ dấu ()
                    // fileName = fileName.lastIndexOf('(') === -1? fileName : fileName.substring(0,fileName.lastIndexOf('(')-1)

                    recentProjDoc[i].addEventListener('click', function() {
                        console.log ("Language " + projects[i].language)
                        let language = projects[i].language;
                        localStorage.setItem('language', language);

                        // filePath = './project/anonymous/tmp-prj/'+fileName+'-'+fileVersion+'.zip.project'
                        filePath = './project/anonymous/tmp-prj/'+ fileName + '-' + fileVersion + '.zip.project'

                        let query = {
                            // path: './project/anonymous/tmp-prj/RestfulApiApplication-v1.0.zip.project'
                            path: filePath
                        }
                        ViewUtils.createLoading();
                        ProjectParserAPI.parseProjectByPath(query, language)
                        .then(parserRes => {
                            if (parserRes) {
                                CentralViewDataManager.projectName = fileName;
                                CentralViewDataManager.currentVersionName = fileVersion;
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
                });
            })
        }
    },

    getTopRecentProjects(recent_projects) {
        let topRecentProjects = [];

        let i = 0;
        let count = 50;

        recent_projects.forEach(project => {
            i++;
            if (i > count)  {
                // topRecentProjects.sort((a, b) => b.updated_at_string - a.updated_at_string);
                return topRecentProjects;
            }
            let customizesProject = {};
            console.log('projects', project);
            customizesProject.name = project.name;
            customizesProject.user = project.user;
            customizesProject.version = project.versionList[project.versionList.length-1].name;
            customizesProject.language = project.language;
            customizesProject.updated_at = project.versionList[project.versionList.length-1].uploadDate;
            customizesProject.updated_at_string = customizesProject.updated_at.slice(0, 10).trim();
            

            topRecentProjects.push(customizesProject);

        })
        // topRecentProjects.sort((a, b) => b.updated_at_string - a.updated_at_string);
        return topRecentProjects;
    }
}