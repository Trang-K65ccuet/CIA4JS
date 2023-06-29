const GitDataManager = {
    username: "ducduongn",
    token: null,
    repoUrl: "",

    language: null,
    isVersionCompare: true,

    branchesList: [],
    commitList: [],

    //Dependency metadata
    dependencyViewMetaData: {
      name: null,
      type: null
    },

    setLanguage(languageInput) {
        GitDataManager.language = languageInput;
    },

    setDependencyViewMetaData(name, type) {
        GitDataManager.dependencyViewMetaData.name = name;
        GitDataManager.dependencyViewMetaData.type = type
    },

    emptyDependencyViewMetaData() {
        this.dependencyViewMetaData.name = null;
        this.dependencyViewMetaData.type = null;
    },
    //Version compare metadata
    versionCompareMetaData: {
        version1: {
            name: null,
            type: null,
        },
        version2: {
            name: null,
            type: null
        }
    },

    clearBranchListData() {
        this.branchesList = [];
    },

    clearCommitListData() {
        this.commitList = [];
    },

    clearVersionCompareMetaData() {
        this.versionCompareMetaData.version1.name = null;
        this.versionCompareMetaData.version1.type = null;

        this.versionCompareMetaData.version2.name = null;
        this.versionCompareMetaData.version2.type = null;
    },

    setVersion1(name, type) {
        let version2Type = this.versionCompareMetaData.version2.type;
        let isSuccess = true;

        if (version2Type !== null) {
            if (type === version2Type) {
                this.versionCompareMetaData.version1.name = name;
                this.versionCompareMetaData.version1.type = type;
            } else {
                isSuccess = false;
            }
        } else {
            this.versionCompareMetaData.version1.name = name;
            this.versionCompareMetaData.version1.type = type;
        }
        return isSuccess;
    },

    setVersion2(name, type) {
        let version1Type = this.versionCompareMetaData.version1.type;
        let isSuccess = true;

        if (version1Type !== null) {
            if (type === version1Type) {
                this.versionCompareMetaData.version2.name = name;
                this.versionCompareMetaData.version2.type = type;
            } else {
                isSuccess = false;
            }
        } else {
            this.versionCompareMetaData.version2.name = name;
            this.versionCompareMetaData.version2.type = type;
        }
        return isSuccess;
    },
}
export default GitDataManager;