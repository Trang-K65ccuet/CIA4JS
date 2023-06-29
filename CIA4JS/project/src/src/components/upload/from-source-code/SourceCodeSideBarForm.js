import GitDataManager from "./GitDataManager";

const SourceCodeSideBarForm = {
    createTemplate() {
        let gitUrlValue = GitDataManager.repoUrl;

        return `
            <div class="h-100">
              <form id="git-form" class="mb-3">
                <div class="input-group">
                  <button class="input-group-text" id="git-url-group"><i class="fas fa-search"></i></button>
                  <input id="github-url" value="${gitUrlValue ? gitUrlValue : ''}" type="text" class="form-control" placeholder="Git url" aria-label="Git url" aria-describedby="git-url-group">
                </div>
              </form>

              <div class="choose-language">
                <label for="language">Choose language's project:</label>
                <select name="language" id="language" class="language">
                  <option value="">Choose an option</option>
                  <option value="java">Java</option>
                  <option value="c#">C#</option>
                  <option value="javascript">Javascript</option>
                  <option value="nodejs">NodeJS</option>
                  <option value="php">PHP</option>
                </select>
              </div>

              <div class="form-check form-switch version-compare-check">
                <input class="form-check-input" type="checkbox" id="isVersionCompare">
                <label class="form-check-label" for="isVersionCompare">Version compare mode</label>
              </div>
              <div id="sideBarProjectInfo">
                
              </div>
              <div class="container bottom-0 submit-sidebar">
              <form action="/workspace/dependency" >
                <button class="btn btn-lg btn-primary" id="submit-source-control">Submit</button>
                </form>
              </div>
            </div>
            `;
    }
}

export default SourceCodeSideBarForm;