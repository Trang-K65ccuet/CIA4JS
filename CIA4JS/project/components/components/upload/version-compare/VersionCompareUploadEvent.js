import {Notifier} from "../../utils/NotiUltils";
import Utils from "../../utils/BasicUltils";
import {ViewUtils} from "../../utils/ViewUtils";
import {UploadDataManager} from "../UploadDataManager";
import TreeAPI from "../../../api/TreeAPI";
import {IndexedDB} from "../../../indexeddb/IndexedDB";
import CentralViewDataManager from "../../data-manager/central-view/CentralViewDataManager";
import {VIEW_IDS} from "../../d3-components/viewers/view-components/central/CentralViewTabs";
import {router} from "../../../app";
import FromPcSidebarForm from "../from-pc/FromPcSidebarForm";
import VersionCompareForm from "./VersionCompareForm";
import FromPcDataManager from "../from-pc/FromPcDataManager";

const VersionCompareUploadEvent = {
    oldFile : null,
    newFile: null,
    utils: function (db) {
        const oldDragArea = document.querySelector(".old-drag-area");
        const newDragArea = document.querySelector(".new-drag-area");
        const dragText = document.querySelector(".header");
        const oldBrowseHTML = `<div class="icon">
								<i class="fas fa-folder-plus"></i>
								</div>
								<span class="header"
									><span class="new-browse">Old Version</span></span
								>
								<input class="new-file-upload" type="file" hidden />
								<span class="support">Support: *.zip</span>`;
        const newBrowseHTML = `<div class="icon">
								<i class="fas fa-folder-plus"></i>
								</div>
								<span class="header"
									><span class="old-browse">New Version</span></span
								>
								<input class="old-file-upload" type="file" hidden />
								<span class="support">Support: *.zip</span>`;

        let oldFileBrowse = document.querySelector(".new-browse");
        let newFileBrowse = document.querySelector(".old-browse");
        let oldInput = document.querySelector(".old-file-upload");
        let newInput = document.querySelector(".new-file-upload");
        let clearInput = document.querySelector(".clear-input");

        clearInput.onclick = () => {
            oldDragArea.classList.remove("active");
            newDragArea.classList.remove("active");
            oldDragArea.innerHTML = oldBrowseHTML;
            newDragArea.innerHTML = newBrowseHTML;

            let oldFileBrowse = document.querySelector(".new-browse");
            let newFileBrowse = document.querySelector(".old-browse");
            let oldInput = document.querySelector(".old-file-upload");
            let newInput = document.querySelector(".new-file-upload");
            let clearInput = document.querySelector(".clear-input");

            oldFileBrowse.onclick = () => {
                oldInput.click();
            };

            newFileBrowse.onclick = () => {
                newInput.click();
            };

            if (VersionCompareUploadEvent.oldFile === undefined) {
                let uploadBtn = document.querySelector(".compare");
                uploadBtn.onclick = (event) => {
                    Notifier.displayError("You need to choose project first!");
                    event.preventDefault();
                };
            }

            oldInput.addEventListener("change", function () {
                VersionCompareUploadEvent.oldFile = this.files[0];
                // // console.log({ VersionCompareUploadEvent.oldFile });
                document.querySelector(".compare").onclick = () => {};
                oldDragArea.classList.add("active");
                oldDisplayFile();
            });

            newInput.addEventListener("change", function () {
                VersionCompareUploadEvent.newFile = this.files[0];
                // // console.log({ VersionCompareUploadEvent.newFile });
                document.querySelector(".compare").onclick = () => {};
                newDragArea.classList.add("active");
                newDisplayFile();
            });

            //when file is in drag area
            oldDragArea.addEventListener("dragover", (event) => {
                event.preventDefault();
                dragText.textContent = "Release to Upload";
                oldDragArea.classList.add("active");
            });

            oldDragArea.addEventListener("dragleave", () => {
                dragText.textContent = "Drag & Drop";
                oldDragArea.classList.remove("active");
            });

            oldDragArea.addEventListener("drop", (event) => {
                event.preventDefault();
                VersionCompareUploadEvent.oldFile = event.dataTransfer.files[0];
                document.querySelector(".compare").onclick = () => {};
                oldDisplayFile();
            });

            //when file is in drag area
            newDragArea.addEventListener("dragover", (event) => {
                event.preventDefault();
                dragText.textContent = "Release to Upload";
                newDragArea.classList.add("active");
            });

            newDragArea.addEventListener("dragleave", () => {
                dragText.textContent = "Drag & Drop";
                newDragArea.classList.remove("active");
            });

            newDragArea.addEventListener("drop", (event) => {
                event.preventDefault();
                VersionCompareUploadEvent.newFile = event.dataTransfer.files[0];
                document.querySelector(".compare").onclick = () => {};
                newDisplayFile();
            });

            function oldDisplayFile() {
                let fileType = VersionCompareUploadEvent.oldFile.type;
                let validExpressions = [
                    "application/zip",
                    "application/x-zip-compressed",
                    "multipart/x-zip",
                ];
                if (validExpressions.includes(fileType)) {
                    let fileReader = new FileReader();

                    fileReader.onload = () => {
                        let imgTag = `<img src="https://cdn-icons-png.flaticon.com/512/2818/2818715.png"/>`;
                        oldDragArea.innerHTML = imgTag;
                        const oldFileNameTag = `<p class="old-file-name"></p>`;
                        const oldFileNameTagDOM = Utils.createElementFromHTML(oldFileNameTag);
                        oldDragArea.appendChild(oldFileNameTagDOM);
                        document.querySelector(".old-file-name").innerHTML =
                            `<span class="remove"><i class="fas fa-folder"></i></span> ` +
                            VersionCompareUploadEvent.oldFile.name;
                    };

                    fileReader.readAsDataURL(VersionCompareUploadEvent.oldFile);
                } else {
                    Notifier.displayError("File must be in .zip format");
                    oldDragArea.classList.remove("active");
                }
            }

            function newDisplayFile() {
                let fileType = VersionCompareUploadEvent.newFile.type;
                let validExpressions = [
                    "application/zip",
                    "application/x-zip-compressed",
                    "multipart/x-zip",
                ];
                if (validExpressions.includes(fileType)) {
                    let fileReader = new FileReader();

                    fileReader.onload = () => {
                        let imgTag = `<img src="https://cdn-icons-png.flaticon.com/512/2818/2818715.png"/>`;
                        newDragArea.innerHTML = imgTag;
                        const newFileNameTag = `<p class="new-file-name"></p>`;
                        const newFileNameTagDOM = Utils.createElementFromHTML(newFileNameTag);
                        newDragArea.appendChild(newFileNameTagDOM);
                        document.querySelector(".new-file-name").innerHTML =
                            `<span class="remove"><i class="fas fa-folder"></i></span> ` +
                            VersionCompareUploadEvent.newFile.name;
                    };

                    fileReader.readAsDataURL(VersionCompareUploadEvent.newFile);
                } else {
                    Notifier.displayError("File must be in .zip format");
                    newDragArea.classList.remove("active");
                }
            }
        };

        let handleAction = function () {
            oldFileBrowse.onclick = () => {
                oldInput.click();
            };

            newFileBrowse.onclick = () => {
                newInput.click();
            };

            if (VersionCompareUploadEvent.oldFile === undefined) {
                let uploadBtn = document.querySelector(".compare");
                uploadBtn.onclick = (event) => {
                    Notifier.displayError("You need to choose project first!");
                    event.preventDefault();
                };
            }

            oldInput.addEventListener("change", function () {
                VersionCompareUploadEvent.oldFile = this.files[0];
                // // console.log({ VersionCompareUploadEvent.oldFile });
                document.querySelector(".compare").onclick = () => {};
                oldDragArea.classList.add("active");
                oldDisplayFile();
            });

            newInput.addEventListener("change", function () {
                VersionCompareUploadEvent.newFile = this.files[0];
                // // console.log({ VersionCompareUploadEvent.newFile });
                document.querySelector(".compare").onclick = () => {};
                newDragArea.classList.add("active");
                newDisplayFile();
            });

            //when file is in drag area
            oldDragArea.addEventListener("dragover", (event) => {
                event.preventDefault();
                dragText.textContent = "Release to Upload";
                oldDragArea.classList.add("active");
            });

            oldDragArea.addEventListener("dragleave", () => {
                dragText.textContent = "Drag & Drop";
                oldDragArea.classList.remove("active");
            });

            oldDragArea.addEventListener("drop", (event) => {
                event.preventDefault();
                VersionCompareUploadEvent.oldFile = event.dataTransfer.files[0];
                document.querySelector(".compare").onclick = () => {};
                oldDisplayFile();
            });

            //when file is in drag area
            newDragArea.addEventListener("dragover", (event) => {
                event.preventDefault();
                dragText.textContent = "Release to Upload";
                newDragArea.classList.add("active");
            });

            newDragArea.addEventListener("dragleave", () => {
                dragText.textContent = "Drag & Drop";
                newDragArea.classList.remove("active");
            });

            newDragArea.addEventListener("drop", (event) => {
                event.preventDefault();
                VersionCompareUploadEvent.newFile = event.dataTransfer.files[0];
                document.querySelector(".compare").onclick = () => {};
                newDisplayFile();
            });

            function oldDisplayFile() {
                let fileType = VersionCompareUploadEvent.oldFile.type;
                let validExpressions = [
                    "application/zip",
                    "application/x-zip-compressed",
                    "multipart/x-zip",
                ];
                if (validExpressions.includes(fileType)) {
                    let fileReader = new FileReader();

                    fileReader.onload = () => {
                        let imgTag = `<img src="https://cdn-icons-png.flaticon.com/512/2818/2818715.png"/>`;
                        oldDragArea.innerHTML = imgTag;
                        const oldFileNameTag = `<p class="old-file-name"></p>`;
                        const oldFileNameTagDOM = Utils.createElementFromHTML(oldFileNameTag);
                        oldDragArea.appendChild(oldFileNameTagDOM);
                        document.querySelector(".old-file-name").innerHTML =
                            `<span class="remove"><i class="fas fa-folder"></i></span> ` +
                            VersionCompareUploadEvent.oldFile.name;
                    };

                    fileReader.readAsDataURL(VersionCompareUploadEvent.oldFile);
                } else {
                    Notifier.displayError("File must be in .zip format");
                    oldDragArea.classList.remove("active");
                }
            }

            function newDisplayFile() {
                let fileType = VersionCompareUploadEvent.newFile.type;
                let validExpressions = [
                    "application/zip",
                    "application/x-zip-compressed",
                    "multipart/x-zip",
                ];
                if (validExpressions.includes(fileType)) {
                    let fileReader = new FileReader();

                    fileReader.onload = () => {
                        let imgTag = `<img src="https://cdn-icons-png.flaticon.com/512/2818/2818715.png"/>`;
                        newDragArea.innerHTML = imgTag;
                        const newFileNameTag = `<p class="new-file-name"></p>`;
                        const newFileNameTagDOM = Utils.createElementFromHTML(newFileNameTag);
                        newDragArea.appendChild(newFileNameTagDOM);
                        document.querySelector(".new-file-name").innerHTML =
                            `<span class="remove"><i class="fas fa-folder"></i></span> ` +
                            VersionCompareUploadEvent.newFile.name;
                    };

                    fileReader.readAsDataURL(VersionCompareUploadEvent.newFile);
                } else {
                    Notifier.displayError("File must be in .zip format");
                    newDragArea.classList.remove("active");
                }
            }
        };
        handleAction();

        //Map API to version-compare-api
        $(".compare").on("click", function (e) {
            if (VersionCompareUploadEvent.oldFile !== undefined && VersionCompareUploadEvent.newFile !== undefined) {
                ViewUtils.createLoading();
                let form = new FormData();
                form.append("files", VersionCompareUploadEvent.oldFile, VersionCompareUploadEvent.oldFile.name);
                form.append("files", VersionCompareUploadEvent.newFile, VersionCompareUploadEvent.newFile.name);

                TreeAPI.compare(form).then((d) => {
                    // // console.log(d);
                    IndexedDB.getRecord(db, 'version-compare').then(
                        result => {
                            if(result === undefined)
                                IndexedDB
                                    .insertRecord(db, d, 'version-compare')
                                    .then(() => {
                                        CentralViewDataManager.viewMode = VIEW_IDS.VERSION_COMPARE_ID;
                                        // console.log(d)
                                        router.navigate("workspace/dependency");
                                    });
                            else
                                IndexedDB
                                    .updateRecord(db, d, 'version-compare')
                                    .then(()=> {
                                        CentralViewDataManager.viewMode = VIEW_IDS.VERSION_COMPARE_ID;
                                        // console.log(d)
                                        router.navigate("workspace/dependency");
                                    });
                        }
                    );
                })
            }
        });
    },
    displaySideBarForm() {
        const fromPcSideBar = Utils.createElementFromHTML(
            VersionCompareForm.createTemplate()
        );

        Utils.emptyContentDiv(["#sidebar-content"]);

        let sideBarContentDiv = document.querySelector("#sidebar-content");
        if (sideBarContentDiv) {
            sideBarContentDiv.append(fromPcSideBar);
        } else {
            // console.log("sidebar-content not found!")
        }
    },
    addSideBarMenuHeaderEvent() {
        const menuOptions = document.querySelectorAll("#sidebar .upload-header-menu-option");

        if (menuOptions !== null) {
            menuOptions.forEach(option => {
                option.addEventListener("click", handleOnclick);
            });
        }

        function handleOnclick(e) {
            e.preventDefault();

            let options = document.querySelectorAll(".upload-header-menu-option");

            options.forEach(o => {
                if(o.classList.contains("selected-box-shadow-white")) {
                    o.classList.remove("selected-box-shadow-white");
                }
            })
            this.classList.add("selected-box-shadow-white");


            switch (this.id) {
                case "vc-new-proj-form":
                    FromPcDataManager.isNewVersionMode = false;
                    FromPcFormEvent.addNewProjForm();
                    FromPcFormEvent.addEventProjectAndVersionNameInput();
                    break;
                case "vc-new-ver-form":
                    FromPcDataManager.isNewVersionMode = true;
                    FromPcFormEvent.addNewVerForm();
                    FromPcFormEvent.addEventProjectAndVersionNameInput();
                    break;
            }
        }
    },
}

export default VersionCompareUploadEvent;