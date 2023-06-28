export const FileDetailForm = `
    <div class="form" id="form">
        <div class="form-group">
            <label for="project-name" class="form-label">Project name</label>
            <input type="text" name="" id="" required class="form-input form-input-name">
        </div>

        <div class="form-group">
            <label for="username" class="form-label" >Username</label>
            <input type="text" name="" class="form-input-disabled" disabled="disabled" value="username">
        </div>

        <div class="form-group">
            <label for="version-name" class="form-label">Version</label>
            <input type="text" name="version-name" class="form-input form-input-version" required>
        </div>

        <div class="form-group">
            <label for="file-size" class="form-label">File size</label>
            <input for="file-size" class="file-size-detail" disabled="disabled">
        </div>

        <input type="submit" class="form-submit" value="Submit">
    </div>
`;
