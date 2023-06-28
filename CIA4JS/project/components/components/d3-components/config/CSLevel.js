import CS_TYPE from "./CSType";

const CS_LEVEL = {
  lv1: [CS_PROJECT_NODE, CS_ROOT_NODE],
  lv2: [CS_FOLDER_NODE],
  lv3: [CS_FILE_NODE, 
            CS_CLASS_NODE],
  lv4: [CS_PROPERTY_NODE, 
            CS_METHOD_NODE, 
            CS_FIELD_NODE, 
            CS_ENUM_NODE],
};