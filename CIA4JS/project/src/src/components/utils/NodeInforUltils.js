import { invokeMap } from "lodash";

import VIEW_CONFIG_VARIABLES from "../d3-components/config/ViewConfig";
import JAVA_TYPE from "../d3-components/config/JavaType";

var NodeInforUltils = {};

NodeInforUltils.buildHtml = function (d, linkData) {
    let htmlContent = "";
    if (d == undefined)
        htmlContent += "<b> None </b>";

    else {
        htmlContent += `<b> ${(d.entityClass === JAVA_TYPE.JAVA_ROOT_NODE) ? "ROOT" : d.simpleName} </b> <br>
        - Node type: ${d.entityClass} <br>
        - Qualified name: ${d.qualifiedName} <br>
        - Unique name: ${d.uniqueName} <br>`;

        if (d.entityClass === JAVA_TYPE.JAVA_ROOT_NODE) {

        } else if (d.entityClass === JAVA_TYPE.JAVA_PACKAGE_NODE) {

            htmlContent += buildHtmlOfPackageNode(d);

        } else if (d.entityClass === JAVA_TYPE.JAVA_CLASS_NODE) {

            htmlContent += buildHtmlOfClassNode(d);

        } else if (d.entityClass === JAVA_TYPE.JAVA_INITIALIZER_NODE) {

            htmlContent += buildHtmlOfInitializerNode( d);

        } else if (d.entityClass === JAVA_TYPE.JAVA_INTERFACE_NODE) {

            htmlContent += buildHtmlOfInterfaceNode(d);

        } else if (d.entityClass === JAVA_TYPE.JAVA_ENUM_NODE) {

            htmlContent += buildHtmlOfEnumNode(d);

        } else if (d.entityClass === JAVA_TYPE.JAVA_METHOD_NODE) {

            htmlContent += buildHtmlOfMethodNode(d);
            
        } else if (d.entityClass === JAVA_TYPE.JAVA_FIELD_NODE) {

            htmlContent += buildHtmlOfFieldNode(d);

        }
        
    }
    htmlContent += buildHtmlOfDependencies(d, linkData);

    return htmlContent;
}

function buildHtmlOfPackageNode(d) {
    let htmlContent = '';
    return htmlContent;
}

function buildHtmlOfClassNode(d) {
    let htmlContent = `- Modifiers: `;
    if (d.modifiers.length > 0) {
        d.modifiers.forEach(m => 
            htmlContent += `<b>${m}</b> `
        )
    }
    htmlContent += '<br>';

    return htmlContent;
}

function buildHtmlOfInitializerNode(d) {
    let htmlContent = '';
    return htmlContent;
}

function buildHtmlOfInterfaceNode(d) {
    let htmlContent = '';
    htmlContent += `- Modifiers: `;
    if (d.modifiers.length > 0) {
        d.modifiers.forEach(m => 
            htmlContent += `<b>${m}</b> `
        )
    }
    htmlContent += '<br>';

    return htmlContent;
}

function buildHtmlOfEnumNode(d) {
    let htmlContent = '';
    return htmlContent;
}

function buildHtmlOfMethodNode(d) {
    let htmlContent = `- Modifiers: `;
    if (d.modifiers.length > 0) {
        d.modifiers.forEach(m => 
            htmlContent += `<b>${m}</b> `
        )
    }
    htmlContent += '<br>';

    let parameters = [];
    d.parameters.forEach(p => parameters.push(p));
    htmlContent += `- Parameters: ${parameters.length} paramenters <br>`;
    return htmlContent;
}

function buildHtmlOfFieldNode(d) {
    let htmlContent = '';
    htmlContent += `- Modifiers: `;
    if (d.modifiers.length > 0) {
        d.modifiers.forEach(m => 
            htmlContent += `<b>${m}</b> `
        )
    }
    htmlContent += '<br>';
    return htmlContent;
}

function buildHtmlOfDependencies(d, linkData) {
    let htmlContent = '';
    let dependenciesFrom = [], 
        dependenciesTo = [];

    linkData.forEach(function(link) {
        if (link.source.data.id == d.id) {
            let temp = {};
            temp.simpleName = link.destination.data.simpleName;
            temp.nodeType = link.destination.data.entityClass;
            // temp.typeDependency = link.typeDependency;
            dependenciesTo.push(temp);
        }
        if (link.destination.data.id == d.id) {
            let temp = {};
            temp.simpleName = link.source.data.simpleName;
            temp.nodeType = link.source.data.entityClass;
            // temp.typeDependency = oneLink.typeDependency;
            dependenciesFrom.push(temp);
        }
    });

    htmlContent += `<b> Dependencies from: ${dependenciesFrom.length} nodes</b> <br>`;

    dependenciesFrom.forEach(function(from) {
        htmlContent += `&nbsp +) ${from.simpleName}: ${from.nodeType} <br>`;
    });

    htmlContent += `<b> Dependencies to: ${dependenciesTo.length} nodes</b> <br>`;
    dependenciesTo.forEach(function(to) {
        htmlContent += `&nbsp +) ${to.simpleName}: ${to.nodeType} <br>`;
    });

    return htmlContent;
}

NodeInforUltils.convertNameToShorter = function (d, children) {
    // // console.log(children)
    let name;
    if (d.entityClass === "JavaPackageNode")  {
        name = "." + d.simpleName;
    } else if (d.entityClass === "JavaMethodNode")  {
        name = d.simpleName + "()";
    } else {
        name = d.simpleName;
    }
    if (name.length > 17 && children.length === 0)
        return name.substring(0, 17) + "...";
    else
        return name;
}


export default NodeInforUltils;