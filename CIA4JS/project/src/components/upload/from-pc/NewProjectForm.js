const NewProjectForm = {
    createTemplate(project) {
        let projectName
        if (project) {
            projectName = project.name;
        } else {
            projectName = "New project";
        }
        return `
        <form id="frompc-new-proj-form" class="row g-3 needs-validation" novalidate>
          <div class="input-group mb-3 has-validation">
            <span class="input-group-text" id="inputGroupProj">Project name</span>
            <input id="frompc-proj" type="text" class="form-control" placeholder="${projectName}" aria-describedby="inputGroupProj" required>
            <div class="invalid-feedback" style="text-align: center">
               Project is already existed!
            </div>
          </div>
          <div class="input-group mb-3 has-validation">
            <span class="input-group-text" id="inputGroupVer">Version name</span>
            <input value="v1.0" id="frompc-ver" type="text" class="form-control" aria-describedby="inputGroupVer" disabled>
          </div>
          <div class="input-group mb-3 has-validation">
            <span class="input-group-text" id="inputProjectType">Project type</span>
            <select name="type" id="type" class="form-control">
              <option value="cia">CIA</option>
              <option value="test">Unit Testing</option>
            </select>
          </div>
        </form>
        `;
    }
}

export default NewProjectForm;