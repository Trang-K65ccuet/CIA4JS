import ROUTE from "./ApiRoute";
import { httpPost } from "./sender/sender";

export function getFileContent(payload) {
    const route = ROUTE.FILE_SERVICE.GET_FILE_CONTENT;
    return httpPost(route, payload);
}

export function saveProject(payload) {
    const route = ROUTE.FILE_SERVICE.GET_FILE_CONTENT;
    return httpPost(route, payload)
}

const FileAPI = {
    getFileContent,
    saveProject,
}

export default FileAPI;