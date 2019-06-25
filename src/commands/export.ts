import * as vscode from "vscode";
import { writeFileSync } from "fs";
import { BreakpointIO } from "../objects/BreakpointIO";
import { Log } from "../helpers/Logger";

export function CreateBreakPoint(point:any, workspace_uri_path_length:number){
  return new BreakpointIO(
    `${point.location.uri.path.substring(workspace_uri_path_length)}`,
      point.location.range,
      point.enabled,
      point.condition,
      point.hitCondition,
      point.logMessage
    );
}

export function ExportBreakpoints() {
  let breakpoints = vscode.debug.breakpoints;
  if (breakpoints.length > 0) {
    vscode.window.showInformationMessage(
      `Found ${breakpoints.length} - writing exporting now`
    );
    let workspace_path = vscode.workspace.workspaceFolders![0].uri.fsPath;
    let workspace_uri_path_length = vscode.workspace.workspaceFolders![0].uri.path
      .length;

    try {
      let breakpoints_array = Array<BreakpointIO>();
      breakpoints.forEach(element => {
        if (element !== undefined || element !== null) {
          let point = <vscode.SourceBreakpoint>element;
          breakpoints_array.push(CreateBreakPoint(point, workspace_uri_path_length));
        }
      });

      let breakpointsConfig = vscode.workspace.getConfiguration("breakpointIO");
      let breakpoints_json = JSON.stringify(breakpoints_array, null, 2);
      writeFileSync(
        breakpointsConfig !== undefined && breakpointsConfig.has("exportPath")
        ? breakpointsConfig["exportPath"]
        : `${workspace_path}//.vscode//breakpoints.json`,
        breakpoints_json,
        { encoding: "utf8" }
      );
    } catch (error) {
      Log(error);
    }
  } else {
    vscode.window.showErrorMessage(
      "No breakpoints found."
    );
  }
}
