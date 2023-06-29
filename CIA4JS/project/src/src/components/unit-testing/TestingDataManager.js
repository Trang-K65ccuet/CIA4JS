export const TestingDataManager = {
    projectList: [],
    validator: {
        isProjectExisted: false,
    },

    unitTesting: null,
    getUnitTesting() {
        return this.unitTesting;
    },
    setUnitTesting(obj) {
        this.unitTesting = obj;
    },
    emptyUnitTesting() {
        this.unitTesting = null;
    },

    projectName: null,
    language: null,
    fileSize: null
}