"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const fs_1 = require("fs");
const ajv = require("ajv");
const BreakpointIO_1 = require("../objects/BreakpointIO");
const Logger_1 = require("../objects/Logger");
function ConvertToSourceBreakpoint(point) {
    let workspace_path = vscode.workspace.workspaceFolders[0].uri.fsPath;
    return new vscode.SourceBreakpoint(new vscode.Location(vscode.Uri.file(`${workspace_path}${point.location}`), new vscode.Range(new vscode.Position(point.line[0].line, point.line[0].character), new vscode.Position(point.line[1].line, point.line[1].character))), point.enabled, point.condition, point.hitCondition, point.logMessage);
}
function breakpoint_import(context) {
    let workspace_path = vscode.workspace.workspaceFolders[0].uri.fsPath;
    let breakpoints_json = fs_1.readFileSync(`${workspace_path}//.vscode//breakpoints.json`, { encoding: "utf8" });
    let customBreakpoints = JSON.parse(breakpoints_json);
    let breakpoints = Array();
    let errors = [];
    try {
        let validator = new ajv();
        customBreakpoints.forEach(element => {
            let valid = validator.validate(BreakpointIO_1.Schema, element);
            if (!valid) {
                errors.push(validator.errorsText(validator.errors));
            }
            else {
                breakpoints.push(ConvertToSourceBreakpoint(element));
            }
        });
        vscode.debug.addBreakpoints(breakpoints);
        let base_message = `Found ${customBreakpoints.length} breakpoints`;
        if (errors.length > 0) {
            vscode.window.showErrorMessage(base_message +
                `\n However, ${errors.length} breakpoints where unable to load. Check the logs`);
            Logger_1.Log(errors);
        }
        else {
            vscode.window.showInformationMessage(base_message + `and loaded ${breakpoints.length}`);
        }
    }
    catch (e) {
        vscode.window.showInformationMessage(e);
        Logger_1.Log(e);
    }
}
exports.breakpoint_import = breakpoint_import;
//# sourceMappingURL=import.js.map