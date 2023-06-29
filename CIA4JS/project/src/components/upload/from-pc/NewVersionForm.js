import FromPcDataManager from "./FromPcDataManager";
import {UploadDataManager} from "../UploadDataManager";


const NewVersionForm = {
    createTemplate(project) {
        let projectName, versionName;
        if (project) {
            projectName = project.name;
            versionName = project.version;
        } else {
            projectName = "New project";
            versionName = "v1.0";
        }
        let template = `
            <form class="row g-3 needs-validation" novalidate>
                <div class="input-group mb-3 has-validation">
                    <span class="input-group-text" id="inputGroupProj">Project name</span>
                    <select class="form-select" id="frompc-proj" aria-describedby="inputGroupProj" required>
                      <option selected disabled>Select a project</option>
                    </select>
                </div>
                <div class="input-group mb-3 has-validation">
                    <span class="input-group-text" id="inputGroupVer">Version name</span>
                    <input value="v1.0" id="frompc-ver" type="text" class="form-control" placeholder="${versionName}" aria-describedby="inputGroupVer">
                    <div class="invalid-feedback"> Version name has already existed in Project Name.</div>
                  </div>
                </div>
            </form>
        `;

        return template;
    }
}

export default NewVersionForm;