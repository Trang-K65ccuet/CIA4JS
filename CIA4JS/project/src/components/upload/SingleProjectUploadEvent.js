import {UploadDataManager} from "./UploadDataManager";
import {SingleProjectUpload} from "./SingleProjectUpload";
import GitDataManager from "./from-source-code/GitDataManager";
import {IndexedDB} from "../../indexeddb/IndexedDB";
import {db} from "../../app";

export const SingleProjectUploadEvent = {
    addMenuHeaderEvent: function () {
        const menuOptions = document.querySelectorAll(".upload-page-content .upload-header-menu-option");

        $('#sidebarCollapse').on('click', function () {
            $('#sidebar').toggleClass('active');
        });

        if (menuOptions !== null) {
            menuOptions.forEach(option => {
                option.addEventListener("click", handleOnclick);
            });
        }

        function handleOnclick(e) {
            e.preventDefault();

            let options = document.querySelectorAll(".upload-header-menu-option");

            options.forEach(o => {
                if(o.classList.contains("selected-box-shadow")) {
                    o.classList.remove("selected-box-shadow");
                }
            })
            this.classList.add("selected-box-shadow");

            let uploadForm = UploadDataManager.getSingleProjectUpload();

            switch (this.id) {
                case "pc-upload-form":
                    uploadForm.setViewId("pc");
                    break;
                case "github-upload-form":
                    uploadForm.setViewId("github");
                    break;
                case "version-compare-upload-form":
                    uploadForm.setViewId("vc");
                    break;

            }
            uploadForm.createForm();
        }
    },
    addGitTokenModalEvent() {
        //Add event for close btn
        let tokenForm = document.getElementById('token-form');
        let gitCloseModalBtn = document.getElementById('token-close-btn');

        if (gitCloseModalBtn) {
            gitCloseModalBtn.addEventListener("click", (e) => {
                if (tokenForm.classList.contains("was-validated")) {
                    tokenForm.classList.remove("was-validated");
                }
                $('#tokenModal').modal('hide');
            })
        }
        //Add event for submit btn
        let gitSubmitBtn = document.getElementById('token-submit-btn');
        if (gitSubmitBtn) {
            gitSubmitBtn.addEventListener("click", (e) => {
                let inputValue = document.getElementById('tokenInput').value;

                if (inputValue !== "") {
                    IndexedDB.getRecord(db, 'git-token').then(
                        result => {
                            if (result === undefined)
                                IndexedDB
                                    .insertRecord(db, inputValue, 'git-token')
                                    .then(() => {
                                        $('#tokenModal').modal('hide');
                                    });
                            else
                                IndexedDB
                                    .updateRecord(db, inputValue, 'git-token')
                                    .then(() => {
                                        $('#tokenModal').modal('hide');
                                    });
                        }
                    );
                } else {
                    tokenForm.classList.add("was-validated");
                }
            })
        }
    }
}