import VIEW_CONFIG_VARIABLES from "../../config/ViewConfig";

export class ProjectViewTemplate {

    constructor(data, view){

        // init view
        this.view = view;
        this.view.style("font-size",VIEW_CONFIG_VARIABLES.PROJECT_VIEW_CONFIG.FONT_SIZE);
        this.view.selectAll("g").remove();

    }

}