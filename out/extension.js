"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const fs_1 = require("fs");
function breakpoint_export(context) {
    let breakpoints = vscode.debug.breakpoints;
    if (breakpoints.length > 0) {
        vscode.window.showInformationMessage(`Found ${breakpoints.length} - writing to a file now`);
        let workspace_path = vscode.workspace.workspaceFolders[0].uri.fsPath; // will always have a workspace open
        let workspace_uri_path = vscode.workspace.workspaceFolders[0].uri.path.length;
        try {
            let breakpoints_array = Array(breakpoints.length);
            breakpoints.forEach(element => {
                if (element !== undefined) {
                    let point = element;
                    let ex = new vscode.SourceBreakpoint(new vscode.Location(vscode.Uri.parse(`${point.location.uri.path.substring(workspace_uri_path)}`), point.location.range), element.enabled, element.condition, element.hitCondition, element.logMessage);
                    breakpoints_array.push(ex);
                }
            });
            let breakpoints_json = JSON.stringify(breakpoints_array, null, 2);
            fs_1.writeFileSync(`${workspace_path}\\.vscode\\breakpoints.json`, breakpoints_json, { encoding: "utf8" });
        }
        catch (err) {
            console.log(err);
        }
    }
    else {
        vscode.window.showErrorMessage("No breakpoints found");
    }
}
exports.breakpoint_export = breakpoint_export;
function breakpoint_load(context) {
    let workspace_path = vscode.workspace.workspaceFolders[0].uri.fsPath; // will always have a workspace open
    let breakpoints_json = fs_1.readFileSync(`${workspace_path}\\.vscode\\breakpoints.json`, { encoding: "utf8" });
    let breakpoints = JSON.parse(breakpoints_json);
    // let xx = new vscode.SourceBreakpoint();
    // vscode.debug.addBreakpoints(xx)
    console.log(breakpoints_json[0]);
}
exports.breakpoint_load = breakpoint_load;
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "breakpoint-io" is now active!');
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        vscode.window.showInformationMessage('Hello World!');
    });
    let breakpoint_ls = vscode.commands.registerCommand("extension.breakpoint_ls", () => {
        if (vscode.debug.breakpoints.length === 0) {
            vscode.window.showErrorMessage("Nothing to show");
        }
        else {
            vscode.window.showInformationMessage("got one!");
        }
    });
    let breakpoints_export = vscode.commands.registerCommand("extension.breakpoint_export", breakpoint_export);
    let breakpoints_load = vscode.commands.registerCommand("extension.breakpoint_load", breakpoint_load);
    context.subscriptions.push(disposable);
    context.subscriptions.push(breakpoint_ls);
    context.subscriptions.push(breakpoints_export);
    context.subscriptions.push(breakpoints_load);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map