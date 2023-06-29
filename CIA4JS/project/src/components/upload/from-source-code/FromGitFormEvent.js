import {GitServiceAPI} from "../../../api/GitServiceAPI";
import GitDataManager from "./GitDataManager";

import {DOMUtils} from "../../utils/DOMUtils";
import Utils from "../../utils/BasicUltils";
import Spinner from "../../common/spinner/Spinner";
import SourceCodeSideBarForm from "./SourceCodeSideBarForm";
import {UploadDataManager} from "../UploadDataManager";
import {IndexedDB} from "../../../indexeddb/IndexedDB";
import CentralViewDataManager from "../../data-manager/central-view/CentralViewDataManager";
import {VIEW_IDS} from "../../d3-components/viewers/view-components/central/CentralViewTabs";
import {db, router} from "../../../app";
import {ViewUtils} from "../../utils/ViewUtils";
import ContextMenuOption from "../../context-menu/ContextMenuOption";
import SideBarVCProjectInfoTemplate from "./SideBarVCProjectInfoTemplate";
import SideBarDVProjectInfoTemplate from "./SideBarDVProjectInfoTemplate";
import ProjectParserAPI from "../../../api/ProjectParserAPI";
import ToastTemplate from "../../common/toast/ToastTemplate";
import Message from "../../../config/message";

