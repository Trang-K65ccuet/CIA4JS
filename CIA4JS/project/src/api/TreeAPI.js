import {httpPost, httpRequest} from "./sender/sender";
import ROUTE from './ApiRoute';

export function getTree(payload, language = 'java') {
    // let route = ROUTE.PARSER_SERVICE.PARSE_PROJECT_WITH_FILE;
    if (language == 'c#'){
        route = ROUTE.CSHARP_SERVICE.PARSE_PROJECT_WITH_FILE;
    } else if(language == 'nodejs') {
        route = ROUTE.NODEJS_SERVICE.PARSE_PROJECT_WITH_FILE;
    } else if(language == 'javascript') {
        route = ROUTE.JAVASCRIPT_SERVICE.PARSE_PROJECT_WITH_FILE;
    } else if (language =='php') {
        route = ROUTE.PHP_SERVICE.PARSE_PROJECT_WITH_FILE;
    }

    let route;
    let languageInput = localStorage.getItem('language');
    console.log('language in get tree', languageInput);
    if (languageInput == 'c#') {
        route = ROUTE.CSHARP_SERVICE.PARSE_PROJECT_WITH_FILE;
    } else if (languageInput == 'nodejs') {
        route = ROUTE.NODEJS_SERVICE.PARSE_PROJECT_WITH_FILE;
    } else if (languageInput == 'javascript') {
        route = ROUTE.JAVASCRIPT_SERVICE.PARSE_PROJECT_WITH_FILE;
    } else if (languageInput == 'php') {
        route = ROUTE.PHP_SERVICE.PARSE_PROJECT_WITH_FILE;
    } else {
        route = ROUTE.PARSER_SERVICE.PARSE_PROJECT_WITH_FILE;
    }
    return httpPost(route, payload);
}

export function compare(payload) {
    const route = ROUTE.VERSION_COMPARE_SERVICE.COMPARE_BY_FILE;
    return httpPost(route, payload);
}

export function compareByPath(query) {
    let languageInput = localStorage.getItem('language');
    console.log('language in get tree', languageInput);
    let route;
    if (languageInput == 'c#') {
        route = ROUTE.VERSION_COMPARE_SERVICE.COMPARE_CSHARP_BY_PATH;
    } else {
        route = ROUTE.VERSION_COMPARE_SERVICE.COMPARE_BY_PATH;
    }

    // const route = ROUTE.VERSION_COMPARE_SERVICE.COMPARE_BY_PATH;

    let config = {
        method: 'post',
        url: route,
        headers: {
            'Content-Type': 'application/json'
        },
        data : query
    };

    return httpRequest(config);
}

export function newVersionCompare(oldPath, newVersionFile) {
    const language = localStorage.getItem('language');
    let route;
    if (language == 'c#') {
        route = ROUTE.VERSION_COMPARE_SERVICE.COMPARE_CSHARP_NEW_VERSION + "?oldPath=" + oldPath;
    } else {
        route = ROUTE.VERSION_COMPARE_SERVICE.COMPARE_NEW_VERSION + "?oldPath=" + oldPath;
    }

    let config = {
        method: 'post',
        url: route, 
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        data : newVersionFile
    }

    return httpRequest(config);
}

const TreeAPI = {
    getTree,
    compare,
    newVersionCompare,
    compareByPath,
}
export default TreeAPI;