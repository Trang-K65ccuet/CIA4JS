import ROUTE from "./ApiRoute";
import {httpPost, httpRequest} from "./sender/sender";

const ProjectParserAPI = {
    parseProjectByPath(path, language) {
        let config = {
            method: 'post',
            url: ROUTE.PARSER_SERVICE.PARSE_PROJECT_WITH_PATH,
            headers: {
                'Content-Type': 'application/json'
            },
            data : path
        };

        let configCS = {
            method: 'post',
            url: ROUTE.CSHARP_SERVICE.PARSE_PROJECT_WITH_PATH,
            headers: {
                'Content-Type': 'application/json'
            },
            data : path
        };

        if(language == 'c#') {
            return httpRequest(configCS);
        } else {
            return httpRequest(config);
        }
    }
};

export default ProjectParserAPI;