import VIEW_CONFIG_VARIABLES from '../../config/ViewConfig';
import Line from '../Line';

export class Link extends Line {
    constructor(source, destination, typeDependency, innerDependency) {
        super(source, destination);
        this.weight = JSON.parse(JSON.stringify(typeDependency));
        this.updateLine();
        this.innerDependencies = [innerDependency];
    }

    updateLine() {
        super.updateLine(VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.PADDING_NODE);
    }

    updateWeight(typeDependency) {
        this.weight.inheritance += typeDependency.inheritance;
        this.weight.member += typeDependency.member;
        this.weight.invocation += typeDependency.invocation;
        this.weight.use += typeDependency.use;
        this.weight.override += typeDependency.override;
        this.weight.spring += typeDependency.spring;
        this.weight.jsf += typeDependency.jsf;
        // // console.log(this)
    }

    updateInnerDependencies(innerDependency) {
        this.innerDependencies.push(innerDependency);
    }
}