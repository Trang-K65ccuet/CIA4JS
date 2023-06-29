import CONFIG from './../../config';
const ROUTE = {
    JAVA_SERVICE: {
        JAVA_PATH_TO_ROOT_NODE: CONFIG.JCIA_BASE_URL + '/api/java-service/pathParse/toRoot',
        JAVA_FILE_TO_ROOT_NODE: CONFIG.JCIA_BASE_URL + `/api/java-service/fileParse/toRoot`,
        JAVA_PATH_TO_ALL_NODES: CONFIG.JCIA_BASE_URL + `/api/java-service/pathParse/toNodes`,
        JAVA_FILE_TO_ALL_NODES:  CONFIG.JCIA_BASE_URL + `/api/java-service/fileParse/toNodes`,
        JAVA_FILE_TO_DEPENDENCIES: CONFIG.JCIA_BASE_URL + `/api/java-service/fileParse/dependencies`,
        JAVA_PATH_TO_DEPENDENCIES: CONFIG.JCIA_BASE_URL + `/api/java-service/pathParse/dependencies`,
        JAVA_WITH_FILE: CONFIG.JCIA_BASE_URL + `/api/java-service/fileParse`,
        JAVA_WITH_PATH: CONFIG.JCIA_BASE_URL + `/api/java-service/pathParse`,
    },

    CSHARP_SERVICE: {
        PARSE_PROJECT_WITH_FILE: CONFIG.JCIA_BASE_URL + `/api/csharp-service/parse/file`,
        PARSE_PROJECT_WITH_PATH: CONFIG.JCIA_BASE_URL + `/api/csharp-service/parse/path`,
    },

    NODEJS_SERVICE: {
        PARSE_PROJECT_WITH_FILE: CONFIG.NODEJS_URL + `/api/nodejs-service/parse/file`,
    },

    JAVASCRIPT_SERVICE: {
        PARSE_PROJECT_WITH_FILE: CONFIG.JAVASCRIPT_URL + `/api/javascript-service/parse/file`,
    },

    PHP_SERVICE : {
        PARSE_PROJECT_WITH_FILE: 'http://127.0.0.1:8000/api/php-service/parser',
    },

    // CSHARP_SERVICE_URL: {
    //     PARSE_PROJECT_WITH_FILE: CONFIG.CSHARP_BASE_URL + `/api/csharp-service/parse/file`,
    //     PARSE_PROJECT_WITH_PATH: CONFIG.CSHARP_BASE_URL + `/api/csharp-service/parse/path`,
    // },
    
    ACCOUNT: {
        REGISTER: CONFIG.JCIA_BASE_URL + `/api/user-service/register`,
        LOGIN: CONFIG.JCIA_BASE_URL + `/api/user-service/login`,
    },
    CIA_SERVICE: {
        CAL_NODE_WEIGHT: CONFIG.JCIA_BASE_URL + `/api/cia-service/calculate`,
        GET_IMPACT: CONFIG.JCIA_BASE_URL + '/api/cia-service/impact'
    },
    PROJECT_SERVICE: {
        SAVE_PROJECT: CONFIG.JCIA_BASE_URL + `/api/project-service/project/save`,
        SAVE_VERSION: CONFIG.JCIA_BASE_URL + `/api/project-service/version/save`,
        GET_ALL_PROJECT: CONFIG.JCIA_BASE_URL + '/api/project-service/project/get',
        GET_ALL_VERSION: CONFIG.JCIA_BASE_URL + '/api/project-service/version/get',
    },
    UTILITY_SERVICE: {
        UPLOAD_FILE: CONFIG.JCIA_BASE_URL + `/api/utility-service/uploadFile`,
    },
    PARSER_SERVICE: {
        PARSE_PROJECT_WITH_FILE: CONFIG.JCIA_BASE_URL + `/api/parser-service/parse/file?parser=java-parser,spring-parser,jsf-parser`,
        PARSE_PROJECT_WITH_PATH: CONFIG.JCIA_BASE_URL + `/api/parser-service/parse/path?parser=java-parser,spring-parser,jsf-parser`,
        PARSER_CSHARP_PROJECT_WITH_FILE: CONFIG.JCIA_BASE_URL + `/api/csharp-service/parse/file`,
        PARSER_CSHARP_PROJECT_WITH_PATH: CONFIG.JCIA_BASE_URL + `/api/csharp-service/parse/path`,
    },
    SPRING_SERVICE: {
        GET_SPRING_DEPENDENCY: CONFIG.JCIA_BASE_URL + `/api/spring-service/dependency/spring`,
    },
    VERSION_COMPARE_SERVICE: {
        COMPARE_BY_PATH: CONFIG.JCIA_BASE_URL + `/api/version-compare-service/byPath`,
        COMPARE_CSHARP_BY_PATH: CONFIG.JCIA_BASE_URL + `/api/csharp-service/compare/byPath`,
        COMPARE_BY_FILE: CONFIG.JCIA_BASE_URL + `/api/version-compare-service/byFile`,
        COMPARE_NEW_VERSION: CONFIG.JCIA_BASE_URL + '/api/version-compare-service/newVersion',
        COMPARE_CSHARP_NEW_VERSION: CONFIG.JCIA_BASE_URL + '/api/csharp-service/compare/newVersion',
    },
    FILE_SERVICE: {
        GET_FILE_CONTENT: CONFIG.JCIA_BASE_URL + `/api/file-service/file`,
    },
    GIT_SERVICE: {
        GET_REPO_BRANCHES: CONFIG.JCIA_BASE_URL + `/api/git-service/repo/branches`,
        GET_REPO_COMMITS_BY_BRANCH: CONFIG.JCIA_BASE_URL + `/api/git-service/repo/commits`,
        GET_REPO_INFO: CONFIG.JCIA_BASE_URL + `/api/git-service/repo/info`,
        CLONE_REPO_DEFAULT: CONFIG.JCIA_BASE_URL + `/api/git-service/repo/clone`,
        CLONE_REPO_BY_BRANCH: CONFIG.JCIA_BASE_URL + `/api/git-service/repo/clone/byBranch`,
        CLONE_REPO_BY_COMMIT: CONFIG.JCIA_BASE_URL + `/api/git-service/repo/clone/byCommit`,
        COMPARE_REPOS_BY_BRANCHES: CONFIG.JCIA_BASE_URL + `/api/git-service/repos/clone/byBranch`,
        COMPARE_REPOS_BY_COMMITS: CONFIG.JCIA_BASE_URL + `/api/git-service/repos/clone/byCommit`,
        
    },
    XML_SERVICE: {
        XML_PATH_TO_ALL_NODES: CONFIG.JCIA_BASE_URL + `/api/xml-service/pathParse`,
        XML_TO_DEPENDENCIES: CONFIG.JCIA_BASE_URL + `/api/xml-service/dependency`
    }
}

export default ROUTE;