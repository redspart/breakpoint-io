"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const fs_1 = require("fs");
const BreakpointIO_1 = require("../objects/BreakpointIO");
function breakpoint_export(context) {
    let breakpoints = vscode.debug.breakpoints;
    if (breakpoints.length > 0) {
        vscode.window.showInformationMessage(`Found ${breakpoints.length} - writing to a file now`);
        let workspace_path = vscode.workspace.workspaceFolders[0].uri.fsPath;
        let workspace_uri_path = vscode.workspace.workspaceFolders[0].uri.path
            .length;
        try {
            let breakpoints_array = Array();
            breakpoints.forEach(element => {
                if (element !== undefined || element !== null) {
                    let point = element;
                    let newElement = new BreakpointIO_1.BreakpointIO(`${point.location.uri.path.substring(workspace_uri_path)}`, point.location.range, point.enabled, point.condition, point.hitCondition, point.logMessage);
                    breakpoints_array.push(newElement);
                }
            });
            let breakpoints_json = JSON.stringify(breakpoints_array, null, 2);
            fs_1.writeFileSync(`${workspace_path}//.vscode//breakpoints.json`, breakpoints_json, { encoding: "utf8" });
        }
        catch (err) {
            console.log(err);
        }
    }
    else {
        vscode.window.showErrorMessage("No breakpoints found. If this is your first time attempting to export, please try again");
    }
}
exports.breakpoint_export = breakpoint_export;
//# sourceMappingURL=export.js.map