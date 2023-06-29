// Libs
// import "../lib/jquery/jquery-3.6.0.min";
// import "bootstrap/dist/js/bootstrap.min";
import 'bootstrap-menu';

//font awesome icon
import "@fortawesome/fontawesome-free/js/fontawesome";
import "@fortawesome/fontawesome-free/js/solid";
import "@fortawesome/fontawesome-free/js/regular";
import "@fortawesome/fontawesome-free/js/brands";

import "bootstrap-icons/font/bootstrap-icons.css";

//scss
import "./style.scss";

// utils
import Navigo from "navigo";
import NavbarAction from './components/nav-bar/navbarAction';
import {Auth} from "./views/Login/Auth";
import routes from "./router";


// Manage navigo router
export const router = new Navigo("/");

export const auth = new Auth();


//Auth
document.querySelector(".logout").addEventListener("click", (e) => {
	auth.logOut();
});

//init Indexed DB
const request = window.indexedDB.open("jcia");

export var db = null;

export const App = {
	initApp() {
		request
			.onerror = (e) => {
			// console.log("Problem while opening DB");
		};

		request
			.onupgradeneeded = (e) => {
			db = e.target.result;
			const store = db.createObjectStore("dep-res");
			store.transaction.oncomplete = (e) => {
				// console.log("success open dep-res");
			};
		};

		request
			.onsuccess = (e) => {
			db = e.target.result;
			// console.log(e)
			NavbarAction.handleURL();
			
			this.createRouter(routes);
		}
	},
	createRouter(routes) {
		routes.forEach(route => {
			// // console.log(route)
			
			router.on(route.path, () => {
				route.component.mount();
			}, 
			{
				leave(done, match) {
					// // console.log(Utils.emptyContentDiv([".content"]))
					route.component.unMount();
					done();
				}
			});

			router.resolve();
			// // console.log(route)

			let routeChildren = route.children;

			if (routeChildren !== null
				&& routeChildren !== undefined
				&& Array.isArray(routeChildren)) {
				this.createRouter(routeChildren);
			}
		})
	},
}

App.initApp();

window.onbeforeunload = function (e) {
	e.stopPropagation();
	// // console.log("000000000000000000000000000")
	router.navigate("home");

	$(function () {
		$('[data-toggle="tooltip"]').tooltip()
	})
}

