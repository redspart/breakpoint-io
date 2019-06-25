import * as vscode from "vscode";
import { ExportBreakpoints } from "./commands/Export";
import { ImportBreakpoints } from "./commands/Import";

export function activate(context: vscode.ExtensionContext) {
  /*
   * Attempt to load the breakpionts when teh extension is first started
   * Seemst to fix the issue when the user attemps to export their breakpoints
   * for the first time.
   */
  vscode.debug.breakpoints;
  let breakpoints_export = vscode.commands.registerCommand(
    "extension.breakpoint_export",
    ExportBreakpoints
  );
  let breakpoints_load = vscode.commands.registerCommand(
    "extension.breakpoint_import",
    ImportBreakpoints
  );

  context.subscriptions.push(breakpoints_export);
  context.subscriptions.push(breakpoints_load);
}

// this method is called when your extension is deactivated
export function deactivate() {}
