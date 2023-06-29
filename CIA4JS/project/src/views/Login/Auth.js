import {router} from "../../app";

export class Auth {
    constructor() {
        // document.querySelector("body").style.display = "none";
        this.validateAuth(() => {});
    }
    validateLogin() {
        const auth = localStorage.getItem("token");
        if (auth) {
            router.navigate("home");
        } else {
            router.navigate("login");
        }
    }
    // check to see if the localStorage item passed to the function is valid and set
    validateAuth(cb) {
        const auth = localStorage.getItem("token");
        if (auth) {
            cb();
        } else {
            router.navigate("login");
        }
    }

    validateCreateView(obj) {
        const auth = localStorage.getItem("token");
        if (auth) {
            // console.log("01040149194")
            obj.createView();
        } else {
            router.navigate("login");
        }
    }

    // will remove the localStorage item and redirect to login  screen
    logOut() {
        localStorage.removeItem("token");
        router.navigate("login")
    }
}