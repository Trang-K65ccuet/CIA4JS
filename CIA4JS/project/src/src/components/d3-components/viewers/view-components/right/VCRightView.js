import {DOMUtils} from "../../../../utils/DOMUtils";
import {VCGraphData} from "../../../../data-manager/version-compare-graph/VCGraphData";
import JAVA_TYPE from "../../../config/JavaType";
import XML_TYPE from "../../../config/XmlType";
import ContextMenuOption from "../../../../context-menu/ContextMenuOption";
import ViewConfig from "../../../config/ViewConfig";
import ToastTemplate from "../../../../common/toast/ToastTemplate";
import CS_TYPE from "../../../config/CSType";

const VCRightView = {
    createView(graph) {
        this.createTitle();
        this.displayNodeList();
    },
    createTitle: function () {
        this.createChangedNodeViewTitle();
        this.createAddedNodeViewTitle();
        this.createDeletedNodeViewTitle();
        this.createImpactNodeViewTitle();
    },
    createChangedNodeViewTitle() {
        let changedNodeView = document.querySelector(".changed-node-view");
        if (changedNodeView) {
            changedNodeView.appendChild(DOMUtils.createElementFromHTML(
                `<div class="right-view-title" id="changed-node-view-title"></div>`
            ));
            document.getElementById("changed-node-view-title").appendChild(
                DOMUtils.createElementFromHTML(`<div class="right-view-title-vc" id="changed-node-view-title-vc"></div>`)
            )
            document.getElementById("changed-node-view-title-vc").appendChild(
                DOMUtils.createElementFromHTML(`<div id="left-changed-node-view-title-vc"></div>`)
            )
            document.getElementById("left-changed-node-view-title-vc").appendChild(
                DOMUtils.createElementFromHTML(`<span><i class='bi bi-square-fill' style='color: ${ViewConfig.FULLGRAPH_CONFIG.CHANGED_COLOR}'></span>`)
            )
            document.getElementById("left-changed-node-view-title-vc").appendChild(
                DOMUtils.createElementFromHTML("<b>Change nodes</b>")
            )
            document.getElementById("changed-node-view-title-vc").appendChild(
                DOMUtils.createElementFromHTML(`<div id="export-changed-set-btn-vc" class="badge bg-success">Export</div>`)
            )
            VCRightView.addChangedNodeBtn();
        }
    },
    createAddedNodeViewTitle() {
        let addedNodeView = document.querySelector(".added-node-view");
        if (addedNodeView) {
            addedNodeView.appendChild(DOMUtils.createElementFromHTML(
                `<div class="right-view-title" id="added-node-view-title"></div>`
            ));
            document.getElementById("added-node-view-title").appendChild(
                DOMUtils.createElementFromHTML(`<div class="right-view-title-vc" id="added-node-view-title-vc"></div>`)
            )
            document.getElementById("added-node-view-title-vc").appendChild(
                DOMUtils.createElementFromHTML(`<div id="left-added-node-view-title-vc"></div>`)
            )
            document.getElementById("left-added-node-view-title-vc").appendChild(
                DOMUtils.createElementFromHTML(`<span><i class='bi bi-square-fill' style='color: ${ViewConfig.FULLGRAPH_CONFIG.ADDED_COLOR}'></i></span>`)
            )
            document.getElementById("left-added-node-view-title-vc").appendChild(
                DOMUtils.createElementFromHTML("<b>Added nodes</b>")
            )
            document.getElementById("added-node-view-title-vc").appendChild(
                DOMUtils.createElementFromHTML(`<div id="export-added-set-btn-vc" class ="badge bg-success">Export</div>`)
            )
            VCRightView.addAddedNodeBtn();
        }
    },
    createDeletedNodeViewTitle() {
        let deletedNodeView = document.querySelector(".deleted-node-view");
        if (deletedNodeView) {
            deletedNodeView.appendChild(DOMUtils.createElementFromHTML(
                `<div class="right-view-title" id="deleted-node-view-title"></div>`
            ));
            document.getElementById("deleted-node-view-title").appendChild(
                DOMUtils.createElementFromHTML(`<div class="right-view-title-vc" id="deleted-node-view-title-vc"></div>`)
            )
            document.getElementById("deleted-node-view-title-vc").appendChild(
                DOMUtils.createElementFromHTML("<div id='left-deleted-node-view-title-vc'></div>")
            )
            document.getElementById("left-deleted-node-view-title-vc").appendChild(
                DOMUtils.createElementFromHTML(`<span><i class='bi bi-square-fill' style='color: ${ViewConfig.FULLGRAPH_CONFIG.DELETED_COLOR}'></i></span>`)
            )
            document.getElementById("left-deleted-node-view-title-vc").appendChild(
                DOMUtils.createElementFromHTML("<b>Deleted nodes</b>")
            )
            document.getElementById('deleted-node-view-title-vc').appendChild(
                DOMUtils.createElementFromHTML(`<div id="export-deleted-set-btn-vc" class="badge bg-success">Export</div>`)
            )

            VCRightView.addDeletedNodeBtn();
        }
    },

    createImpactNodeViewTitle() {
        let impactNodeView = document.querySelector(".impact-node-view");
        if (impactNodeView) {
            impactNodeView.appendChild(DOMUtils.createElementFromHTML(
                `<div class="right-view-title" id="impact-node-view-title"></div>`
            ));
            document.getElementById("impact-node-view-title").appendChild(
                DOMUtils.createElementFromHTML(`<div class="right-view-title-vc" id="impact-node-view-title-vc"></div>`)
            )
            document.getElementById("impact-node-view-title-vc").appendChild(
                DOMUtils.createElementFromHTML(`<div id="left-impact-node-view-title-vc"></div>`)
            )
            document.getElementById("left-impact-node-view-title-vc").appendChild(
                DOMUtils.createElementFromHTML(`<span><i class='bi bi-square-fill' style='color: ${ViewConfig.FULLGRAPH_CONFIG.IMPACT_COLOR}'></i></span>`)
            )
            document.getElementById("left-impact-node-view-title-vc").appendChild(
                DOMUtils.createElementFromHTML("<b>Impact nodes</b>")
            )
            document.getElementById("impact-node-view-title-vc").appendChild(
                DOMUtils.createElementFromHTML(`<div id="export-impact-set-btn-vc" class="badge bg-success">Export</div>`)
            )
            VCRightView.addImpactNodeBtn();
        }
    },
    addDeletedNodeBtn() {
        let exportBtn = document.getElementById('export-deleted-set-btn-vc');
        if (exportBtn) {
            exportBtn.addEventListener('click', event => {
                let deletedNodes = VCGraphData.graphData.deletedNodes;
                if (deletedNodes.length > 0) {
                    let csvData = VCRightView.convertDataToCsv(Array.from(deletedNodes));

                    const blob = new Blob([csvData], {type: 'text/csv'});

                    const url = window.URL.createObjectURL(blob);

                    const a = document.createElement('a');

                    a.setAttribute('href', url);

                    a.setAttribute('download', 'DeletedSet.csv');

                    a.click();
                } else {
                    ToastTemplate.emptyToast();
                    ToastTemplate.addToast("Deleted set is empty!");
                    ToastTemplate.showToast();
                }
            })
        }
    },
    addAddedNodeBtn() {
        let exportBtn = document.getElementById('export-added-set-btn-vc');
        if (exportBtn) {
            exportBtn.addEventListener('click', event => {
                // console.log(VCGraphData.graphData.addedNodes);
                // let addedNodes = Array.from(VCGraphData.graphData.addedNodes.value());
                let addedNodes = VCGraphData.graphData.addedNodes;
                // console.log(addedNodes.length);
                if (addedNodes.length > 0) {
                    let csvData = VCRightView.convertDataToCsv(Array.from(addedNodes));

                    // console.log(csvData);
                    const blob = new Blob([csvData], {type: 'text/csv'});

                    const url = window.URL.createObjectURL(blob);

                    const a = document.createElement('a');

                    a.setAttribute('href', url);

                    a.setAttribute('download', 'AddedSet.csv');
                    // console.log(a);
                    a.click();
                } else {
                    ToastTemplate.emptyToast();
                    ToastTemplate.addToast("Added Set is empty");
                    ToastTemplate.showToast();
                }
            })
        }
    },
    addChangedNodeBtn() {
        let exportBtn = document.getElementById('export-changed-set-btn-vc');
        if (exportBtn) {
            exportBtn.addEventListener('click', event => {
                let changedNodes = VCGraphData.graphData.changedNodes;
                if (changedNodes.length > 0) {
                    let csvData = VCRightView.convertDataToCsv(Array.from(changedNodes));
                    const blob = new Blob([csvData], {type: 'text/csv'});

                    const url = window.URL.createObjectURL(blob);

                    // Creating an anchor(file) tag of HTML
                    const a = document.createElement('a');

                    // Passing the blob downloading url
                    a.setAttribute('href', url);

                    //setting the anchor tag attribute for downloading
                    //and passing the download file name
                    a.setAttribute('download', 'ChangedSet.csv');

                    //Performing a download with click
                    a.click();
                } else {
                    ToastTemplate.emptyToast();
                    ToastTemplate.addToast("Changed set is empty!");
                    ToastTemplate.showToast();
                }
            })
        }
    },
    addImpactNodeBtn() {
        let exportBtn = document.getElementById('export-impact-set-btn-vc');
        if (exportBtn) {
            exportBtn.addEventListener('click', event => {
                let impactNodesData = Array.from(VCGraphData.graphData.impactedNodesMap.values());
                // console.log(impactNodesData[0].data)

                var impactNodes = [];
                impactNodesData.forEach(res => {
                    impactNodes.push(res.data);
                });
                // console.log(impactNodes)
                if (impactNodes.length > 0) {
                    let csvData = VCRightView.convertDataToCsv(Array.from(impactNodes));
                    const blob = new Blob([csvData], {type: 'text/csv'});

                    const url = window.URL.createObjectURL(blob);

                    // Creating an anchor(a) tag of HTML
                    const a = document.createElement('a');

                    // Passing the blob downloading url
                    a.setAttribute('href', url);

                    //setting the anchor tag attribute for downloading
                    //and passing the download file name
                    a.setAttribute('download', 'ImpactSet.csv');

                    //Performing a download with click
                    a.click();
                } else {
                    ToastTemplate.emptyToast();
                    ToastTemplate.addToast("Impact set is empty");
                    ToastTemplate.showToast();
                }
            })
        }
    },
    convertDataToCsv(data) {
        let csv = "Id, Entity class, Depth, Weight, Simple name, Qualified name, Unique name, Dependency to node, Dependency from node\n";
        data.forEach(node => {
            // console.log(node.uniqueName)
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

    displayNodeList() {
        this.displayChangedNodeList();
        this.displayAddedNodeList();
        this.displayDeletedNodeList();
        this.displayImpactNodes();
    },
    displayAddedNodeList() {
        let addedNodeView = document.querySelector(".added-node-view"),
            addedNodeList;
        if (addedNodeView) {
            addedNodeList = addedNodeView.appendChild(DOMUtils.createElementFromHTML(
                `<div class="right-view-node-list accordion" id="added-node-list"></div>`
            ));

            VCGraphData.graphData.addedNodes.forEach(node => {
                let nodeDiv = DOMUtils.createElementFromHTML(
                    `
                <div class="accordion-item vc-node" id="added-accordion-item-${node.id}">
                    <h2 class="accordion-header" id="node${node.id}">
                      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${node.id}" aria-expanded="true" aria-controls="collapse${node.id}">
                           <span class="${VCRightView.getNodeTypeIcon(node.entityClass)}"></span>
                           <span>${node.entityClass === JAVA_TYPE.JAVA_INITIALIZER_NODE ? '<init>' : node.simpleName}</span>
                       </button>
                    </h2>
                    <div id="collapse${node.id}" class="accordion-collapse collapse" aria-labelledby="node${node.id}" data-bs-parent="#added-node-list">
                      <div class="accordion-body">
                           <div><b>Simple name: </b>${(node.simpleName !== null) ? node.simpleName : "No information"}</div>
                           <div><b>Qualified name: </b>${(node.qualifiedName !== null) ? node.qualifiedName : "No information"}</div>
                           <div><b>Node type: </b>${(node.entityClass !== null) ? node.entityClass : "No information"}</div>
                           <div>
                                <b>Modifiers: </b>
                                <span class="${VCRightView.getModifierTypeIcon(node.modifiers)}"></span>
                                ${(node.modifiers !== null) ? node.modifiers[0] : "No information"}
                          </div>
                      </div>
                    </div>
                 </div>
                `
                );

                // nodeDiv.addEventListener("click" , (event) => {
                //     VCGraphData.graph.expandNodeByNodesMap(node.id)
                // })
                $.contextMenu({
                    selector: `#added-accordion-item-${node.id}`,
                    className: `right-view-context`,
                    callback: function (key, options) {
                        switch (key) {
                            case "open_graph_directly":
                                VCGraphData.graph.expandNodeByNodesMap(node.id);
                                VCGraphData.graph.updateFullLinks();
                                break;
                        }
                    },
                    items: ContextMenuOption.VC_RIGHT_VIEW_OPTIONS
                });

                addedNodeList.appendChild(nodeDiv)
            })
        }
    },
    displayChangedNodeList() {
        let changedNodeView = document.querySelector(".changed-node-view"),
            changedNodeList;
        if (changedNodeView) {
            changedNodeList = changedNodeView.appendChild(DOMUtils.createElementFromHTML(
                `<div class="right-view-node-list accordion" id="changed-node-list"></div>`
            ));

            VCGraphData.graphData.changedNodes.forEach(node => {
                let nodeDiv = DOMUtils.createElementFromHTML(
                    `
                <div class="accordion-item vc-node" id = "changed-accordion-item-${node.id}">
                    <h2 class="accordion-header" id="node${node.id}">
                      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${node.id}" aria-expanded="true" aria-controls="collapse${node.id}">
                           <span class="${VCRightView.getNodeTypeIcon(node.entityClass)}"></span>
                           <span>${node.entityClass === JAVA_TYPE.JAVA_INITIALIZER_NODE ? '<init>' : node.simpleName}</span>
                       </button>
                    </h2>
                    <div id="collapse${node.id}" class="accordion-collapse collapse" aria-labelledby="node${node.id}" data-bs-parent="#changed-node-list">
                      <div class="accordion-body">
                           <div><b>Simple name: </b>${(node.simpleName !== null) ? node.simpleName : "No information"}</div>
                           <div><b>Qualified name: </b>${(node.qualifiedName !== null) ? node.qualifiedName : "No information"}</div>
                           <div><b>Node type: </b>${(node.entityClass !== null) ? node.entityClass : "No information"}</div>
                           <div>
                                <b>Modifiers: </b>
                                <span class="${VCRightView.getModifierTypeIcon(node.modifiers)}"></span>
                                ${(node.modifiers !== null) ? node.modifiers[0] : "No information"}
                          </div>
                      </div>
                    </div>
                 </div>
                `
                );

                // nodeDiv.addEventListener("click" , (event) => {
                //     VCGraphData.graph.expandNodeByNodesMap(node.id)
                // })
                $.contextMenu({
                    selector: `#changed-accordion-item-${node.id}`,
                    className: `right-view-context`,
                    callback: function (key, options) {
                        switch (key) {
                            case "open_graph_directly":
                                VCGraphData.graph.expandNodeByNodesMap(node.id)
                                VCGraphData.graph.updateFullLinks();
                                break;
                        }
                    },
                    items: ContextMenuOption.VC_RIGHT_VIEW_OPTIONS
                });

                changedNodeList.appendChild(nodeDiv);
            })
        }
    },
    displayDeletedNodeList() {
        let deletedNodeView = document.querySelector(".deleted-node-view"),
            deletedNodeList
        ;
        if (deletedNodeView) {
            deletedNodeList = deletedNodeView.appendChild(DOMUtils.createElementFromHTML(
                `<div class="right-view-node-list accordion" id="deleted-node-list"></div>`
            ));

            VCGraphData.graphData.deletedNodes.forEach(node => {
                let nodeDiv = DOMUtils.createElementFromHTML(
                    `
                <div class="accordion-item vc-node" id="deleted-accordion-item-${node.id}">
                    <h2 class="accordion-header" id="node${node.id}">
                      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${node.id}" aria-expanded="false" aria-controls="collapse${node.id}">
                           <span class="${VCRightView.getNodeTypeIcon(node.entityClass)}"></span>
                           <span>${node.entityClass === JAVA_TYPE.JAVA_INITIALIZER_NODE ? 'init' : node.simpleName}</span>
                       </button>
                    </h2>
                    <div id="collapse${node.id}" class="accordion-collapse collapse" aria-labelledby="node${node.id}" data-bs-parent="#deleted-node-list">
                      <div class="accordion-body p-3">
                           <div><b>Simple name: </b>${(node.simpleName !== null) ? node.simpleName : "No information"}</div>
                           <div><b>Qualified name: </b>${(node.qualifiedName !== null) ? node.qualifiedName : "No information"}</div>
                           <div><b>Node type: </b>${(node.entityClass !== null) ? node.entityClass : "No information"}</div>
                           <div>
                                <b>Modifiers: </b>
                                <span class="${VCRightView.getModifierTypeIcon(node.modifiers)}"></span>
                                ${(node.modifiers !== null) ? node.modifiers[0] : "No information"}
                          </div>
                      </div>
                    </div>
                 </div>
                `
                );
                // nodeDiv.addEventListener("click" , (event) => {
                //     VCGraphData.graph.expandNodeByNodesMap(node.id)
                // })

                $.contextMenu({
                    selector: `#deleted-accordion-item-${node.id}`,
                    className: `right-view-context`,
                    callback: function (key, options) {
                        switch (key) {
                            case "open_graph_directly":
                                VCGraphData.graph.expandNodeByNodesMap(node.id)
                                VCGraphData.graph.updateFullLinks();
                                break;
                        }
                    },
                    items: ContextMenuOption.VC_RIGHT_VIEW_OPTIONS
                });

                deletedNodeList.appendChild(nodeDiv);
            })
        }
    },
    displayImpactNodes() {
        let impactNodeView = document.querySelector(".impact-node-view"),
            impactNodeListDiv
        ;
        if (impactNodeView) {
            impactNodeListDiv = impactNodeView.appendChild(DOMUtils.createElementFromHTML(
                `<div class="right-view-node-list accordion" id="impact-node-list"></div>`
            ));

            let impactNodeList = Array.from(VCGraphData.graphData.impactedNodesMap.values());

            impactNodeList.forEach(node => {
                let nodeDiv = DOMUtils.createElementFromHTML(
                    `
                <div class="accordion-item vc-node" id="impact-accordion-item-${node.data.id}">
                    <h2 class="accordion-header" id="impact-node${node.data.id}">
                      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#impact-collapse${node.data.id}" aria-expanded="false" aria-controls="impact-collapse${node.data.id}">
                           <span class="${VCRightView.getNodeTypeIcon(node.data.entityClass)}"></span>
                           <span>${node.data.entityClass === JAVA_TYPE.JAVA_INITIALIZER_NODE ? 'init' : node.data.simpleName}</span>
                       </button>
                    </h2>
                    <div id="impact-collapse${node.data.id}" class="accordion-collapse collapse" aria-labelledby="impact-node${node.data.id}" data-bs-parent="#impact-node-list">
                      <div class="accordion-body p-3">
                           <div><b>Simple name: </b>${(node.data.simpleName !== null) ? node.data.simpleName : "No information"}</div>
                           <div><b>Qualified name: </b>${(node.data.qualifiedName !== null) ? node.data.qualifiedName : "No information"}</div>
                           <div><b>Node type: </b>${(node.data.entityClass !== null) ? node.data.entityClass : "No information"}</div>
                           <div>
                                <b>Modifiers: </b>
                                <span class="${VCRightView.getModifierTypeIcon(node.data.modifiers)}"></span>
                                ${(node.data.modifiers !== null) ? node.data.modifiers[0] : "No information"}
                          </div>
                      </div>
                    </div>
                 </div>
                `
                );
                // nodeDiv.addEventListener("click" , (event) => {
                //     VCGraphData.graph.expandNodeByNodesMap(node.id)
                // })

                $.contextMenu({
                    selector: `#impact-accordion-item-${node.data.id}`,
                    className: `right-view-context`,
                    callback: function (key, options) {
                        switch (key) {
                            case "open_graph_directly":
                                VCGraphData.graph.expandNodeByNodesMap(node.data.id)
                                VCGraphData.graph.updateFullLinks();
                                break;
                        }
                    },
                    items: ContextMenuOption.VC_RIGHT_VIEW_OPTIONS
                });

                impactNodeListDiv.appendChild(nodeDiv);
            })
        }
    },
    getNodeTypeIcon(entityName) {
        let rs = "";
        switch (entityName) {
        //Java icon
            case JAVA_TYPE.JAVA_ROOT_NODE:
                rs = "root-node-type";
                break;
            case JAVA_TYPE.JAVA_PACKAGE_NODE:
                rs = "package-node-type";
                break;
            case JAVA_TYPE.JAVA_CLASS_NODE:
                rs = "class-node-type";
                break;
            case JAVA_TYPE.JAVA_METHOD_NODE:
                rs = "method-node-type";
                break;
            case JAVA_TYPE.JAVA_FIELD_NODE:
                rs = "field-node-type"
                break;
            case JAVA_TYPE.JAVA_INTERFACE_NODE:
                rs = "interface-node-type";
                break;
            case JAVA_TYPE.JAVA_ENUM_NODE:
                rs = "enum-node-type";
                break;
            case JAVA_TYPE.JAVA_INITIALIZER_NODE:
                rs = "initialize-node-type";
                break;
            case XML_TYPE.XML_FILE_NODE:
                rs = "xml-file-node-type";
                break;
            case XML_TYPE.XML_TAG_NODE:
                rs = "xml-tag-node-type";
                break;
            // CSharp icon 
            case CS_TYPE.CS_ROOT_NODE:
                rs = "root-node-type";
                break;
            case CS_TYPE.CS_FOLDER_NODE:
                rs = "root-node-type";
                break;
            case CS_TYPE.CS_FILE_NODE:
                rs = "cs-file-node-type";
                break;
            case CS_TYPE.CS_CLASS_NODE:
                rs = "class-node-type";
                break;
            case CS_TYPE.CS_STRUCT_NODE:
                rs = "struct-node-type";
                break;
            case CS_TYPE.CS_INTERFACE_NODE:
                rs = "interface-node-type";
                break;
            case CS_TYPE.CS_ENUM_NODE:
                rs = "enum-node-type";
                break;
            case CS_TYPE.CS_EVENT_FIELD_NODE:
                rs = "event-node-type";
                break;
            case CS_TYPE.CS_DELEGATE_NODE:
                rs = "delegate-node-type";
                break;
            case CS_TYPE.CS_PROPERTY_NODE:
                rs = "property-node-type";
                break;
            case CS_TYPE.CS_FIELD_NODE:
                rs = "field-node-type";
                break;
            case CS_TYPE.CS_METHOD_NODE:
                rs = "method-node-type";
                break;
            case CS_TYPE.CS_LOCAL_FUNCTION_NODE:
                rs = "cs-local-function-node-type";
                break;  
        }
        return rs;
    },
    getModifierTypeIcon(modifiers) {
        let rs = "";
        if (modifiers !== null) {
            let modifier = modifiers[0];
            switch (modifier) {
                case "PUBLIC":
                    rs = "public-modifier";
                    break;
                case "PROTECTED":
                    rs = "protected-modifier";
                    break;
                case "PRIVATE":
                    rs = "private-modifier";
                    break;
            }
        }
        return rs;
    },
}
export default VCRightView;