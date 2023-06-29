import {DOMUtils} from "../../components/utils/DOMUtils";
import {SignUp} from "./SignUp";
import {db} from "../../app";
import Utils from "../../components/utils/BasicUltils";
import SignUpTemplate from "./SignUpTemplate";

const SignupForm = {
    mount() {
        DOMUtils.hideNavLinks();

        SignupForm.createView(db);
        const form = document.querySelector(".signup-wrapper");
        if (form) {
            const fields = ["username", "email", "password"];
            new SignUp(form, fields);
        }
    },
    unMount() {
        Utils.emptyContentDiv([".content"]);
        DOMUtils.showNavLink();
    },
    createView: function () {
        let htmlSignup = SignUpTemplate;
        let domSignup = DOMUtils.createElementFromHTML(htmlSignup);

        document.querySelector(".content").style.backgroundColor = "#E8E8E8";
        let signup_wrapper = document.querySelector(".signup-wrapper");
        if (signup_wrapper == null) {
            document.querySelector(".content").appendChild(domSignup);
        }
    },
};

export default SignupForm;
