import FromGitFormEvent from "../upload/from-source-code/FromGitFormEvent";
import {DV_GRAPH_CONTEXT_OPT} from "../d3-components/viewers/view-components/central/ContextMenu";

const ContextMenuOption = {
    DV_BRANCH_OPTION: {
        dv: {
            name: "Set project",
            icon: "code",
        },
        getCommit: {
            name: "Get commits",
            icon: "code",
        }
    },
    DV_COMMIT_OPTION: {
        dv: {
            name: "Set project",
            icon: "code",
        }
    },
    BRANCH_VERSION_OPTION: {
        old: {
            name: "Set old version",
            icon: "code",
        },
        new: {
            name: "Set new version",
            icon: "code"
        },
        getCommit: {
            name: "Get commits",
            icon: "code",
        }
    },
    COMMIT_VERSION_OPTION: {
        old: {
            name: "Set old version",
            icon: "code",
        },
        new: {
            name: "Set new version",
            icon: "code"
        },
    },
    DV_GRAPH_CONTEXT_OPTION1: {
        source_code: {
            name: "Open source code"
        },
        new_graph: {
            name: "View detail graph"
        },
        add_change_set: {
            name: "Add to change set"
        }
    },
    DV_GRAPH_CONTEXT_OPTION2: {
        new_graph: {
            name: "View detail graph"
        },
        add_change_set: {
            name: "Add to change set"
        }
    },
    SUB_DV_GRAPH_CONTEXT_OPTION1: {
        source_code: {
            name: "Open source code"
        },
        new_graph: {
            name: "View detail graph"
        },
    },
    SUB_DV_GRAPH_CONTEXT_OPTION2: {
        new_graph: {
            name: "View detail graph"
        },
    },

    VC_RIGHT_VIEW_OPTIONS: {
        "open_graph_directly" : {
            name : "Open node on graph"
        },
    }
}

export default ContextMenuOption;