import {GitServiceData} from "./GitServiceData";
import {GitServiceAPI} from "../../../api/GitServiceAPI";
import {Notifier} from "../../utils/NotiUltils";

function updateAccessToken(token) {
    GitServiceData.access_token = token;
}

function authenticate() {
    GitServiceAPI.authenticate();
}

function updateUser(user) {
    GitServiceData.user = user;
    // // console.log(GitServiceData.user)
}

function checkIfAccessTokenExisted() {
    return GitServiceData.access_token !== null;
}

function getUserInfo() {
    if (checkIfAccessTokenExisted()) {
        if (GitServiceData.user !== null) {
            return GitServiceData.user;
        } else {
            Notifier.displayError("User not exited");
            return null;
        }
    }
}

function updateUserInfoFromAPI() {
    return GitServiceAPI.getUserInfo().then(d => {
        // console.log(d);
        updateUser(d);

    }).catch(error => {
        Notifier.displayError(error);
    });
}


function updateUserRepos() {
    return GitServiceAPI.getAllUserRepos().then(res => {
        if (res.length > 0) {
            GitServiceData.userRepos = res;
        } else {
            Notifier.displayError("User has no repository")
        }
    }).catch(error => {
        Notifier.displayError(error);
    });
}

function emptyUserRepos() {
    GitServiceData.userRepos = [];
}

function getBranchesByRepo(repoName) {
    return GitServiceAPI.getAllBranchByRepo(repoName);
}

function getCommitsByRepo(repoName) {
    return GitServiceAPI.getAllCommitByRepo(repoName);
}

export const GitDataManager = {
    //token
    authenticate,
    updateAccessToken,
    checkIfAccessTokenExisted,

    //user
    updateUserInfoFromAPI,
    getUserInfo,
    emptyUserRepos,
    updateUserRepos,

    //branches
    getBranchesByRepo,
    getCommitsByRepo,
}