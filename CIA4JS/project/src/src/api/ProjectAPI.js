import ROUTE from "./ApiRoute";
import {httpGet, httpRequest} from "./sender/sender";
import CONFIG from "../../config";
import SystemConfig from "../config/config";
import {UploadDataManager} from "../components/upload/UploadDataManager";
import {IndexedDB} from "../indexeddb/IndexedDB";
import {db} from "../app";

const ProjectAPI = {
    getAllProjectByUser (query) {
        const route = ROUTE.PROJECT_SERVICE.GET_ALL_PROJECT +
            `?user=${(query.user !== null && query.user !== undefined) ? query.user : ""}` +
            `&name=${(query.name !== null && query.name !== undefined) ? query.name : ""}`;

        let config = {
            method: 'get',
            url: route,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            }
        };
        return httpRequest(config);
    },

    getAllProjectById (query) {
        const route = ROUTE.PROJECT_SERVICE.GET_ALL_PROJECT + `?id=${query.id}`;

        let config = {
            method: 'get',
            url: route,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            }
        };
        return httpRequest(config);
    },

    saveProject(query) {
        let dateTime = this.calculateTodayDateTime();

        let config = {
            method: 'post',
            url: ROUTE.PROJECT_SERVICE.SAVE_PROJECT,
            headers: {
                'Content-Type': 'application/json'
            },

            data : {
                name: query.projectName,
                user: CONFIG.username,
                versionList:[
                    {
                        name: query.versionName,
                        date: dateTime,
                        file: query.projectName + "-" + query.versionName,
                        path: ProjectAPI.createPathUtil(query)
                    }
                ],
                language: query.language
            }
        };
        return httpRequest(config);
    },
    saveVersion(query) {
        let dateTime = this.calculateTodayDateTime();

        let config = {
            method: 'post',
            url: ROUTE.PROJECT_SERVICE.SAVE_VERSION,
            headers: {
                'Content-Type': 'application/json'
            },

            data : {
                name: query.versionName,
                date: dateTime,
                file: query.projectName + "-" + query.versionName,
                path: ProjectAPI.createPathUtil(query),
                project:{
                    id: ProjectAPI.getProjectIdByName(query.projectName)
                },
                language: query.language
            }
        };
        return httpRequest(config);
    },
    saveVersion2(query) {
        let dateTime = this.calculateTodayDateTime();

        let config = {
            method: 'post',
            url: ROUTE.PROJECT_SERVICE.SAVE_VERSION,
            headers: {
                'Content-Type': 'application/json'
            },

            data : {
                name: query.versionName,
                date: dateTime,
                file: query.projectName + "-" + query.versionName,
                path: query.newVersionPath,
                project:{
                    id: query.projectId
                },
                language: query.language
            }
        };
        return httpRequest(config);
    },

    //Utils
    getProjectIdByName(name) {
      let proj = UploadDataManager.projectList.find(proj => proj.name === name);
      if (proj) {
          // // console.log(proj)
          return proj.id;
      }
    },
    getAllVersionIdByName(name) {
        let proj = UploadDataManager.projectList.find(proj => proj.name === name);
        if (proj) {
            // // console.log(proj)
            return proj.versionList;
        }
    },
    calculateTodayDateTime() {
        let today = new Date();
        let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        return date+' '+time;
    },

    createPathUtil(query) {
        return SystemConfig.FROM_PC_PROJECT_DIRECTORY_ROOT + "/" + query.projectName
            + "-" + query.versionName + ".zip.project";
    }
}

export default ProjectAPI;