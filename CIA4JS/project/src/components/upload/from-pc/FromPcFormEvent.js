import { Notifier } from "../../utils/NotiUltils";
import { ViewUtils } from "../../utils/ViewUtils";
import TreeAPI from "../../../api/TreeAPI";
import { IndexedDB } from "../../../indexeddb/IndexedDB";
import { db, router } from "../../../app";
import { UploadDataManager } from "../UploadDataManager";
import CentralViewDataManager from "../../data-manager/central-view/CentralViewDataManager";
import { VIEW_IDS } from "../../d3-components/viewers/view-components/central/CentralViewTabs";
import Utils from "../../utils/BasicUltils";
import FromPcDataManager from "./FromPcDataManager";
import FromPcSidebarForm from "./FromPcSidebarForm";
import NewProjectForm from "./NewProjectForm";
import { DOMUtils } from "../../utils/DOMUtils";
import NewVersionForm from "./NewVersionForm";
import FileUtils from "../../utils/FileUtils";
import ProjectAPI from "../../../api/ProjectAPI";
import ToastTemplate from "../../common/toast/ToastTemplate";
import CONFIG from "../../../../config";

export const FromPcFormEvent = {
  file: null,
  language: null,
  addUploadFileEvent: function (db) {
    const dragArea = document.querySelector(".drag-area");
    const dragText = document.querySelector(".header");

    let browse = document.querySelector(".browse");
    let fileInput = document.querySelector(".file-upload");
    let choose_another = document.querySelector(".another");
    let uploadIcon = document.querySelector(".fa-folder-plus");

    browse.onclick = () => {
      fileInput.click();
    };

    uploadIcon.onclick = () => {
      fileInput.click();
    };

    choose_another.onclick = () => {
      fileInput.click();
    };

    if (FromPcFormEvent.file === undefined) {
      let uploadBtn = document.querySelector(".upload");
      uploadBtn.onclick = (event) => {
        // console.log("hello")
        Notifier.displayError("You need to choose project first!");
        event.preventDefault();
      };
    }

    fileInput.addEventListener("change", function () {
      FromPcFormEvent.file = this.files[0];
      document.querySelector(".upload").onclick = () => {};
      dragArea.classList.add("active");
      displayFile();
    });

    //when file is in drag area
    dragArea.addEventListener("dragover", (event) => {
      event.preventDefault();
      dragText.textContent = "Release to Upload";
      dragArea.classList.add("active");
    });

    dragArea.addEventListener("dragleave", () => {
      dragText.textContent = "Drag & Drop";
      dragArea.classList.remove("active");
    });

    dragArea.addEventListener("drop", (event) => {
      event.preventDefault();
      FromPcFormEvent.file = event.dataTransfer.files[0];
      document.querySelector(".upload").onclick = () => {};
      displayFile();
    });

    // hàm này có tên file (xử lí vào đây được không ^^)
    function displayFile() {
      let fileType = FromPcFormEvent.file.type;
      let validExpressions = [
        "application/zip",
        "application/x-zip-compressed",
        "multipart/x-zip",
      ];
      if (validExpressions.includes(fileType)) {
        let fileReader = new FileReader();

        fileReader.onload = () => {
          let imgTag = `<img src="https://cdn-icons-png.flaticon.com/512/2818/2818715.png"/>`;
          dragArea.innerHTML = imgTag;

          FromPcFormEvent.updateUploadFormFileName();
          document.querySelector("#frompc-proj").value =
            FromPcFormEvent.file.name.replace(".zip", "");
          FromPcDataManager.projectName = FromPcFormEvent.file.name.replace(
            ".zip",
            ""
          );
          if (FromPcFormEvent.language)
            FromPcDataManager.language = FromPcFormEvent.language;
          FromPcDataManager.versionName = "v1.0";
          FromPcFormEvent.validateProjectAndVersionName();
        };

        fileReader.readAsDataURL(FromPcFormEvent.file);
      } else {
        Notifier.displayError("File must be in .zip format");
        dragArea.classList.remove("active");
      }
    }

    $(".upload").on("click", function (e) {
      // console.log("33333333333333333333333333333")
      let fromPcProj = document.querySelector(".form-control#frompc-proj");
      if (
        !UploadDataManager.validator.isProjectExisted &&
        !UploadDataManager.validator.isVersionExisted &&
        FromPcDataManager.projectName !== null &&
        FromPcDataManager.language !== null &&
        FromPcDataManager.versionName !== null &&
        FromPcFormEvent.file !== null
      ) {
        if (fromPcProj) {
          DOMUtils.removeInputValidate("frompc-proj");
        } else {
          DOMUtils.removeInputValidate("frompc-ver");
        }

        let filename = document.querySelector("#file-name");
        let languageInput = document.querySelector("#language").value;
        localStorage.setItem('language', languageInput);
        console.log("input", languageInput);
        console.log("type", typeof languageInput);

        let projectType = document.querySelector("#type").value;
        localStorage.setItem('project-type', projectType);

        if (filename && FromPcFormEvent.file && languageInput) {
          // // console.log(FromPcFormEvent.file)
          FromPcFormEvent.file = FileUtils.renameFile(
            FromPcFormEvent.file,
            FromPcDataManager.projectName +
              "-" +
              FromPcDataManager.versionName +
              ".zip"
          );
          FromPcFormEvent.language = languageInput;
          FromPcDataManager.language = languageInput;
        }

        if (
          FromPcFormEvent.file !== undefined &&
          FromPcFormEvent.file !== null
          // && FromPcFormEvent.language !== null && FromPcFormEvent.language !== undefined
        ) {
          ViewUtils.createLoading();
          let query = {
            projectName: FromPcDataManager.projectName,
            language: FromPcDataManager.language,
            versionName: FromPcDataManager.versionName,
          };
          let inputType = localStorage.getItem('project-type');
          console.log("Type:", inputType);
          if(inputType == "cia") {
            if (!FromPcDataManager.isNewVersionMode) {
              FromPcFormEvent.saveProject(query);
            } else {
              FromPcFormEvent.saveVersion(query);
              FromPcDataManager.isNewVersionMode = false;
            }
          } else {
            FromPcFormEvent.saveTestProject();
          }
        }
      } else {
        ToastTemplate.emptyToast();
        // console.log(UploadDataManager.validator)
        if (UploadDataManager.validator.isProjectExisted) {
          ToastTemplate.addToast(
            "Project name is already existed!",
            "Please using another project name"
          );

          ToastTemplate.showToast();
          // FromPcDataManager.projectName = null;
          // FromPcFormEvent.file = null;
        }

        if (FromPcDataManager.projectName === null) {
          ToastTemplate.addToast(
            "Project name is empty!",
            "Please fill in project name"
          );

          ToastTemplate.showToast();
        }

        // console.log(FromPcFormEvent.file)

        if (FromPcDataManager.language == null) {
          ToastTemplate.addToast(
            "Project's language is empty!",
            "Please choose an option in language"
          );

          ToastTemplate.showToast();
        }

        console.log('languages: ' + FromPcDataManager.language);
        console.log(FromPcFormEvent.file);

        if (FromPcFormEvent.file === null) {
          ToastTemplate.addToast(
            "File is empty!",
            "Please upload your project file"
          );

          ToastTemplate.showToast();
        }
      }
    });
  },
  saveProject(query) {
    IndexedDB.getRecord(db, "username")
      .then((username) => {
        if (username) {
          CONFIG.username = username;
          ProjectAPI.saveProject(query)
            .then((res1) => {
              if (res1) {
                let form = new FormData();
                form.append(
                  "file",
                  FromPcFormEvent.file,
                  FromPcFormEvent.file.name
                );
                TreeAPI.getTree(form, query.language)
                  .then((d) => {
                    let data = {
                      dvData: d,
                      projectName: query.projectName,
                      language: query.language,
                      versionName: query.versionName,
                    };
                    console.log('data in save project:', data);
                    localStorage.setItem("project-path", d.address);
                    IndexedDB.getRecord(db, "root-node").then((result) => {
                      if (result === undefined)
                        IndexedDB.insertRecord(db, data, "root-node").then(
                          () => {
                            CentralViewDataManager.viewMode =
                              VIEW_IDS.DEPENDENCY_VIEW_ID;
                            CentralViewDataManager.projectName =
                              FromPcDataManager.projectName;
                            FromPcFormEvent.file = null;
                            router.navigate("workspace/dependency");
                          }
                        );
                      else
                        IndexedDB.updateRecord(db, data, "root-node").then(
                          (res) => {
                            CentralViewDataManager.viewMode =
                              VIEW_IDS.DEPENDENCY_VIEW_ID;
                            FromPcFormEvent.file = null;
                            router.navigate("workspace/dependency");
                          }
                        );
                    });
                  })
                  .catch((error) => {
                    // console.log(error);
                    $(".loader-wrapper").remove();
                    ToastTemplate.emptyToast();
                    ToastTemplate.addToast("Error while parsing project");
                    ToastTemplate.showToast();
                    FromPcFormEvent.file = null;
                  });
              }
            })
            .catch((error) => {
              // console.log(error);

              ToastTemplate.emptyToast();
              $(".loader-wrapper").remove();
              ToastTemplate.addToast("Error while saving project");
              ToastTemplate.showToast();
              FromPcFormEvent.file = null;
            });
        }
      })
      .catch((error) => {
        // console.log("Username not exit in indexDb");
      });
  },
  saveVersion(query) {
    ProjectAPI.saveVersion(query)
      .then((res1) => {
        if (res1) {
          let form = new FormData();
          form.append("file", FromPcFormEvent.file, FromPcFormEvent.file.name);

          TreeAPI.getTree(form)
            .then((d) => {
              let data = {
                dvData: d,
                projectName: query.projectName,
              };
              localStorage.setItem("project-path", d.address);
              IndexedDB.getRecord(db, "root-node").then((result) => {
                if (result === undefined)
                  IndexedDB.insertRecord(db, data, "root-node").then(() => {
                    CentralViewDataManager.viewMode =
                      VIEW_IDS.DEPENDENCY_VIEW_ID;
                    FromPcFormEvent.file = null;
                    router.navigate("workspace/dependency");
                  });
                else
                  IndexedDB.updateRecord(db, data, "root-node").then((res) => {
                    CentralViewDataManager.viewMode =
                      VIEW_IDS.DEPENDENCY_VIEW_ID;
                    FromPcFormEvent.file = null;
                    router.navigate("workspace/dependency");
                  });
              });
            })
            .catch((error) => {
              // console.log(error);
              $(".loader-wrapper").remove();
              ToastTemplate.emptyToast();
              ToastTemplate.addToast("Error while parsing project");
              ToastTemplate.showToast();
              FromPcFormEvent.file = null;
            });
        }
      })
      .catch((error) => {
        // console.log(error);

        ToastTemplate.emptyToast();
        $(".loader-wrapper").remove();
        ToastTemplate.addToast("Error while saving version");
        ToastTemplate.showToast();
      });
  },

  saveTestProject() {
    router.navigate("test");
  },
  
  displaySideBarForm() {
    const fromPcSideBar = Utils.createElementFromHTML(
      FromPcSidebarForm.createTemplate()
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
    const menuOptions = document.querySelectorAll(
      "#sidebar .upload-header-menu-option"
    );

    if (menuOptions !== null) {
      menuOptions.forEach((option) => {
        option.addEventListener("click", handleOnclick);
      });
    }
    function handleOnclick(e) {
      e.preventDefault();

      let options = document.querySelectorAll(".upload-header-menu-option");

      options.forEach((o) => {
        if (o.classList.contains("selected-box-shadow-white")) {
          o.classList.remove("selected-box-shadow-white");
        }
      });
      this.classList.add("selected-box-shadow-white");

      switch (this.id) {
        case "new-proj-form":
          FromPcDataManager.isNewVersionMode = false;
          FromPcFormEvent.addNewProjForm();
          FromPcFormEvent.addEventProjectAndVersionNameInput();
          FromPcFormEvent.addEventProjectLanguage();
          break;

        case "new-ver-form":
          FromPcDataManager.isNewVersionMode = true;
          FromPcFormEvent.addNewVerForm();
          FromPcFormEvent.addEventProjectAndVersionNameInput();
          FromPcFormEvent.addEventProjectLanguage();
          break;
      }
    }
  },
  addNewProjForm() {
    Utils.emptyContentDiv(["#sideBarProjectInfo"]);

    const newProjForm = DOMUtils.createElementFromHTML(
      NewProjectForm.createTemplate()
    );

    let sideBarProjectInfo = document.querySelector("#sideBarProjectInfo");
    if (sideBarProjectInfo) {
      sideBarProjectInfo.appendChild(newProjForm);
    }
  },
  addNewVerForm() {
    Utils.emptyContentDiv(["#sideBarProjectInfo"]);

    const newProjForm = DOMUtils.createElementFromHTML(
      NewVersionForm.createTemplate()
    );

    let sideBarProjectInfo = document.querySelector("#sideBarProjectInfo");
    if (sideBarProjectInfo) {
      sideBarProjectInfo.appendChild(newProjForm);
    }
    let fromPcProjectSelect = document.querySelector("#frompc-proj");
    if (fromPcProjectSelect) {
      UploadDataManager.projectList.forEach((proj) => {
        fromPcProjectSelect.appendChild(
          Utils.createElementFromHTML(
            `<option value="${proj.name}">${proj.name}</option>`
          )
        );
      });
    }
  },
  addEventProjectAndVersionNameInput() {
    let fromPCProj = document.querySelector("#frompc-proj");
    let fromControl = document.querySelector(".form-control#frompc-proj");
    //   console.log(fromPCProj)
    //   console.log(fromControl)
    //   console.log(FromPcDataManager.isNewVersionMode)
    if (fromPCProj) {
      if (fromControl !== null) {
        // console.log("22222222222222222222")
        fromPCProj.addEventListener("input", handler);
        fromPCProj.addEventListener("change", handler);

        function handler(event) {
          let inputValue = event.target.value;

          console.log("input value", inputValue);

          DOMUtils.removeInputValidate("frompc-proj");

          if (inputValue !== "") {
            UploadDataManager.validator.isProjectExisted =
              FromPcFormEvent.checkIfProjectExisted(inputValue);
            if (!UploadDataManager.validator.isProjectExisted) {
              // console.log(inputValue)
              FromPcDataManager.projectName = inputValue;

              FromPcDataManager.versionName = "v1.0";
              fromPCProj.classList.add("is-valid");
            } else {
              fromPCProj.classList.add("is-invalid");
            }
          }
        }
      } else {
        // console.log("99999999999999999999999")
        let fromPCVer = document.querySelector("#frompc-ver");
        fromPCProj.addEventListener("change", (event) => {
          FromPcDataManager.projectName = event.target.value;
          // ProjectAPI.getProjectIdByName(FromPcDataManager.projectName)
          let verList = ProjectAPI.getAllVersionIdByName(
            FromPcDataManager.projectName
          );

          let ver = verList[verList.length - 1].name;
          if (
            ver.lastIndexOf(".") !== -1 ||
            Number(ver.substring(ver.lastIndexOf(".") + 1)) !== NaN
          ) {
            let ver1 = Number(ver.substring(ver.lastIndexOf(".") + 1)) + 1;
            ver = ver.substring(0, ver.lastIndexOf(".") + 1) + ver1;
          } else {
            function makeid(length) {
              var result = "";
              var characters =
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
              var charactersLength = characters.length;
              for (var i = 0; i < length; i++) {
                result += characters.charAt(
                  Math.floor(Math.random() * charactersLength)
                );
              }
              return result;
            }

            ver = makeid(7);
          }
          FromPcDataManager.versionName = ver;
          fromPCVer.value = ver;
          // FromPcFormEvent.updateUploadFormFileName();
        });

        if (fromPCVer) {
          fromPCVer.addEventListener("input", handler);
          fromPCVer.addEventListener("change", handler);

          function handler(event) {
            let inputValue = event.target.value;

            DOMUtils.removeInputValidate("frompc-ver");

            if (inputValue !== "") {
              UploadDataManager.validator.isVersionExisted =
                FromPcFormEvent.checkIfVersionExisted(
                  FromPcDataManager.projectName,
                  inputValue
                );
              if (!UploadDataManager.validator.isVersionExisted) {
                FromPcDataManager.versionName = event.target.value;
                fromPCVer.classList.add("is-valid");
              } else {
                fromPCVer.classList.add("is-invalid");
              }
            }
          }
        }
      }
    }
  },

  // get the language function
  addEventProjectLanguage() {
    let languageInput = document.querySelector("#language");
    if (languageInput) {
      if (!FromPcDataManager.isNewVersionMode) {
        // languageInput.addEventListener("input", handler);
        languageInput.addEventListener("change", handler);

        function handler(event) {
          let inputValue = event.target.value;

          console.log("language", inputValue);
          // DOMUtils.removeInputValidate("frompc-proj")

          if (inputValue !== "") {
            // UploadDataManager.validator.isProjectExisted = FromPcFormEvent.checkIfProjectExisted(inputValue);
            if (!UploadDataManager.validator.isProjectExisted) {
              FromPcDataManager.language = inputValue;
              // FromPcDataManager.versionName = "v1.0";
              languageInput.classList.add("is-valid");
            } else {
              languageInput.classList.add("is-invalid");
            }
          }
        }
      } else {
        languageInput.addEventListener("change", (event) => {
          FromPcDataManager.language = event.target.value;
          console.log(event.target.value);
          // FromPcFormEvent.updateUploadFormFileName();
        });
        let fromPCVer = document.querySelector("#frompc-ver");
        if (fromPCVer) {
          fromPCVer.addEventListener("input", (event) => {
            FromPcDataManager.versionName = event.target.value;
            // ProjectAPI.getProjectIdByName(FromPcDataManager.projectName)
            console.log(FromPcDataManager);
          });
        }
      }
    }
  },

  updateUploadFormFileName() {
    let fileName = document.querySelector("#file-name");
    // console.log(fileName)
    // console.log(FromPcFormEvent.file)
    if (fileName && FromPcFormEvent.file) {
      fileName.innerHTML = `<span class="remove"><i class="fas fa-folder"></i></span> 
                    ${FromPcFormEvent.file.name}`;
    }
  },
  checkIfProjectExisted(projectName) {
    let check = false;

    // console.log(UploadDataManager.projectList)
    UploadDataManager.projectList.forEach((proj) => {
      if (proj.name === projectName) {
        check = true;
      }
    });
    return check;
  },
  checkIfVersionExisted(projectName, versionName) {
    let check = false;
    UploadDataManager.projectList.forEach((proj) => {
      if (proj.name === projectName) {
        // console.log(UploadDataManager.projectList)
        proj.versionList.forEach((ver) => {
          if (ver.name === versionName) {
            check = true;
          }
        });
      }
    });
    return check;
  },
  validateProjectAndVersionName() {
    let fromPCProj = document.querySelector("#frompc-proj");
    let fromControl = document.querySelector(".form-control#frompc-proj");
    if (fromPCProj && fromControl) {
      DOMUtils.removeInputValidate("frompc-proj");
      UploadDataManager.validator.isProjectExisted =
        FromPcFormEvent.checkIfProjectExisted(fromPCProj.value);
      if (!UploadDataManager.validator.isProjectExisted) {
        fromPCProj.classList.add("is-valid");
      } else {
        fromPCProj.classList.add("is-invalid");
      }
    } else {
      let fromPCVer = document.querySelector("#frompc-ver");
      DOMUtils.removeInputValidate("frompc-ver");
      UploadDataManager.validator.isVersionExisted =
        FromPcFormEvent.checkIfVersionExisted(
          FromPcDataManager.projectName,
          fromPCVer.value
        );
      // console.log(FromPcFormEvent.checkIfVersionExisted(FromPcDataManager.projectName, fromPCVer.value))
      if (!UploadDataManager.validator.isVersionExisted) {
        fromPCVer.classList.add("is-valid");
      } else {
        fromPCVer.classList.add("is-invalid");
      }
    }
  },
};
