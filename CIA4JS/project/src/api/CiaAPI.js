import ROUTE from "./ApiRoute";
import {httpRequest} from "./sender/sender";

const CiaAPI = {
    getImpactNodes(query) {
        const route = ROUTE.CIA_SERVICE.GET_IMPACT;

        let config = {
            method: 'post',
            url: route,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            data : query
        };
        return httpRequest(config);
    }
};

export default CiaAPI;