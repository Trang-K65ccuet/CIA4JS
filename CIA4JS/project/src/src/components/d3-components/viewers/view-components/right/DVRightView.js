import VIEW_CONFIG_VARIABLES from "../../../config/ViewConfig";
import * as d3 from 'd3';

import DVGraphDataManager from '../../../../data-manager/dependency-graph/DVGraphDataManager'
import {Notifier} from "../../../../utils/NotiUltils";
import CentralView from "../CentralView";
import {VIEW_IDS} from "../central/CentralViewTabs";
import {VCGraphData} from "../../../../data-manager/version-compare-graph/VCGraphData";
import DVGraphData from "../../../../data-manager/dependency-graph/DVGraphData";
import SubDVGraphData from "../../../../data-manager/dependency-graph/SubDVGraphData";
import {DOMUtils} from "../../../../utils/DOMUtils";
import ViewConfig from "../../../config/ViewConfig";
import ImpactDataManager from "../../../../data-manager/impact/ImpactDataManager";
import Utils from "../../../../utils/BasicUltils";
import CiaAPI from "../../../../../api/CiaAPI";
import ToastTemplate from "../../../../common/toast/ToastTemplate";
import { resolveFSPath } from "@babel/plugin-transform-runtime/lib/get-runtime-path";

const OPTION_NUMS = 6;

