import AuthApi from "../../api/sender/auth-sender";
import {router} from "../../app";
import ApiRoute from "../../api/ApiRoute";

export class SignUp {
    constructor(form, fields) {
        this.form = form;
        this.fields = fields;

        this.validateOnSubmit();
        this.redirectToLoginPage();
    }

    validateOnSubmit() {
        let self = this;

        let forms = document.querySelectorAll('.needs-validation')

        // Loop over them and prevent submission
        Array.prototype.slice.call(forms)
            .forEach(function (form) {
                form.addEventListener('submit', function (event) {
                    event.preventDefault();
                    if (!form.checkValidity()) {
                        event.preventDefault()
                        event.stopPropagation()
                    } else {
                        if (form.id === "signup-form") {
                            // console.log(self.form)
                            let username = self.form.querySelector("#username").value;
                            let password = self.form.querySelector("#password").value;
                            let email = self.form.querySelector("#email").value;

                            let signupBody = {
                                username : username,
                                mail : email,
                                account : {
                                    username : username,
                                    password : password
                                }
                            };
                            AuthApi.sendPayload(signupBody, ApiRoute.ACCOUNT.REGISTER).then(d => {
                                // console.log(d)
                                router.navigate('home');
                            });
                        }
                    }
                    form.classList.add('was-validated')
                }, false)
            });
    }

    redirectToLoginPage() {
        let registerBtn = document.getElementById("signup-alt");
        registerBtn.addEventListener("click", () => {
            router.navigate("login");
        });
    }

}