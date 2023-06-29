export const UploadFromPCTemplate = `
    <div class="upload-container container">
       <form action="/workspace/dependency" class="upload-form-data">
          <h3>Upload your Project</h3>
          <label for="language">Choose your language's project:</label>
            <select name="language" id="language" class="language">
               <option value="">Choose an option</option>
               <option value="java">Java</option>
               <option value="c#">C#</option>
               <option value="javascript">Javascript</option>
               <option value="nodejs">NodeJS</option>
               <option value="php">PHP</option>
            </select>
            
          <h6>Compress .zip before upload</h6>
          <div class="drag-area">
             <div class="icon">
                <i class="fas fa-folder-plus"></i>
             </div>
             <span class="header"> Drag & Drop </span>
             <span class="header"
                >or <span class="browse">browse</span></span
                >
             <input class="file-upload" type="file" hidden />
             <span class="support">Support: *.zip</span>
          </div>
          <p id="file-name"></p>
          <button type="button" class="upload">Upload</button>
          <button type="button" class="another">Choose another</button>
       </form>
    </div>
`;