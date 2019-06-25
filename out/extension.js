"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const export_1 = require("./commands/export");
const import_1 = require("./commands/import");
function activate(context) {
    /*
     * Attempt to load the breakpionts when teh extension is first started
     * Seemst to fix the issue when the user attemps to export their breakpoints
     * for the first time.
     */
    vscode.debug.breakpoints;
    let breakpoints_export = vscode.commands.registerCommand("extension.breakpoint_export", export_1.breakpoint_export);
    let breakpoints_load = vscode.commands.registerCommand("extension.breakpoint_import", import_1.breakpoint_import);
    context.subscriptions.push(breakpoints_export);
    context.subscriptions.push(breakpoints_load);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map