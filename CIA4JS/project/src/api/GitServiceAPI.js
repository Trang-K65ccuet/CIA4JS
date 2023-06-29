import {
    httpPost,
    httpGet, github
} from "./sender/sender";
import ROUTE from './ApiRoute';

export function authenticate() {
    const route = ROUTE.GIT_SERVICE.AUTH_USER;
    window.open(route, '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');
    // return httpGet(route);
}

export function getUserInfo() {
    const route = ROUTE.BASE + ROUTE.BASE + ROUTE.GIT_SERVICE.GET_USER_INFO;
    return httpGet(route);
}

function getAllUserRepos() {
    const route = ROUTE.BASE + ROUTE.GIT_SERVICE.GET_ALL_REPOS_USER;
    return httpGet(route);
}

function getAllBranchByRepo(query) {
    const route = ROUTE.GIT_SERVICE.GET_REPO_BRANCHES + `?url=${query.url}`
        + `&username=${query.user}`
        + `&token=${query.token}`;
    return httpGet(route);
}


function getAllCommitByRepo(query) {
    const route = ROUTE.GIT_SERVICE.GET_REPO_COMMITS_BY_BRANCH + `?url=${query.url}`
        + `&branch=${query.branch}`
        + `&username=${query.user}`
        + `&token=${query.token}`;
    // console.log({route});
    return httpGet(route);
}

function compareByBranches(query) {
    const route = ROUTE.GIT_SERVICE.COMPARE_REPOS_BY_BRANCHES + `?url=${query.url}`
        + `&branch1=${query.branch1}`
        + `&branch2=${query.branch2}`
        + `&username=${query.user}`
        + `&token=${query.token}`
        + `&compare=${query.compare}`;
    return httpGet(route);
}

function compareByCommits(query) {
    const route = ROUTE.GIT_SERVICE.COMPARE_REPOS_BY_COMMITS + `?url=${query.url}`
        + `&commit1=${query.commit1}`
        + `&commit2=${query.commit2}`
        + `&username=${query.username}`
        + `&token=${query.token}`
        + `&compare=${query.compare}`;
    return httpGet(route);
}

function cloneRepoByBranch(query) {
    const route = ROUTE.GIT_SERVICE.CLONE_REPO_BY_BRANCH + `?url=${query.url}`
        + `&branch=${query.branch}`
        + `&username=${query.username}`
        + `&token=${query.token}`
    return httpGet(route);
}

function cloneRepoByCommit(query) {
    const route = ROUTE.GIT_SERVICE.CLONE_REPO_BY_COMMIT + `?url=${query.url}`
        + `&commit=${query.commit}`
        + `&username=${query.username}`
        + `&token=${query.token}`
    return httpGet(route);
}

export const GitServiceAPI = {
    authenticate,
    getUserInfo,
    getAllUserRepos,
    getAllBranchByRepo,
    getAllCommitByRepo,
    compareByBranches,
    compareByCommits,
    cloneRepoByBranch,
    cloneRepoByCommit,
};
