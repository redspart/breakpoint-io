import * as vscode from "vscode";
import { writeFileSync, appendFileSync, readFileSync } from "fs";

export function Log(message: string[]) {
  let breakpointConfigs = vscode.workspace.getConfiguration("breakpointIO");
  let workspace_path = vscode.workspace.workspaceFolders![0].uri.fsPath;
  breakpointConfigs.has("logPath");
  appendFileSync(
    breakpointConfigs !== undefined && breakpointConfigs.has("logPath")
      ? breakpointConfigs["logPath"]
      : `${workspace_path}//.vscode/logs.txt`,
    message
  );
}