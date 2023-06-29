import {SingleProjectUpload} from "./SingleProjectUpload";

export const UploadDataManager = {
    //Single project upload data manager
    projectList: [],
    validator: {
        isProjectExisted: false,
        isVersionExisted: false
    },

    singleProjectUpload: null,
    getSingleProjectUpload() {
      return this.singleProjectUpload;
    },
    setSingleProjectUpload(obj) {
        this.singleProjectUpload = obj;
    },
    emptySingleProjectUpload() {
        this.singleProjectUpload = null;
    },

    dependencyGraphTree: null,
    getDependencyGraphTree() {
        return this.dependencyGraphTree;
    },
    setDependencyGraphTree(obj) {
        this.dependencyGraphTree = obj;
    },
    emptyDependencyGraphTree() {
        this.dependencyGraphTree = null;
    },

    //VersionCompare
    versionCompareTree: null,
    getVersionCompareTree() {
        return this.versionCompareTree;
    },
    setVersionCompareTree(obj) {
        this.versionCompareTree = obj;
    },
    emptyVersionCompareTree() {
        this.versionCompareTree = null;
    },

    //Github data manager
    githubRepoUrl: null,
    getGitHubRepoUrl() {
        return this.getGitHubRepoUrl();
    },
    setGitHubRepoUrl(obj) {
        this.githubRepoUrl = obj;
    },
    emptyGitHubRepoUrl() {
      this.githubRepoUrl = null;
    },

    githubGitToken: null,
    getGithubRepoToken() {
        return this.githubGitToken;
    },
    setGithubRepoToken(obj) {
        this.githubGitToken = obj;
    },
    emptyGithubRepoToken() {
        this.githubGitToken = null;
    },

    //Github mode
    gitHubRepoMode: "branch",
    getGithubMode() {
      return this.gitHubRepoMode;
    },
    switchGithubModeToBranch() {
        this.gitHubRepoMode = "get-branch";
    },
    switchGithubModeToCommit() {
        this.gitHubRepoMode = "get-commit";
    },

    //
    projectName: null,
    language: null,
    versionName: null,
    fileSize: null,
}