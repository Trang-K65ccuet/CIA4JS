import uploadRoutes from "./modules/upload";
import projectRoutes from "./modules/projects";
import unitTestingRoutes from "./modules/unittesting";
import workspaceRoutes from "./modules/workspace";
import {HomePage} from "../views/homepage/HomePage";
import LoginForm from "../views/Login/loginForm";
import SignupForm from "../views/signup/SignupForm";
import {ProjectPage} from "../components/project-page/ProjectPage";
import {router} from "../app";
import Utils from "../components/utils/BasicUltils";
import License from "../components/license/License";


const routes = [
    {
        name: "redirect",
        path: '/',
        component: {
            mount() {
                router.navigate("/home");
            },
            unMount() {
                Utils.emptyContentDiv([".content"]);
            }
        },
    },
    {
        name: "home",
        path: '/home',
        component: HomePage,
    },
    {
        name: "login",
        path: '/login',
        component: LoginForm,
        hidden: true,
    },
    {
        name: "signup",
        path: '/signup',
        component: SignupForm,
        hidden: true
    },
    uploadRoutes,
    projectRoutes,
    workspaceRoutes,
    unitTestingRoutes,
    {
        name: "license",
        path: '/license',
        component: License,
        hidden: true
    },
]

export default routes;
