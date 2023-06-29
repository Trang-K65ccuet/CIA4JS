import { httpPost } from "../sender/sender";

export function getSpringDependencies(payload) {
    const route = `http://localhost:7003/api/dependency/spring`;
    return httpPost(route, payload);
}

const SpringAPI = {
    getSpringDependencies,
}
export default SpringAPI;