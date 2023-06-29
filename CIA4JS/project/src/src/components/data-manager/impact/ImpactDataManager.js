const ImpactDataManager = {
    //API data
    dependencies: [],
    javaNodes: [],
    totalNodes: null,
    changedNodes: [],

    //View data
    changeSet: new Map(),
    impactSet: new Map(),

    clearViewData() {
        this.changeSet = new Map();
        this.impactSet = new Map();
    }
}
export default ImpactDataManager;