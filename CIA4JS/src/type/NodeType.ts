export enum NodeType {
    Root = "JSRootNode",
    Folder = "JSFolderNode",
    File = "JSFileNode",
    Class = "JSClassNode",
    Function = "JSFunctionNode",
    Enum = "JSEnumNode",
    Interface = "JSInterfaceNode",
    Property = "JSPropertyNode",
    Method = "JSMethodNode",
    Variable = "JSVariableNode",
    Constructor = "JSConstructorNode",

    //Node for create dependency
    Call = "Call",
    TypeReference = "TypeReference",
    Inheritance = "Inheritance",
    New ="New",

    Import = "Import",
}
