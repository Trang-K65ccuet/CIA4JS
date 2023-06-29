import Utils from './BasicUltils';
import DVGraphDataManager from "../data-manager/dependency-graph/DVGraphDataManager";
import FileAPI from "../../api/FileAPI";
import {Notifier} from "./NotiUltils";
import CentralView from "../d3-components/viewers/view-components/CentralView";
import {VIEW_IDS} from "../d3-components/viewers/view-components/central/CentralViewTabs";
import DVGraphData from "../data-manager/dependency-graph/DVGraphData";
import { VCGraphData } from '../data-manager/version-compare-graph/VCGraphData';
import CentralViewDataManager from '../data-manager/central-view/CentralViewDataManager';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import 'monaco-editor/esm/vs/basic-languages/csharp/csharp.contribution';
import 'monaco-editor/esm/vs/basic-languages/java/java.contribution.js';

self.MonacoEnvironment = {
	getWorkerUrl: function (moduleId, label) {
		// if (label === 'json') {
		// 	return './json.worker.bundle.js';
		// }
		// if (label === 'css' || label === 'scss' || label === 'less') {
		// 	return './css.worker.bundle.js';
		// }
		// if (label === 'html' || label === 'handlebars' || label === 'razor') {
		// 	return './html.worker.bundle.js';
		// }
		// if (label === 'typescript' || label === 'javascript') {
		// 	return './ts.worker.bundle.js';
		// }
		return '/editor.worker.bundle.js';
	}
};

export let ViewUtils = {
    createLoading: function(){
        const htmlLoading = `<div class="loader-wrapper">
                                <span class="loader"><span class="loader-inner"></span></span>
                            </div>`;
        const body = document.querySelector(".content");
        const domLoading = Utils.createElementFromHTML(htmlLoading);
        body.appendChild(domLoading);
    },

    getSourceCodeDV(targetId) {
        let editor = document.getElementById("code-editor3");
        editor.innerHTML = "";
        editor.style.display = "block";
        let address = DVGraphData.graphData.includesIdsMap.get(targetId).data.path;
        // console.log(VCGraphData.graphData.includesIdsMap.get(targetId).data.path)
        if (address) {
            const filePath = {
                address: address,
            }
            let lang = 'java';
            if (address.endsWith('.cs'))
                lang = 'csharp';
            FileAPI.getFileContent(filePath).then((d) => {
                let content = d.fileContent.join('\n');
                monaco.editor.create(document.getElementById('code-editor3'), {
                    value: content,
                    language: lang,
                    readOnly: true
                });
            })
        } else {
            Notifier.displayError("Cannot get source for folder!")
        };
    },

    getSourceCodeVC(targetId) {
        let editor = document.getElementById("code-editor3");
        editor.innerHTML = "";
        editor.style.display = "block";
        let DVincludeIdsMap = DVGraphData.graphData.includesIdsMap;
        let VCincludeIdsMap = VCGraphData.graphData.includesIdsMap;
        let currentNodeData = VCincludeIdsMap.get(targetId).data;

        console.log(currentNodeData.uniqueName)

        let lang = 'java';
        if (currentNodeData.entityClass.startsWith("CS"))
            lang = 'csharp';
        
        // Find the nearest parent that is a file node
        while (lang === 'csharp' && currentNodeData.entityClass != 'CSFileNode') {
            currentNodeData = VCincludeIdsMap.get(currentNodeData.parent).data;
        }

        let addressNew = currentNodeData.path;
        let addressOld;
        for (let i = 0; i < DVincludeIdsMap.size; i++) {
            if (DVincludeIdsMap.get(i) !== undefined
                &&  DVincludeIdsMap.get(i).data.uniqueName === currentNodeData.uniqueName) {
                    addressOld = DVincludeIdsMap.get(i).data.path;
                    break;
                }
            }
            const filePathOld = {
                address: addressOld,
            }

            const filePathNew = {
                address: addressNew,
            }

            // let status = VCGraphData.graphData.includesIdsMap.get(targetId).data.status;
            let status = currentNodeData.status;

            if (status == 'deleted') {
                // Only get old content
                FileAPI.getFileContent(filePathOld).then(d => {
                    let oldContent = d.fileContent.join('\n');
                    const monacoEditor = monaco.editor.createDiffEditor(editor);
                    monacoEditor.setModel({
                        original: monaco.editor.createModel(oldContent, lang),
                        modified: monaco.editor.createModel("", lang),
                    });
                });
            } else if (status == 'added') {
                // Only get new content
                FileAPI.getFileContent(filePathNew).then(d => {
                    let newContent = d.fileContent.join('\n');
                    const monacoEditor = monaco.editor.createDiffEditor(editor, {
                        readOnly: true
                    });
                    monacoEditor.setModel({
                        original: monaco.editor.createModel("", lang),
                        modified: monaco.editor.createModel(newContent, lang),
                    });
                });
            } else {
                FileAPI.getFileContent(filePathOld).then(d1 => {
                    let oldContent = d1.fileContent.join('\n');
                    FileAPI.getFileContent(filePathNew).then(d2 => {
                        let newContent = d2.fileContent.join('\n');
                        const monacoEditor = monaco.editor.createDiffEditor(editor);
                        monacoEditor.setModel({
                            original: monaco.editor.createModel(oldContent, lang),
                            modified: monaco.editor.createModel(newContent, lang),
                        });
                    });
                });
            }
    },
    switchSourceCodeLayer() {
        let sourceCodeView = CentralView.getTab(VIEW_IDS.SOURCE_CODE_VIEW_ID);
        // console.log(sourceCodeView)
        if (sourceCodeView !== undefined && sourceCodeView.isContain) {
            CentralView.switchTab(VIEW_IDS.SOURCE_CODE_VIEW_ID);
        } else {
            // // console.log(sourceCodeView)
            CentralView.addTab(sourceCodeView);
        }
    }
}