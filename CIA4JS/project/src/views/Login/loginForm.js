import {DOMUtils} from "../../components/utils/DOMUtils";
import {Login} from "./Login";
import {auth, db} from "../../app";
import Utils from "../../components/utils/BasicUltils";
import LoginTemplate from "./LoginTemplate";

const LoginForm = {
    mount() {
        DOMUtils.hideNavLinks();

        LoginForm.createView(db);
        const form = document.getElementById("login-form");
        if (form) {
            const fields = ["username", "password"];
            new Login(form, fields);
        }
        auth.validateLogin();
    },
    unMount() {
        Utils.emptyContentDiv([".content"]);
        DOMUtils.showNavLink();
    },
    createView: function () {
        let htmlLogin = LoginTemplate;
        let domLogin = DOMUtils.createElementFromHTML(htmlLogin);

        document.querySelector(".content").style.backgroundColor = "#E8E8E8";
        let login_wrapper = document.querySelector(".login-wrapper");
        if (login_wrapper == null) {
            document.querySelector(".content").appendChild(domLogin);
        }
    },
};

export default LoginForm;
