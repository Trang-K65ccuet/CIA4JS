import GitDataManager from "./GitDataManager";

const SideBarVCProjectInfoTemplate = {

    createTemplate(version1, version2) {
        let versionTem1, versionTem2;

        if (version1) {
            versionTem1 = version1;
        } else {
            versionTem1 = "Old version";
        }

        if (version2) {
            versionTem2 = version2;
        } else {
            versionTem2 = "New version";
        }

        return `
        <div id="sidebar-vc-project-info">
          <div class="input-group mb-3">
            <span class="input-group-text" id="git-version1">Old version</span>
            <input id="git-version1" type="text" class="form-control" placeholder="${versionTem1}" aria-label="Git url" aria-describedby="git-version1" disabled>
          </div>
          <div class="input-group mb-3">
            <span class="input-group-text" id="git-version2">New version</span>
            <input id="git-version2" type="text" class="form-control" placeholder="${versionTem2}" aria-label="Git url" aria-describedby="git-version2" disabled>
          </div>
        </div>
        `;
    }
}

export default SideBarVCProjectInfoTemplate;