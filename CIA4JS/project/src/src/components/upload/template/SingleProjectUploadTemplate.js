export const SingleProjectUploadTemplate = `
<div class="single-upload-wrapper">
  <nav id="sidebar" style="text-align: center">
    <div class="sidebar-header">
      <h3>Project information</h3>
    </div>
    <div id="sidebar-content" class="px-4 pt-3"></div>
  </nav>
  <div class="upload-page-content">
    <div class="upload-page-header pt-3">
      <div class="upload-page-header-title mb-3 px-4">
        <h2>
          <button type="button" id="sidebarCollapse" class="btn btn-info">
            <i class="fas fa-align-left"></i>
          </button> Upload single project
        </h2>
      </div>
      <nav class="upload-page-header-menu mb-2 px-3">
        <div id="pc-upload-form" class="upload-header-menu-option selected-box-shadow">
          <div class="upload-menu-item">From computer</div>
        </div>
        <div id="github-upload-form" class="upload-header-menu-option">
          <div class="upload-menu-item">From source control</div>
        </div>
<!--        <div id="version-compare-upload-form" class="upload-header-menu-option">-->
<!--          <div class="upload-menu-item">Version compare</div>-->
<!--        </div>-->
      </nav>
    </div>
    <div class="upload-page-container"></div>
    <div class="modal fade" id="tokenModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="tokenModalTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="tokenModalTitle">Git user token</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form id="token-form" class="row g-3 needs-validation" novalidate>
              <div class="input-group has-validation">
                <span class="input-group-text" id="tokenInputSpan">Git user token</span>
                <input id="tokenInput" type="text" class="form-control" placeholder="Fill your input token" required>
                <div class="invalid-feedback" style="text-align: center"> Token can not be empty. </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" id="token-close-btn" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" id="token-submit-btn" class="btn btn-primary">Save changes</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
`;