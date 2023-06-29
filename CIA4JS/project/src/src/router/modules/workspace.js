import Workspace from "../../views/workspace";
import {ViewInitializer} from "../../components/d3-components/initD3";

const workspaceRoutes = {
    name: "workspace",
    component: Workspace,
    path: "/workspace",
    children : [
        {
            name: "dependency",
            component: ViewInitializer,
            path: "/workspace/dependency",
        },
        // {
        //     name: "version-compare",
        //     component: VersionCompare,
        //     path: "/workspace/version-compare",
        // }
    ]
}
export default workspaceRoutes;