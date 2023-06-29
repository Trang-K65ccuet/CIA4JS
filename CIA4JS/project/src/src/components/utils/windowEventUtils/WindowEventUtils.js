import {router} from "../../../app";

function handleWindowReload() {
    let currentUrl = window.location.pathname;

    // console.log("reload")

    window.onbeforeunload = function (e) {
        e.stopPropagation();
        router.navigate("home");
    }
}

export const WindowEventUtils = {
    handleWindowReload,
}