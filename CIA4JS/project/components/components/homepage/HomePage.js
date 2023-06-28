import {DOMUtils} from "../utils/DOMUtils";
import {HomePageTemplate} from "./HomePageTemplate";

import recent_projects from "../../fake_data/git/someRepo.json";
import {auth} from "../../app";
import Utils from "../utils/BasicUltils";

export const HomePage = {
    mount() {
        auth.validateAuth(this.createView);
    },
    unMount() {
        Utils.emptyContentDiv([".content"]);
    },
    createView() {
        let template = DOMUtils.createElementFromHTML(HomePageTemplate);

        // $("")

        document.querySelector(".content").style.backgroundColor = "#E8E8E8";
        let homepage_wrapper = document.querySelector(".homepage-wrapper");
        if (homepage_wrapper == null) {
            document.querySelector(".content").appendChild(template);

            HomePage.displayRecentProject();
        }
    },

    displayRecentProject() {
        let wrapperList = document.querySelector(".recent-projects");

        wrapperList.appendChild(DOMUtils.createElementFromHTML(
            `<div>
                        <i class="fas fa-user-clock"></i>
                        Recent projects
                      </div>`
        ))

        wrapperList.appendChild(DOMUtils.createElementFromHTML(
            `<ul class="recent_project_list"></ul>`
        ))

        const projectList = recent_projects;
        let projectListDiv = document.querySelector(".recent_project_list");
        // console.log(projectListDiv)

        HomePage.getTopRecentProjects(projectList).forEach(project => {
            projectListDiv.appendChild(
                DOMUtils.createElementFromHTML(
                    `<li class="recent_project">
                                <b>${project.name}</b> 
                                <br>
                                <div class="pro-description">
                                    <div class="proj-info">Language: ${project.language}</div>
                                    <div class="proj-info">Update at: ${project.updated_at_string}</div>
                                </div>
                               </li>`
                )
            )
        });
    },
    getTopRecentProjects(recent_projects) {
        let topRecentProjects = [];

        let i = 0;
        let count = 5;

        recent_projects.forEach(project => {
            i++;
            if (i > count)  {
                return topRecentProjects;
            }
            let customizesProject = {};
            customizesProject.name = project.name;
            customizesProject.language = project.language;
            customizesProject.updated_at_string = project.updated_at.slice(0, 10).trim();
            customizesProject.updated_at = new Date(customizesProject.updated_at_string);
            customizesProject.name = project.name;

            topRecentProjects.push(customizesProject);

        })
        topRecentProjects.sort((a, b) => b.updated_at - a.updated_at);
        return topRecentProjects;
    }

}