const FromGitFormEvent = {
    addGitFormEventListener() {
        let isVersionCompareCheck = document.querySelector("#isVersionCompare");
        GitDataManager.isVersionCompare = false;

        let languageForm = document.querySelector("#language");
        console.log("language: " + languageForm);

        if (isVersionCompareCheck) {
            isVersionCompareCheck.addEventListener("change", (e) => {
                // console.log(GitDataManager.isVersionCompare)
                GitDataManager.isVersionCompare = isVersionCompareCheck.checked;
                Utils.emptyContentDiv(["#git-branch-col"]);
                Utils.emptyContentDiv(['#git-commits-col']);
                $.contextMenu('destroy');
                FromGitFormEvent.addEventGitBranchItem(GitDataManager.branchesList);
                FromGitFormEvent.addEventGitCommitItem(GitDataManager.commitList);

                // // console.log(GitDataManager.isVersionCompare)
                this.rerenderProjectMetaData();
            })

            $.contextMenu('destroy');
            GitDataManager.isVersionCompare = isVersionCompareCheck.checked;
            FromGitFormEvent.addEventGitBranchItem(GitDataManager.branchesList);
            FromGitFormEvent.addEventGitCommitItem(GitDataManager.commitList);
            this.rerenderProjectMetaData();
        }

        let gitForm = document.querySelector("#git-form");


        if (gitForm) {
            gitForm.addEventListener("submit", (e) => {
                e.preventDefault();

                IndexedDB.getRecord(db, 'git-token').then(
                    d => {
                        // // console.log(d)
                        if(d){
                           GitDataManager.token = d;
                        } else {
                            GitDataManager.token = "";
                        }
                        let urlInput = document.querySelector("#github-url");

                        let gitBranchCol = document.querySelector("#git-branch-col");

                        Utils.emptyContentDiv(["#git-branch-col"]);
                        Utils.emptyContentDiv(["#git-commits-col"]);


                        GitDataManager.repoUrl = urlInput.value

                        //Clear data
                        GitDataManager.clearBranchListData();
                        GitDataManager.clearCommitListData();
                        GitDataManager.clearVersionCompareMetaData();

                        let query = {
                            url: GitDataManager.repoUrl,
                            username: GitDataManager.username,
                            token: GitDataManager.token
                        }
                        // // console.log(query);
                        // console.log(GitServiceAPI.getAllBranchByRepo(query))

                        // .includes(".git")
                        if (GitDataManager.repoUrl.includes(".git")) {
                            gitBranchCol.appendChild(DOMUtils.createElementFromHTML(Spinner.createSpinner("git-branch-col")));
                            GitServiceAPI.getAllBranchByRepo(query)
                                .then(res => {
                                    if (res) {
                                        Spinner.removeSpinner("git-branch-col");

                                        GitDataManager.branchesList = res.shortName;
                                        this.addEventGitBranchItem(GitDataManager.branchesList);
                                    }
                                })
                                .catch(error => {
                                    if (error.response) {
                                        // console.log(error.response);
                                        if (error.response.status == '401') {
                                            $('#tokenModal').modal('show');
                                        }
                                        Spinner.removeSpinner("git-branch-col");
                                    }
                                })
                        } else {
                            ToastTemplate.emptyToast();
                            ToastTemplate.addToast(
                                "Git url repository is not correct",
                                "Please correct git repository URL");

                            ToastTemplate.showToast();
                        }
                    }
                )
            });
        } else {
            // console.log("GitForm not found!")
        }
    },

    submitSourceControl() {
        let submitBtn = document.querySelector("#submit-source-control");

        if (submitBtn) {
            submitBtn.addEventListener("click", (e) => {
                e.preventDefault();
                $.contextMenu('destroy');

                // GitDataManager.clearVersionCompareMetaData();

                if (GitDataManager.isVersionCompare) {
                    this.handleSubmitVc();
                } else {
                    this.handleSubmitDv();
                }
            })
        }
    },

    handleSubmitDv() {
        IndexedDB.getRecord(db, 'git-token').then( d => {
            if (d) {
                GitDataManager.token = d;
            }
            else {
                GitDataManager.token = "";
            }
            let typeProj = GitDataManager.dependencyViewMetaData.type;
            let query;
            Utils.emptyContentDiv(["#git-branch-col"]);
            Utils.emptyContentDiv(["#git-commits-col"]);

            let languageInput = document.querySelector("#language").value;
            localStorage.setItem('language', languageInput);
            console.log("input", languageInput);
            GitDataManager.setLanguage(languageInput);

            if (typeProj === "branch") {
                query = {
                    url: GitDataManager.repoUrl,
                    token: GitDataManager.token,
                    username: GitDataManager.username,
                    branch: GitDataManager.dependencyViewMetaData.name
                };


                FromGitFormEvent.handleDependencyViewToast(() => {
                    GitServiceAPI.cloneRepoByBranch(query).then(res => {
                        if (res) {
                            // console.log(res.path);

                            let query = {
                                path: res.path
                            }
                            let language = localStorage.getItem('language');

                            ProjectParserAPI.parseProjectByPath(query, language)
                                .then(parserRes => {
                                    if (parserRes) {
                                        // console.log(parserRes);
                                        IndexedDB.getRecord(db, 'root-node').then(
                                            result => {
                                                if (result === undefined)
                                                    IndexedDB
                                                        .insertRecord(db, parserRes, 'root-node')
                                                        .then(() => {
                                                            CentralViewDataManager.viewMode = VIEW_IDS.DEPENDENCY_VIEW_ID;
                                                            router.navigate("workspace/dependency");
                                                            return parserRes;
                                                        });
                                                else
                                                    IndexedDB
                                                        .updateRecord(db, parserRes, 'root-node')
                                                        .then(() => {
                                                            CentralViewDataManager.viewMode = VIEW_IDS.DEPENDENCY_VIEW_ID;
                                                            router.navigate("workspace/dependency");
                                                            return parserRes;
                                                        });
                                            }
                                        );
                                    }
                                })
                                .catch(error => {
                                    if (error.response) {
                                        // console.log(error.response);
                                        if (error.response.status == '401') {
                                            $('#tokenModal').modal('show');
                                        }
                                        Spinner.removeSpinner("git-branch-col");
                                    }
                                })
                        }
                    })
                })

            } else {
                query = {
                    url: GitDataManager.repoUrl,
                    token: GitDataManager.token,
                    username: GitDataManager.username,
                    commit: GitDataManager.dependencyViewMetaData.name
                };

                let languageInput = document.querySelector("#language").value;
            localStorage.setItem('language', languageInput);
            console.log("input", languageInput);
            GitDataManager.setLanguage(languageInput);

                FromGitFormEvent.handleDependencyViewToast(() => {
                    GitServiceAPI.cloneRepoByCommit(query).then(res => {
                        if (res) {
                            // console.log(res.path);

                            let query = {
                                path: res.path
                            }
                            let language = localStorage.getItem('language');
                            ProjectParserAPI.parseProjectByPath(query, language)
                                .then(parserRes => {
                                    if (parserRes) {
                                        // console.log(parserRes);
                                        IndexedDB.getRecord(db, 'root-node').then(
                                            result => {
                                                if (result === undefined)
                                                    IndexedDB
                                                        .insertRecord(db, parserRes, 'root-node')
                                                        .then(() => {
                                                            CentralViewDataManager.viewMode = VIEW_IDS.DEPENDENCY_VIEW_ID;
                                                            router.navigate("workspace/dependency");
                                                        });
                                                else
                                                    IndexedDB
                                                        .updateRecord(db, parserRes, 'root-node')
                                                        .then(() => {
                                                            CentralViewDataManager.viewMode = VIEW_IDS.DEPENDENCY_VIEW_ID;
                                                            router.navigate("workspace/dependency");
                                                        });
                                            }
                                        );
                                    }
                                })
                                .catch(error => {
                                    if (error.response) {
                                        // console.log(error.response);
                                        if (error.response.status == '401') {
                                            $('#tokenModal').modal('show');
                                        }
                                        Spinner.removeSpinner("git-branch-col");
                                    }
                                })
                        }
                    })
                });
            }
        })

    },

    handleSubmitVc() {
        IndexedDB.getRecord(db, 'git-token').then(d => {
            if (d) {
                GitDataManager.token = d;
            } else {
                GitDataManager.token = "";
            }
            let typeVer1 = GitDataManager.versionCompareMetaData.version1.type;
            let typeVer2 = GitDataManager.versionCompareMetaData.version2.type;
            let query;

            Utils.emptyContentDiv(["#git-branch-col"]);
            Utils.emptyContentDiv(["#git-commits-col"]);

            let languageInput = document.querySelector("#language").value;
            localStorage.setItem('language', languageInput);
            console.log("input", languageInput);
            GitDataManager.setLanguage(languageInput);

            if (typeVer1 === typeVer2) {
                if (GitDataManager.versionCompareMetaData.version1.type === "branch") {
                    query = {
                        url: GitDataManager.repoUrl,
                        token: GitDataManager.token,
                        user: GitDataManager.username,
                        branch1: GitDataManager.versionCompareMetaData.version1.name,
                        branch2: GitDataManager.versionCompareMetaData.version2.name,
                        compare: true
                    };

                    FromGitFormEvent.handleVersionCompareToast(() => {
                        GitServiceAPI.compareByBranches(query).then(res => {
                            // console.log(res);
                            IndexedDB.getRecord(db, 'version-compare').then(
                                result => {
                                    if (result === undefined)
                                        IndexedDB
                                            .insertRecord(db, res, 'version-compare')
                                            .then(() => {
                                                CentralViewDataManager.viewMode = VIEW_IDS.VERSION_COMPARE_ID;
                                                router.navigate("workspace/dependency");
                                            });
                                    else
                                        IndexedDB
                                            .updateRecord(db, res, 'version-compare')
                                            .then(() => {
                                                CentralViewDataManager.viewMode = VIEW_IDS.VERSION_COMPARE_ID;
                                                router.navigate("workspace/dependency");
                                            });
                                }
                            );
                        })
                            .catch(error => {
                                if (error.response) {
                                    // console.log(error.response);
                                    if (error.response.status == '401') {
                                        $('#tokenModal').modal('show');
                                    }
                                    Spinner.removeSpinner("git-branch-col");
                                }
                            })
                    });

                } else {
                    query = {
                        url: GitDataManager.repoUrl,
                        token: GitDataManager.token,
                        user: GitDataManager.username,
                        commit1: GitDataManager.versionCompareMetaData.version1.name,
                        commit2: GitDataManager.versionCompareMetaData.version2.name,
                        compare: true
                    };

                    let languageInput = document.querySelector("#language").value;
            localStorage.setItem('language', languageInput);
            console.log("input", languageInput);
            GitDataManager.setLanguage(languageInput);


                    FromGitFormEvent.handleVersionCompareToast(() => {
                        GitServiceAPI.compareByCommits(query).then(res => {
                            // console.log(res);
                            IndexedDB.getRecord(db, 'version-compare').then(
                                result => {
                                    if (result === undefined)
                                        IndexedDB
                                            .insertRecord(db, res, 'version-compare')
                                            .then(() => {
                                                CentralViewDataManager.viewMode = VIEW_IDS.VERSION_COMPARE_ID;
                                                router.navigate("workspace/dependency");
                                            });
                                    else
                                        IndexedDB
                                            .updateRecord(db, res, 'version-compare')
                                            .then(() => {
                                                CentralViewDataManager.viewMode = VIEW_IDS.VERSION_COMPARE_ID;
                                                router.navigate("workspace/dependency");
                                            });
                                }
                            );
                        })
                            .catch(error => {
                                if (error.response) {
                                    // console.log(error.response);
                                    if (error.response.status == '401') {
                                        $('#tokenModal').modal('show');
                                    }
                                    Spinner.removeSpinner("git-branch-col");
                                }
                            })
                    });
                }
            } else {
                let toastLiveExample = document.getElementById('git-error');
                if (toastLiveExample) {
                    let toast = new bootstrap.Toast(toastLiveExample)

                    toast.show()
                }
            }
        })

    },
    handleDependencyViewToast(cb) {
        let url = GitDataManager.repoUrl,
            projectName = GitDataManager.dependencyViewMetaData.name;

        let languageInput = document.querySelector("#language").value;
        localStorage.setItem('language', languageInput);
        console.log("input", languageInput);
        GitDataManager.setLanguage(languageInput);

        if (url.includes(".git")
            && projectName !== null) {
            ToastTemplate.emptyToast();
            ViewUtils.createLoading();
            Utils.emptyContentDiv(["#git-branch-col", "#git-commits-col"]);
            cb();
        } else {
            ToastTemplate.emptyToast();
            if (!url.includes(".git")) {
                ToastTemplate.addToast(
                    "Git url repository is not correct",
                    "Please correct git repository URL");
            }
            if (projectName=== null) {
                ToastTemplate.addToast(
                    "Project is empty.",
                    "Please select a branch or an commit");
            }
            ToastTemplate.showToast();
        }
    },

    handleVersionCompareToast(cb) {
        let url = GitDataManager.repoUrl,
            oldVersion = GitDataManager.versionCompareMetaData.version1.name,
            newVersion = GitDataManager.versionCompareMetaData.version2.name;

        if (url.includes(".git")
            && oldVersion !== null
            && newVersion !== null) {
            ToastTemplate.emptyToast();
            Utils.emptyContentDiv(["#git-branch-col", "git-commits-col"]);
            ViewUtils.createLoading();
            cb();
        } else {
            ToastTemplate.emptyToast();
            if (!url.includes(".git")) {
                ToastTemplate.addToast(
                    "Git url repository is not correct",
                    "Please correct git repository URL");
            }
            if (oldVersion === null) {
                ToastTemplate.addToast(
                    "Old version is empty.",
                    "Please select an old version");
            }
            if (newVersion=== null) {
                ToastTemplate.addToast(
                    "New version is empty.",
                    "Please select a new version");
            }
            ToastTemplate.showToast();
        }
    },

    displaySideBarForm() {

        const sourceCodeSideBar = Utils.createElementFromHTML(
            SourceCodeSideBarForm.createTemplate()
        );

        Utils.emptyContentDiv(["#sidebar-content"]);

        let sideBarContentDiv = document.querySelector("#sidebar-content");
        if (sideBarContentDiv) {
            sideBarContentDiv.append(sourceCodeSideBar);
        } else {
            // console.log("sidebar-content not found!")
        }

        this.rerenderProjectMetaData();

        // this.submitSourceControl();
    },
    rerenderProjectMetaData() {
        Utils.emptyContentDiv(["#sideBarProjectInfo"]);

        let sideBarProjectInfoDiv = document.querySelector("#sideBarProjectInfo");
        let sideBarProjectMetadata;

        if (GitDataManager.isVersionCompare) {
            sideBarProjectMetadata = Utils.createElementFromHTML(
                SideBarVCProjectInfoTemplate.createTemplate(
                    GitDataManager.versionCompareMetaData.version1.name,
                    GitDataManager.versionCompareMetaData.version2.name)
            )
        } else {

            sideBarProjectMetadata = Utils.createElementFromHTML(
                SideBarDVProjectInfoTemplate.createTemplate(GitDataManager.dependencyViewMetaData.name)
            )
        }

        if (sideBarProjectInfoDiv && sideBarProjectMetadata) {
            sideBarProjectInfoDiv.appendChild(sideBarProjectMetadata);
        }
    },

    addEventGitBranchItem(data) {
        Utils.emptyContentDiv(["#git-branch-col"]);
        let gitBranchCol = document.querySelector("#git-branch-col");

        if (data && Array.isArray(data)) {
            if (data.length > 0) {
                data.forEach((branch, i) => {
                    let formTemplate = DOMUtils.createElementFromHTML(`
                    <div  id="branch-${branch}" class="list-group-item list-group-item-action active mb-3 git-branch-item" aria-current="true">
                      <div class="">
                      <i class="fab fa-git-alt"></i>
                        ${branch}
                      </div>
                    </div>            
                `);

                    gitBranchCol.appendChild(formTemplate);

                    FromGitFormEvent.addBranchContextMenu(branch);
                })
            } else {
                gitBranchCol.html = "No branch"
            }
        }
    },

    addBranchContextMenu(branch) {
        $.contextMenu({
            selector: `#branch-${branch}`,
            callback: function (key, options) {
                if (GitDataManager.isVersionCompare) {
                    switch (key) {
                        case "old":
                            FromGitFormEvent.handleBranchSetVersion1(branch);
                            break;
                        case "new":
                            FromGitFormEvent.handleBranchSetVersion2(branch);
                            break;
                        case "getCommit":
                            FromGitFormEvent.handleBranchItemClickEvent(branch);
                            break;
                    }
                } else {
                    switch (key) {
                        case "dv":
                            FromGitFormEvent.handleDvData(branch, "branch");
                            break;
                        case "getCommit":
                            FromGitFormEvent.handleBranchItemClickEvent(branch);
                            break;
                    }
                }
            },
            items: GitDataManager.isVersionCompare ?
                ContextMenuOption.BRANCH_VERSION_OPTION : ContextMenuOption.DV_BRANCH_OPTION
        });
    },

    handleDvData(projectName, type) {
        GitDataManager.setDependencyViewMetaData(projectName, type);
        // console.log(GitDataManager.dependencyViewMetaData.name)
        this.rerenderProjectMetaData();
    },

    handleBranchSetVersion1(branch) {
        let result = GitDataManager.setVersion1(branch, "branch");
        if (!result) {
            ToastTemplate.emptyToast();
            ToastTemplate.addToast(
                Message.GIT_MESSAGE.ERROR_NOT_SAME_TYPE,
                Message.GIT_MESSAGE.ERROR_NOT_SAME_TYPE_EXAMPLE
            );

            ToastTemplate.showToast();
        }

        this.rerenderProjectMetaData();
    },

    handleBranchSetVersion2(branch) {
        let result = GitDataManager.setVersion2(branch, "branch");
        if (!result) {
            ToastTemplate.emptyToast();
            ToastTemplate.addToast(
                Message.GIT_MESSAGE.ERROR_NOT_SAME_TYPE,
                Message.GIT_MESSAGE.ERROR_NOT_SAME_TYPE_EXAMPLE
            );

            ToastTemplate.showToast();
        }

        // let gitVersion2Input = document.querySelector("#git-version2");
        // if (gitVersion2Input) {
        //     gitVersion2Input.value = branch;
        // }

        this.rerenderProjectMetaData();
    },

    handleBranchItemClickEvent(branch) {
        IndexedDB.getRecord(db, 'git-token').then(d => {
            if (d) {
                GitDataManager.token = d;
            } else {
                GitDataManager.token = "";
            }
            Utils.emptyContentDiv(["#git-commits-col"]);
            let gitCommitCol = document.querySelector("#git-commits-col");
            gitCommitCol.appendChild(DOMUtils.createElementFromHTML(Spinner.createSpinner("git-commits-col")));

            let query = {
                url: GitDataManager.repoUrl,
                username: GitDataManager.username,
                branch: branch,
                token: GitDataManager.token
            }

            GitServiceAPI.getAllCommitByRepo(query)
                .then(res => {
                    if (res) {
                        Spinner.removeSpinner("git-commits-col");
                        // // console.log(res)
                        GitDataManager.commitList = res;

                        FromGitFormEvent.addEventGitCommitItem(GitDataManager.commitList);
                    }
                })
                .catch(error => {
                    if (error.response) {
                        // console.log(error.response);
                        if (error.response.status == '401') {
                            $('#tokenModal').modal('show');
                        }
                        Spinner.removeSpinner("git-branch-col");
                    }
                });
        })
    },

    addEventGitCommitItem(data) {
        let gitCommitCol = document.querySelector("#git-commits-col");
        if (data && Array.isArray(data)) {
            if (data.length > 0) {
                data.forEach((commit, i) => {
                    let formTemplate = DOMUtils.createElementFromHTML(`
                            <div id="commit-${commit.name}" class="list-group-item list-group-item-action active mb-3 git-commit-item" aria-current="true">
                              <div class="d-flex w-100 justify-content-between commit-msg">
                                <div class="mb-1">${commit.author}</div>
                                <small>${commit.time.slice(0, 19).replace("T", " ")}</small>
                              </div>
                              <div>
                                <small class="commit-msg">Message: ${commit.message}</small>
                               </div>
                            </div>            
                        `);

                    gitCommitCol.appendChild(formTemplate);

                    this.addCommitContextMenu(commit.name);
                })
            } else {
                gitCommitCol.html = "No commit"
            }
        }
    },

    addCommitContextMenu(commitName) {
        $.contextMenu({
            selector: `#commit-${commitName}`,
            callback: function (key, options) {
                if (GitDataManager.isVersionCompare) {
                    switch (key) {
                        case "old":
                            // console.log("OLD");
                            FromGitFormEvent.handleCommitSetVersion1(commitName);
                            break;
                        case "new":
                            // console.log("NEW");
                            FromGitFormEvent.handleCommitSetVersion2(commitName);
                            break;
                    }
                } else {
                    switch (key) {
                        case "dv":
                            FromGitFormEvent.handleDvData(commitName, "commit");
                            break;
                    }
                }
            },
            items: GitDataManager.isVersionCompare ?
                ContextMenuOption.COMMIT_VERSION_OPTION : ContextMenuOption.DV_COMMIT_OPTION
        });
    },

    handleCommitSetVersion1(commitName) {

        let result = GitDataManager.setVersion1(commitName, "commit");
        if (!result) {
            ToastTemplate.emptyToast();
            ToastTemplate.addToast(
                Message.GIT_MESSAGE.ERROR_NOT_SAME_TYPE,
                Message.GIT_MESSAGE.ERROR_NOT_SAME_TYPE_EXAMPLE
            );

            ToastTemplate.showToast();
        }
        this.rerenderProjectMetaData();
    },

    handleCommitSetVersion2(commitName) {
        let result = GitDataManager.setVersion2(commitName, "commit");
        if (!result) {
            ToastTemplate.emptyToast();
            ToastTemplate.addToast(
                Message.GIT_MESSAGE.ERROR_NOT_SAME_TYPE,
                Message.GIT_MESSAGE.ERROR_NOT_SAME_TYPE_EXAMPLE
            );

            ToastTemplate.showToast();
        }
        this.rerenderProjectMetaData();
    },
};

export default FromGitFormEvent;
