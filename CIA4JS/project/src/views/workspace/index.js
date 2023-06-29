import {auth} from "../../app";
import Utils from "../../components/utils/BasicUltils";

const Workspace = {
    mount() {
        auth.validateAuth(this.createView);
    },
    unMount() {
        Utils.emptyContentDiv([".content"]);
    },
    createView() {

    }
}
export default Workspace;