const DVRightView = {

    createView: function (dependencyGraph) {
        this.filterMode = dependencyGraph.filterMode;

        // // console.log(DependenceListView.filterMode)
        DVRightView.createTitle();

        DVRightView.createContent();

        DVRightView.addEventDVDropDownBtn();
    },
    createTitle: function () {
        let dependencyListDiv = document.querySelector(".dv-right-view");

        if (dependencyListDiv) {
            dependencyListDiv.appendChild(
                DOMUtils.createElementFromHTML(`
                <div class="dropdown dv-right-view-dd">
                  <button class="btn btn-sm btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false"></button>
                  <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                    <li id="dependency-list-opt">
                      <span class="dropdown-item">View dependency list</span>
                    </li>
                    <li id="change-impact-opt">
                      <span class="dropdown-item">View change/impact set</span>
                    </li>
                  </ul>
                </div>
                `)
            )
            dependencyListDiv.appendChild(DOMUtils.createElementFromHTML(
                `
                    <div class="right-view-title dv-right-view-title" id="dv-right-view-title">Dependency list</div>
                `
            ))
        }
    },

    addEventDVDropDownBtn() {
        document.getElementById('dependency-list-opt')
            .addEventListener('click', (event) => {
                DVRightView.changeToDependencyListView();
            });

        document.getElementById('change-impact-opt')
            .addEventListener('click', (event) => {
                DVRightView.changeToChangeImpactView();
            });
    },
    changeToDependencyListView() {
        document.getElementById('dependency-list-content').style.display = "";
        document.getElementById('change-impact-content').style.display = "none";
        document.getElementById('dv-right-view-title').innerHTML = "Dependency list view"
    },
    changeToChangeImpactView() {
        document.getElementById('dependency-list-content').style.display = "none";
        document.getElementById('change-impact-content').style.display = "";
        document.getElementById('dv-right-view-title').innerHTML = "Change / Impact set view"
    },
    createContent() {
        let dependencyListDiv = document.querySelector(".dv-right-view");
        if (dependencyListDiv) {
            dependencyListDiv.appendChild(DOMUtils.createElementFromHTML(
                `
                    <div class="dependency-list-content" id="dependency-list-content">
                    </div>
                `
            ));

            document.getElementById('dependency-list-content').style.display = "";

            dependencyListDiv.appendChild(DOMUtils.createElementFromHTML(
                `
                    <div class="change-impact-content" id="change-impact-content">
                    </div>
                `
            ));
            document.getElementById('change-impact-content').style.display = "none";
            this.createChangeImpactView();
        }
    },

    createChangeImpactView() {
        let changeImpactView = document.getElementById('change-impact-content');
        if (changeImpactView) {
            changeImpactView.appendChild(DOMUtils.createElementFromHTML(
                `
               <div class="change-impact-view" id="dv-change-set-view">
                    <div class="change-impact-view-title">
                        <div>
                            <span><i class="bi bi-square-fill" style="color: ${ViewConfig.FULLGRAPH_CONFIG.CHANGED_COLOR}"></i></span>
                            <b>Change set</b>
                        </div>
                    </div>
                    <div class="change-impact-view-nodes" id="dv-change-view-nodes">
                        
                    </div>
               </div>
              `
            ));

            this.updateChangeViewNodes()

            changeImpactView.appendChild(DOMUtils.createElementFromHTML(
                `
               <div class="change-impact-view" id="dv-impact-set-view">
                   <div class="change-impact-view-title">
                        <div class="dv-impact-set-title">
                            <span><i class="bi bi-square-fill" style="color: ${ViewConfig.FULLGRAPH_CONFIG.IMPACT_COLOR}"></i></span>
                            <b>Impact set</b>
                            <div id="get-impact-set-btn" class="badge bg-success"><i class="bi bi-search"></i></div>
                        </div>
                        <div id="export-impact-set-btn" class="badge bg-success">Export</div>
                   </div>
                   <div class="change-impact-view-nodes" id="dv-impact-view-nodes">
                       
                   </div>
               </div>
              `
            ));
            DVRightView.addGetImpactSetEvent();
            DVRightView.addExportBtnEvent();
        }
    },

    addGetImpactSetEvent() {
        let getImpactSetBtn = document.getElementById('get-impact-set-btn');
        if (getImpactSetBtn) {
            getImpactSetBtn.addEventListener('click', (event) => {
                let changeNodeList = Array.from(ImpactDataManager.changeSet.keys());
                if (changeNodeList.length > 0) {

                    let query = {
                        dependencies: ImpactDataManager.dependencies,
                        javaNodes: ImpactDataManager.javaNodes,
                        totalNodes:ImpactDataManager.totalNodes,
                        changedNodes: changeNodeList
                    }
                    let a;
                    CiaAPI.getImpactNodes(query)
                        .then(res => {
                            a = res.nodes;
                            Utils.emptyContentDiv(['#dv-impact-view-nodes']);
                            DVRightView.resetColorOfImpactNodes();
                            res.nodes.sort(function(a,b){return a.id-b.id});
                            res.nodes.forEach(node => {
                                let nodeData = DVGraphData.graphData.includesIdsMap.get(node.id).data;
                                ImpactDataManager.impactSet.set(node.id, nodeData);
                                let nodeView = DVGraphData.graph.getNodeViewById(node.id)
                                    .select(".title");

                                nodeView.attr("fill", ViewConfig.FULLGRAPH_CONFIG.IMPACT_COLOR);
                            })

                            DVRightView.updateImpactViewNodes();
                        })
                        .catch(error => {
                            // console.log(error)
                            ToastTemplate.emptyToast();
                            ToastTemplate.addToast("Error while getting impact nodes");
                            ToastTemplate.showToast();
                        });
                        console.log(a)
                } else {
                    Utils.emptyContentDiv(['#dv-impact-view-nodes']);
                    DVRightView.resetColorOfImpactNodes()
                    // console.log("changeSet is empty!")
                }
            })
        } else {
            // console.log('get-impact-set-btn not found!');
        }
    },

    addExportBtnEvent() {
        let exportBtn = document.getElementById('export-impact-set-btn');

        if (exportBtn) {
            exportBtn.addEventListener('click', event => {
                let impactNodes = Array.from(ImpactDataManager.impactSet.values());

                if (impactNodes.length > 0) {
                    let csvData = DVRightView.convertDataToCsv(Array.from(impactNodes));

                    const blob = new Blob([csvData], { type: 'text/csv' });

                    // Creating an object for downloading url
                    const url = window.URL.createObjectURL(blob)

                    // Creating an anchor(a) tag of HTML
                    const a = document.createElement('a')

                    // Passing the blob downloading url
                    a.setAttribute('href', url)

                    // Setting the anchor tag attribute for downloading
                    // and passing the download file name
                    a.setAttribute('download', 'ImpactSet.csv');

                    // Performing a download with click
                    a.click()
                } else {
                    ToastTemplate.emptyToast();
                    ToastTemplate.addToast("Impact set is empty!");
                    ToastTemplate.showToast();
                }
            })
        }
    },

    convertDataToCsv(data) {
        let csv = "Id, Entity class, Depth, Weight, Simple name, Qualified name, Unique name, Dependency to node, Dependency from node\n";
        data.forEach(node => {
            csv = csv.concat(node.id, ",")
            csv = csv.concat(node.entityClass.replace(/,/g,";"), ",")
            csv = csv.concat(node.depth, ",")
            csv = csv.concat(node.weight, ",")
            csv = csv.concat(node.simpleName.replace(/,/g,";"), ",")
            csv = csv.concat(node.qualifiedName.replace(/,/g,";"), ",")
            csv = csv.concat(node.uniqueName.replace(/,/g,";"), ",")
            csv = csv.concat(node.dependencyTo.map(item => {
                return item.node.uniqueName.replace(/,/g,";")
            }).join(";"), ",")
            csv = csv.concat(node.dependencyFrom.map(item => {
                return item.node.uniqueName.replace(/,/g,";")
            }).join(";"), ",")
            csv = csv.concat("\n")
        })
        return csv
    },

    resetColorOfImpactNodes() {
        let impactNodeList = Array.from(ImpactDataManager.impactSet.keys());
        impactNodeList.forEach(nodeId => {
            let nodeView = DVGraphData.graph.getNodeViewById(nodeId)
                .select(".title");

            nodeView.attr("fill", ViewConfig.FULLGRAPH_CONFIG.TITLE_COLOR);
        })
        ImpactDataManager.impactSet = new Map();
    },

    updateChangeViewNodes() {
        Utils.emptyContentDiv(['#dv-change-view-nodes']);

        let changeViewDiv = document.getElementById('dv-change-view-nodes');
        if (changeViewDiv) {
            let changeNodes = Array.from(ImpactDataManager.changeSet.values());

            changeNodes.forEach(changeNode => {
                changeViewDiv.appendChild(DOMUtils.createElementFromHTML(
                    `
                  <div class="dv-change-impact-node dv-change-node" id="dv-change-node-${changeNode.data.id}">
                    <div class="dv-change-impact-node-title-container dv-change-node-title-container">
                        <div class="dv-change-impact-node-title dv-change-node-title">${changeNode.data.simpleName}</div>
                        <div class="dv-change-impact-node-btn dv-change-node-btn">
                            <button class="btn node-btn node-search-btn" type="button" id="dv-change-node-search-${changeNode.data.id}">
                                <i class="bi bi-geo-alt-fill"></i>
                            </button>
                            <button class="btn node-btn node-info-btn" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${changeNode.data.id}" aria-expanded="false" aria-controls="collapse${changeNode.data.id}">
                                <i class="bi bi-info-circle-fill"></i>
                            </button>
                            <button class="btn node-btn node-close-btn" type="button" id="dv-change-remove-${changeNode.data.id}">
                                <i class="bi bi-x-circle-fill"></i>
                            </button>
                        </div>
                    </div>
                     <div class="collapse node-btn dv-change-node-content" id="collapse${changeNode.data.id}">
                          <div class="card card-body p-2 mt-2">
                           <div><b>Simple name: </b>${(changeNode.data.simpleName !== null) ? changeNode.data.simpleName : "No information"}</div>
                           <div><b>Qualified name: </b>${(changeNode.data.qualifiedName !== null) ? changeNode.data.qualifiedName : "No information"}</div>
                           <div><b>Node type: </b>${(changeNode.data.entityClass !== null) ? changeNode.data.entityClass : "No information"}</div>
                          </div>
                       </div>
                  </div>
                  `
                ));

                DVRightView.addRemoveChangeNodeEvent(changeNode);
                let nodeDivId = `dv-change-node-search-${changeNode.data.id}`;
                DVRightView.addSearchNodeEvent(nodeDivId, changeNode.data.id);
            })
        }
    },

    updateImpactViewNodes() {
        Utils.emptyContentDiv(['#dv-impact-view-nodes']);

        let impactViewDiv= document.getElementById('dv-impact-view-nodes');
        if (impactViewDiv) {
            let impactNodes = Array.from(ImpactDataManager.impactSet.values());

            impactNodes.forEach(impactNode => {
                impactViewDiv.appendChild(DOMUtils.createElementFromHTML(
                    `
                  <div class="dv-change-impact-node dv-impact-node" id="dv-impact-node-${impactNode.id}">
                    <div class="dv-change-impact-node-title-container dv-change-node-title-container">
                        <div class="dv-change-impact-node-title dv-change-node-title">${impactNode.simpleName}</div>
                        <div class="dv-change-impact-node-btn dv-change-node-btn">
                            <button class="btn node-btn node-search-btn" type="button" id="dv-impact-node-search-${impactNode.id}">
                                <i class="bi bi-geo-alt-fill"></i>
                            </button>
                            <button class="btn node-btn node-info-btn" 
                                    type="button" data-bs-toggle="collapse" 
                                    data-bs-target="#collapse${impactNode.id}" 
                                    aria-expanded="false" 
                                    aria-controls="collapse${impactNode.id}"
                            >
                                <i class="bi bi-info-circle-fill"></i>
                            </button>
                        </div>
                    </div>
                     <div class="collapse node-btn dv-change-node-content" id="collapse${impactNode.id}">
                          <div class="card card-body p-2 mt-2">
                           <div><b>Simple name: </b>${(impactNode.simpleName !== null) ? impactNode.simpleName : "No information"}</div>
                           <div><b>Qualified name: </b>${(impactNode.qualifiedName !== null) ? impactNode.qualifiedName : "No information"}</div>
                           <div><b>Node type: </b>${(impactNode.entityClass !== null) ? impactNode.entityClass : "No information"}</div>
                          </div>
                       </div>
                  </div>
                  `
                ));
                let nodeDivId = `dv-impact-node-search-${impactNode.id}`;
                DVRightView.addSearchNodeEvent(nodeDivId, impactNode.id);
            })
        }
    },

    addSearchNodeEvent(nodeDivId, nodeId) {
        let searchBtn = document.getElementById(nodeDivId);
        if (searchBtn) {
            searchBtn.addEventListener('click', (event) => {
                DVGraphData.graph.expandNodeByNodesMap(nodeId);
                DVGraphData.graph.updateFullLinks();
            })
        }
    },

    addRemoveChangeNodeEvent(changeNode) {
        let removeChangeNodeBtn = document.getElementById(`dv-change-remove-${changeNode.data.id}`);
        if (removeChangeNodeBtn) {
            removeChangeNodeBtn.addEventListener('click', (event) => {
                let removedChangeNode = document.getElementById(`dv-change-node-${changeNode.data.id}`);
                if (removedChangeNode) {
                    ImpactDataManager.changeSet.delete(changeNode.data.id);
                    removedChangeNode.remove();

                    let nodeView = DVGraphData.graph.getNodeViewById(changeNode.data.id);
                    nodeView.select(".title").attr("fill", ViewConfig.FULLGRAPH_CONFIG.TITLE_COLOR);
                } else {
                    // console.log(`dv-change-node-${changeNode.data.id} not found!`);
                }
            })
        } else {
            // console.log(`dv-change-remove-${changeNode.data.id} not found!`);
        }
    },

    updateDependencyList: function (linkData) {
        if (linkData !== undefined) {
            DVRightView.generateDependencyList(linkData);
        }
    },

    closeAllDependencies() {
        let accordionItems = document.querySelectorAll(".accordion-item");

        accordionItems.forEach(item => {
            let itemBtn = item.querySelector("button");
            if (!itemBtn.classList.contains("collapsed")) {
                itemBtn.classList.add("collapsed");
            }
            let accordionCollapse = item.querySelector(".accordion-collapse");
            if (accordionCollapse.classList.contains("show")) {
                accordionCollapse.classList.remove("show");
            }
        })
    },
    openDependency(sourceId, destId) {
        let accordionItems = document.getElementById(`dp-${sourceId}-${destId}`);

        let itemBtn = accordionItems.querySelector("button");
        if (itemBtn.classList.contains("collapsed")) {
            itemBtn.classList.remove("collapsed");
        }

        let accordionCollapse = accordionItems.querySelector(".accordion-collapse");
        if (!accordionCollapse.classList.contains("show")) {
            accordionCollapse.classList.add("show");
        }
    },
    generateDependencyList: function (linkData) {
        $(".dependency-list-content").empty();

        let content = d3.select(".dependency-list-content");

        if (linkData.length > 0) {
            let dependencyList = content.append('div').attr("class", "accordion");
            linkData.forEach((link, i) => {
                let dependency = dependencyList.append("div")
                    .attr("class", "accordion-item")
                    .attr("id", `dp-${link.source.data.id}-${link.destination.data.id}`);

                let languageInput = localStorage.getItem('language');

                if(languageInput == "java") {
                    dependency.html(DVRightView.generateContentOfEachDependency(link, i));
                } else {
                    dependency.html(DVRightView.generateContentOfEachDependencyForCSharp(link, i));
                }

                DVRightView.addShowInnerDependencyEvent(link);

                dependency.on("mouseover mouseout", function (e) {
                    if (e.type === "mouseover") {
                        e.stopPropagation();
                        DVRightView.highlightDependency(link);
                    } else if (e.type === "mouseout") {
                        e.stopPropagation();
                        DVRightView.unHighlightDependencies();
                    }
                })
            });
        } else {
            content.html("No dependency to show");
        }
    },

    addShowInnerDependencyEvent(link) {
        let inheritanceBadge = document.getElementById(`dp-${link.source.data.id}-${link.destination.data.id}-inheritance`);
        if (inheritanceBadge) {
            inheritanceBadge.addEventListener('click', event => {
                let innerDependency = inheritanceBadge.parentElement.querySelector(".inner-dependency");

                if (innerDependency && innerDependency.childNodes.length === 0) {
                    let filterLink = link.innerDependencies.filter(innerLink => innerLink.weight.inheritance > 0);

                    filterLink.forEach(innerLink => {
                        innerDependency.appendChild(DOMUtils.createElementFromHTML(`
                        <div class="inner-dependency-link">
                            <span class="badge inner-dependency-badge">
                               <b>${innerLink.fromNode.simpleName}</b>
                             </span>
                             <i class="fa-solid fa-arrow-right fa-1x"></i>
                             <span class="badge inner-dependency-badge">
                               <b>${innerLink.toNode.simpleName}</b>
                               <br>
                            </span>
                            <b>: ${innerLink.weight.inheritance}</b>
                        </div>
                        `));
                    })
                } else {
                    innerDependency.innerHTML = "";
                }
            })
        }

        let invocationBadge = document.getElementById(`dp-${link.source.data.id}-${link.destination.data.id}-invocation`);
        if (invocationBadge) {
            invocationBadge.addEventListener('click', event => {
                let innerDependency = invocationBadge.parentElement.querySelector(".inner-dependency");

                if (innerDependency && innerDependency.childNodes.length === 0) {
                    let filterLink = link.innerDependencies.filter(innerLink => innerLink.weight.invocation > 0);

                    filterLink.forEach(innerLink => {
                        innerDependency.appendChild(DOMUtils.createElementFromHTML(`
                        <div class="inner-dependency-link">
                            <span class="badge inner-dependency-badge">
                               <b>${innerLink.fromNode.simpleName}</b>
                             </span>
                             <i class="fa-solid fa-arrow-right fa-1x"></i>
                             <span class="badge inner-dependency-badge">
                               <b>${innerLink.toNode.simpleName}</b>
                               <br>
                            </span>
                            <b>: ${innerLink.weight.invocation}</b>
                        </div>
                        `));
                    })
                } else {
                    innerDependency.innerHTML = ""
                }
            })
        }

        let memberBadge = document.getElementById(`dp-${link.source.data.id}-${link.destination.data.id}-member`);
        if (memberBadge) {
            memberBadge.addEventListener('click', event => {
                let innerDependency = memberBadge.parentElement.querySelector(".inner-dependency");

                if (innerDependency && innerDependency.childNodes.length === 0) {
                    let filterLink = link.innerDependencies.filter(innerLink => innerLink.weight.member > 0);

                    filterLink.forEach(innerLink => {
                        innerDependency.appendChild(DOMUtils.createElementFromHTML(`
                        <div class="inner-dependency-link">
                            <span class="badge inner-dependency-badge">
                               <b>${innerLink.fromNode.simpleName}</b>
                             </span>
                             <i class="fa-solid fa-arrow-right fa-1x"></i>
                             <span class="badge inner-dependency-badge">
                               <b>${innerLink.toNode.simpleName}</b>
                               <br>
                            </span>
                            <b>: ${innerLink.weight.member}</b>
                        </div>
                        `));
                    })
                } else {
                    innerDependency.innerHTML = ""
                }
            })
        }

        let useBadge = document.getElementById(`dp-${link.source.data.id}-${link.destination.data.id}-use`);
        if (useBadge) {
            useBadge.addEventListener('click', event => {
                let innerDependency = useBadge.parentElement.querySelector(".inner-dependency");

                if (innerDependency && innerDependency.childNodes.length === 0) {
                    let filterLink = link.innerDependencies.filter(innerLink => innerLink.weight.use > 0);

                    filterLink.forEach(innerLink => {
                        innerDependency.appendChild(DOMUtils.createElementFromHTML(`
                        <div class="inner-dependency-link">
                            <span class="badge inner-dependency-badge">
                               <b>${innerLink.fromNode.simpleName}</b>
                             </span>
                             <i class="fa-solid fa-arrow-right fa-1x"></i>
                             <span class="badge inner-dependency-badge">
                               <b>${innerLink.toNode.simpleName}</b>
                               <br>
                            </span>
                            <b>: ${innerLink.weight.use}</b>
                        </div>
                        `));
                    })
                } else {
                    innerDependency.innerHTML = ""
                }
            })
        }

        let overrideBadge = document.getElementById(`dp-${link.source.data.id}-${link.destination.data.id}-override`);
        if (overrideBadge) {
            overrideBadge.addEventListener('click', event => {
                let innerDependency = overrideBadge.parentElement.querySelector(".inner-dependency");

                if (innerDependency && innerDependency.childNodes.length === 0) {
                    let filterLink = link.innerDependencies.filter(innerLink => innerLink.weight.override > 0);

                    filterLink.forEach(innerLink => {
                        innerDependency.appendChild(DOMUtils.createElementFromHTML(`
                        <div class="inner-dependency-link">
                            <span class="badge inner-dependency-badge">
                               <b>${innerLink.fromNode.simpleName}</b>
                             </span>
                             <i class="fa-solid fa-arrow-right fa-1x"></i>
                             <span class="badge inner-dependency-badge">
                               <b>${innerLink.toNode.simpleName}</b>
                               <br>
                            </span>
                            <b>: ${innerLink.weight.override}</b>
                        </div>
                        `));
                    })
                } else {
                    innerDependency.innerHTML = "";
                }
            })
        }

        let springBadge = document.getElementById(`dp-${link.source.data.id}-${link.destination.data.id}-spring`);
        if (springBadge) {
            springBadge.addEventListener('click', event => {
                let innerDependency = springBadge.parentElement.querySelector(".inner-dependency");

                if (innerDependency && innerDependency.childNodes.length === 0) {
                    let filterLink = link.innerDependencies.filter(innerLink => innerLink.weight.spring > 0);

                    filterLink.forEach(innerLink => {
                        innerDependency.appendChild(DOMUtils.createElementFromHTML(`
                        <div class="inner-dependency-link">
                            <span class="badge inner-dependency-badge">
                               <b>${innerLink.fromNode.simpleName}</b>
                             </span>
                             <i class="fa-solid fa-arrow-right fa-2x"></i>
                             <span class="badge inner-dependency-badge">
                               <b>${innerLink.toNode.simpleName}</b>
                               <br>
                            </span>
                            <b>: ${innerLink.weight.spring}</b>
                        </div>
                        `));
                    })
                } else {
                    innerDependency.innerHTML = "";
                }
            })
        }

        let jsfBadge = document.getElementById(`dp-${link.source.data.id}-${link.destination.data.id}-jsf`);
        if (jsfBadge) {
            jsfBadge.addEventListener('click', event => {
                let innerDependency = jsfBadge.parentElement.querySelector(".inner-dependency");

                if (innerDependency && innerDependency.childNodes.length === 0) {
                    let filterLink = link.innerDependencies.filter(innerLink => innerLink.weight.jsf > 0);

                    filterLink.forEach(innerLink => {
                        innerDependency.appendChild(DOMUtils.createElementFromHTML(`
                        <div class="inner-dependency-link">
                            <span class="badge inner-dependency-badge">
                               <b>${innerLink.fromNode.simpleName}</b>
                             </span>
                             <i class="fa-solid fa-arrow-right fa-2x"></i>
                             <span class="badge badge-primary">
                               <b>${innerLink.toNode.simpleName}</b>
                               <br>
                            </span>
                            <b>: ${innerLink.weight.jsf}</b>
                        </div>
                        `));
                    })
                } else {
                    innerDependency.innerHTML = "";
                }
            })
        }

    },

    generateContentOfEachDependency: function (link, i) {
        let htmlContent = ``;
        htmlContent += `
         <h2 class="accordion-header" id="panelsStayOpen-heading${i}">
           <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapse${i}" aria-expanded="false" aria-controls="panelsStayOpen-collapse${i}">
             <span class="badge badge-primary">From</a>
               <b>${link.source.data.simpleName}</b>
             </span>
             <i class="fa-solid fa-arrow-right fa-2x"></i>
             <span class="badge badge-primary">To</a>
               <b>${link.destination.data.simpleName}</b>
               <br>
             </span>
           </button>
         </h2>
         <div id="panelsStayOpen-collapse${i}" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-heading${i}">
           <div class="accordion-body" style="color:black;">
             <div class="dependency-header">
               <b>Weight:</b>
             </div>
             <div class="dependency-weight">
               <div class="dependency-weight-item">
                 <span class="badge badge-pill badge-inheritance" id="dp-${link.source.data.id}-${link.destination.data.id}-inheritance" style="background-color: #3a89de">inheritance</span>
                 <b>${link.weight.inheritance}</b>
                 <div class="inner-dependency"></div>
               </div>
               <div class="dependency-weight-item">
                 <span class="badge badge-pill badge-invocation" id="dp-${link.source.data.id}-${link.destination.data.id}-invocation" style="background-color: #563D7C">invocation</span>
                 <b>${link.weight.invocation}</b>
                 <div class="inner-dependency"></div>
               </div>
               <div class="dependency-weight-item">
                 <span class="badge badge-pill badge-override" id="dp-${link.source.data.id}-${link.destination.data.id}-override" style="background-color: #17A2B8">override</span>
                 <b>${link.weight.override}</b>
                 <div class="inner-dependency"></div>
               </div>
               <div class="dependency-weight-item">
                 <span class="badge badge-pill badge-member" id="dp-${link.source.data.id}-${link.destination.data.id}-member" style="background-color: #B15B2E">member</span>
                 <b>${link.weight.member}</b>
                 <div class="inner-dependency"></div>
               </div>
               <div class="dependency-weight-item">
                 <span class="badge badge-pill badge-use" id="dp-${link.source.data.id}-${link.destination.data.id}-use" style="background-color: #A92835">use</span>
                 <b>${link.weight.use}</b>
                 <div class="inner-dependency"></div>
               </div>
               <div class="dependency-weight-item">
                 <span class="badge badge-pill badge-spring" id="dp-${link.source.data.id}-${link.destination.data.id}-spring" style="background-color: #28A745">
                   <i class="fa-solid fa-leaf"></i> spring </span> <b>${link.weight.spring}</b>
                   <div class="inner-dependency"></div>
               </div>
               <div class="dependency-weight-item">
                 <span class="badge badge-pill badge-jsf" id="dp-${link.source.data.id}-${link.destination.data.id}-jsf"  style="background-color: #F1A62B">
                   <svg style="margin-right: 5px" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                     <g fill="none" fill-rule="evenodd">
                       <polygon fill="#62B543" fill-opacity=".7" points="1 16 16 16 16 9 1 9" />
                       <polygon fill="#9AA7B0" fill-opacity=".8" points="7 1 3 5 7 5" />
                       <polygon fill="#9AA7B0" fill-opacity=".8" points="8 1 8 6 3 6 3 8 13 8 13 1" />
                       <path fill="#231F20" fill-opacity=".7" d="M1.39509277,3.58770752 C1.62440186,3.83789062 1.83782861,4 2.28682861,4 C2.81318359,4 3,3.58770752 3,3.29760742 L3,0 L4,0 L4,3.58770752 C4,4.31964111 3.32670898,5 2.45,5 C1.629,5 1.15,4.76264111 0.8,4.31964111 L1.39509277,3.58770752 Z" transform="translate(1 10)" />
                       <path fill="#231F20" fill-opacity=".7" d="M0.972767969,1.50152588 C0.972767969,1.13305664 1.284,1 1.845,1 C1.85033333,1 2.23533333,1 3,1 L3,0 C2.26266667,0 1.88266667,0 1.86,0 C0.778,0 0,0.45916748 0,1.45 C0,2.31452637 0.419555664,2.69049072 1.47125244,2.91607666 C2.24158869,3.08131157 2.496155,3.22862939 2.496155,3.548 C2.496155,3.86737061 2.13842773,4 1.47125244,4 C1.46058577,4 1.07016829,4 0.3,4 L0.3,5 C1.07550163,5 1.46591911,5 1.47125244,5 C3.5,5 3.5,4 3.5,3.548 C3.5,2.91607666 3.02026367,2.42071533 2.15869141,2.14685059 C1.29711914,1.87298584 0.972767969,1.86999512 0.972767969,1.50152588 Z" transform="translate(6 10)" />
                       <polygon fill="#231F20" fill-opacity=".7" points="1 1.001 3 1.001 3 0 0 0 0 5 1 5 1 3 2.8 3 2.8 2 1 2" transform="translate(10 10)" />
                     </g>
                   </svg>jsf </span> <b>${link.weight.jsf}</b>
                   <div class="inner-dependency"></div>
               </div>
             </div>
           </div>
         </div>
        `
        return htmlContent;
    },

    generateContentOfEachDependencyForCSharp: function (link, i) {
        let htmlContent = ``;
        htmlContent += `
         <h2 class="accordion-header" id="panelsStayOpen-heading${i}">
           <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapse${i}" aria-expanded="false" aria-controls="panelsStayOpen-collapse${i}">
             <span class="badge badge-primary">From</a>
               <b>${link.source.data.simpleName}</b>
             </span>
             <i class="fa-solid fa-arrow-right fa-2x"></i>
             <span class="badge badge-primary">To</a>
               <b>${link.destination.data.simpleName}</b>
               <br>
             </span>
           </button>
         </h2>
         <div id="panelsStayOpen-collapse${i}" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-heading${i}">
           <div class="accordion-body" style="color:black;">
             <div class="dependency-header">
               <b>Weight:</b>
             </div>
             <div class="dependency-weight">
               <div class="dependency-weight-item">
                 <span class="badge badge-pill badge-inheritance" id="dp-${link.source.data.id}-${link.destination.data.id}-inheritance" style="background-color: #3a89de">inheritance</span>
                 <b>${link.weight.inheritance}</b>
                 <div class="inner-dependency"></div>
               </div>
               <div class="dependency-weight-item">
                 <span class="badge badge-pill badge-invocation" id="dp-${link.source.data.id}-${link.destination.data.id}-invocation" style="background-color: #563D7C">invocation</span>
                 <b>${link.weight.invocation}</b>
                 <div class="inner-dependency"></div>
               </div>
               <div class="dependency-weight-item">
                 <span class="badge badge-pill badge-override" id="dp-${link.source.data.id}-${link.destination.data.id}-override" style="background-color: #17A2B8">override</span>
                 <b>${link.weight.override}</b>
                 <div class="inner-dependency"></div>
               </div>
               <div class="dependency-weight-item">
                 <span class="badge badge-pill badge-member" id="dp-${link.source.data.id}-${link.destination.data.id}-member" style="background-color: #B15B2E">member</span>
                 <b>${link.weight.member}</b>
                 <div class="inner-dependency"></div>
               </div>
               <div class="dependency-weight-item">
                 <span class="badge badge-pill badge-use" id="dp-${link.source.data.id}-${link.destination.data.id}-use" style="background-color: #A92835">use</span>
                 <b>${link.weight.use}</b>
                 <div class="inner-dependency"></div>
               </div>
             </div>
           </div>
         </div>
        `
        return htmlContent;
    },

    highlightDependency: function (linkData) {
        let links;

        switch (CentralView.currentViewId) {
            case VIEW_IDS.DEPENDENCY_VIEW_ID:
                links = DVGraphData.graph.links;
                break;
            case VIEW_IDS.VERSION_COMPARE_ID:
                links = VCGraphData.graph.links;
                break
            case VIEW_IDS.SUB_DEPENDENCY_VIEW_ID:
                if (SubDVGraphData.graphData !== null && SubDVGraphData.graph !== null) {
                    links = SubDVGraphData.graph.links;
                }
                break
            case VIEW_IDS.SUB_DEPENDENCY_VIEW_IMPACT_ID:
                if (SubDVGraphData.graphData !== null && SubDVGraphData.graph !== null) {
                    links = SubDVGraphData.graph.links;
                }
                break
        }
        // // console.log(linkId);

        links.filter(link => (link.source.data.id === linkData.source.data.id &&
            link.destination.data.id === linkData.destination.data.id))
            .attr('stroke', VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.HIGHLIGHT_STROKE_COLOR)
            .attr("marker-end", "url(#highlight-arrow)");

        links.filter(link => (link.source.data.id !== linkData.source.data.id ||
            link.destination.data.id !== linkData.destination.data.id))
            .style("opacity", 0.1);

    },
    unHighlightDependencies: function () {
        let links;
        switch (CentralView.currentViewId) {
            case VIEW_IDS.DEPENDENCY_VIEW_ID:
                links = DVGraphData.graph.links;
                break;
            case VIEW_IDS.VERSION_COMPARE_ID:
                links = VCGraphData.graph.links;
                break
            case VIEW_IDS.SUB_DEPENDENCY_VIEW_ID:
                if (SubDVGraphData.graphData !== null && SubDVGraphData.graph !== null) {
                    links = SubDVGraphData.graph.links;
                }
                break;
            case VIEW_IDS.SUB_DEPENDENCY_VIEW_IMPACT_ID:
                if (SubDVGraphData.graphData !== null && SubDVGraphData.graph !== null) {
                    links = SubDVGraphData.graph.links;
                }
                break;
        }

        links.attr('stroke', VIEW_CONFIG_VARIABLES.FULLGRAPH_CONFIG.LINE_STROKE_COLOR)
            .attr("marker-end", "url(#end-arrow-fullgraph)");

        links.style("opacity", 1);

    },

};

export default DVRightView;