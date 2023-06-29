const VersionCompareUploadTemplate =
    `

    <div class="upload-container container">
        <form action="/workspace/dependency" class="upload-form-data">
                    <h3>Upload your Project</h3>
                    <h6>Compress .zip before upload</h6>
                    <div class="drag-area-container">
                        <div class="old-drag-area">
                            <div class="icon">
                                <i class="fas fa-folder-plus old-icon-upload"></i>
                            </div>
                            <span class="header"
                                ><span class="new-browse">Old Version</span></span
                            >
                            <input class="new-file-upload" type="file" hidden />
                            <span class="support">Support: *.zip</span>
                        </div>
                        <div class="new-drag-area">
                            <div class="icon">
                                <i class="fas fa-folder-plus new-icon-upload"></i>
                            </div>
                            <span class="header"
                                ><span class="old-browse">New Version</span></span
                            >
                            <input class="old-file-upload" type="file" hidden />
                            <span class="support">Support: *.zip</span>
                        </div>
                    </div>
                    <button type="button" class="compare">Upload</button>
                    <button type="button" class="clear-input">Clear Input</button>
                </form>
    </div>
    `

export default VersionCompareUploadTemplate;