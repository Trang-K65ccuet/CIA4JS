import AuthApi from "../../api/sender/auth-sender";
import {db, router} from "../../app";
import ApiRoute from "../../api/ApiRoute";
import CONFIG from "../../../config";
import {IndexedDB} from "../../indexeddb/IndexedDB";
import CentralViewDataManager from "../../components/data-manager/central-view/CentralViewDataManager";
import {VIEW_IDS} from "../../components/d3-components/viewers/view-components/central/CentralViewTabs";

export class Login {
    constructor(form, fields) {
        this.form = form;
        this.fields = fields;

        this.validateOnSubmit();
        this.redirectToRegisterPage();
    }

    validateOnSubmit() {
        let self = this;

        let forms = document.querySelectorAll('.needs-validation')

        // Loop over them and prevent submission
        Array.prototype.slice.call(forms)
            .forEach(function (form) {
                form.addEventListener('submit', function (event) {
                    event.preventDefault();
                    let check = false;
                    if (!form.checkValidity()) {
                        // console.log(form)
                        event.preventDefault()
                        event.stopPropagation()
                    } else {
                        if (form.id === "login-form") {
                            // console.log(self.form)
                            let username = self.form.querySelector("#username").value;
                            let password = self.form.querySelector("#password").value;
                            let userLoginInfo = {
                                "username": username,
                                "password": password
                            };
                            AuthApi.sendPayload(userLoginInfo, ApiRoute.ACCOUNT.LOGIN).then(d => {
                                // console.log(d)
                                localStorage.setItem('token', d.jwt);
                                IndexedDB.getRecord(db, 'username').then(
                                    result => {
                                        if(result === undefined)
                                            IndexedDB
                                                .insertRecord(db, username, 'username')
                                                .then(() => {
                                                    // console.log(username)
                                                    CONFIG.username = username;
                                                });
                                        else
                                            IndexedDB
                                                .updateRecord(db, username, 'username')
                                                .then(()=> {
                                                    // console.log(username)
                                                    CONFIG.username = username;
                                                });
                                    }
                                );
                                router.navigate('home');
                            });
                        }
                    }
                    form.classList.add('was-validated')
                }, false)
            });
    }

    redirectToRegisterPage() {
        let registerBtn = document.getElementById("signup-alt");
        registerBtn.addEventListener("click", () => {
            router.navigate("signup");
        });
    }

}