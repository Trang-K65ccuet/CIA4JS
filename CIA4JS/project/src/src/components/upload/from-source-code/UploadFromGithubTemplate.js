import GitDataManager from "./GitDataManager";

export const UploadFromGithubTemplate = `
<div class="upload-page-content-container" id="demo1Box">
  <div class="git-repo-content">
    <div class="git-input-fields">
    </div>
    <div class="git-repo-content-box mt-3 mb-3">
      <div class="git-repo-box-header">
        <div class="list-group flex-column">
            Git branches
        </div>
        <div class="list-group flex-column">
            Git commit
        </div>
      </div>
      <div class="git-repo-box-content">
        <div class="list-group flex-column"  id="git-branch-col">
            ${(Array.isArray(GitDataManager.branchesList) 
                && GitDataManager.branchesList.length > 0) ? "" : "No branch"}
        </div>
        <div class="list-group flex-column"  id="git-commits-col">
            ${(Array.isArray(GitDataManager.commitList)
                && GitDataManager.commitList.length > 0) ? "" : "No commit"}
        </div>
      </div>
    </div>
  </div>
</div>
`;