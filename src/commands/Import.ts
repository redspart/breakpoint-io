import * as vscode from "vscode";
import { readFileSync } from "fs";
import * as ajv from "ajv";
import { BreakpointIO, Schema } from "../objects/BreakpointIO";
import { Log } from "../helpers/Logger";

export function ConvertToSourceBreakpoint(point: any, workspace_path: string) {
  return new vscode.SourceBreakpoint(
    new vscode.Location(
      vscode.Uri.file(`${workspace_path}${point.location}`),
      new vscode.Range(
        new vscode.Position(point.line[0].line, point.line[0].character),
        new vscode.Position(point.line[1].line, point.line[1].character)
      )
    ),
    point.enabled,
    point.condition,
    point.hitCondition,
    point.logMessage
  );
}

export function ImportBreakpoints() {
  try {
    let workspace_path = vscode.workspace.workspaceFolders![0].uri.fsPath;
    let breakpointsConfig = vscode.workspace.getConfiguration("breakpointIO");
  
    let breakpoints_json = readFileSync(
      breakpointsConfig !== undefined && breakpointsConfig.has("exportPath")
        ? breakpointsConfig["exportPath"]
        : `${workspace_path}//.vscode//breakpoints.json`,
      { encoding: "utf8" }
    );
    let customBreakpoints = <BreakpointIO[]>JSON.parse(breakpoints_json);
    let breakpoints = Array<vscode.Breakpoint>();
    let errors: string[] = [];


    let validator = new ajv();
    customBreakpoints.forEach(element => {
      let valid = validator.validate(Schema, element);
      if (!valid) {
        errors.push(validator.errorsText(validator.errors));
      } else {
        breakpoints.push(ConvertToSourceBreakpoint(element, workspace_path));
      }
    });
    vscode.debug.addBreakpoints(breakpoints);

    let base_message = `Found ${customBreakpoints.length} breakpoints`;

    if (errors.length > 0) {
      vscode.window.showErrorMessage(
        base_message +
          `\n However, ${
            errors.length
          } breakpoints where unable to load. Check the logs`
      );
      Log(errors);
    } else {
      vscode.window.showInformationMessage(
        base_message + ` and loaded ${breakpoints.length}`
      );
    }
  } catch (e) {
    vscode.window.showInformationMessage(e);
    Log(e);
  }
}
