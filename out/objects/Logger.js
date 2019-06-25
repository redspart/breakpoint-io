"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const fs_1 = require("fs");
function Log(message) {
    let breakpointConfigs = vscode.workspace.getConfiguration("breakpointIO");
    let workspace_path = vscode.workspace.workspaceFolders[0].uri.fsPath;
    breakpointConfigs.has("logPath");
    fs_1.appendFileSync(breakpointConfigs.has("logPath")
        ? breakpointConfigs["logPath"]
        : `${workspace_path}//.vscode/logs.txt`, message);
}
exports.Log = Log;
//# sourceMappingURL=Logger.js.map