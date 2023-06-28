const FromPcSidebarForm = {
    createTemplate() {
        return `
        <div class="h-100">
          <nav class="upload-page-header-menu mb-2 px-3">
            <div id="new-proj-form" class="upload-header-menu-option selected-box-shadow-white">
              <div class="upload-menu-item-small">Upload new project</div>
            </div>
            <div id="new-ver-form"" class="upload-header-menu-option">
              <div class="upload-menu-item-small">Upload new version</div>
            </div>
          </nav>
          <div id="sideBarProjectInfo"></div>
        </div>
        `;
    }
};

export default FromPcSidebarForm;