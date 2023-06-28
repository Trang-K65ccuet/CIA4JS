const SideBarDVProjectInfoTemplate = {
    createTemplate(project) {
        let projectName;
        if (project) {
            projectName = project
        } else {
            projectName = "Select a project"
        }
        // // console.log(projectName)

        return `
        <div id="sidebar-dv-project-info">
          <div class="input-group mb-3">
            <span class="input-group-text" id="git-project">Project name</span>
            <input id="git-version1" type="text" class="form-control" placeholder="${projectName}" aria-label="Git url" aria-describedby="git-version1" disabled>
          </div>
        </div>
        `;
    }
};



export default SideBarDVProjectInfoTemplate;