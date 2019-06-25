import vscode = require("vscode");
import { doesNotReject } from "assert";

export const Path: string = "/home";

export const Point = {
  "location": "/python.py",
  "line": [
    {
      "line": 5,
      "character": 0
    },
    {
      "line": 5,
      "character": 0
    }
  ],
  "enabled": true,
  "condition": "x==1"
};

export const SourceBreakpoint =
new vscode.SourceBreakpoint(
  new vscode.Location(
    vscode.Uri.file("/python.py"),
    new vscode.Range(
      new vscode.Position(5,0),
      new vscode.Position(5,0)
    )
  ),
  true,
  "x==1"
);

export function  // Modified from here
// https://github.com/microsoft/vscode-mssql/blob/ddc8977ade0087c563bba5294a793f4e5a4afadc/test/stubs.ts#L63
  createWorkspaceConfiguration(items: {[key: string]: any}, workspaceItems?: {[key: string]: any}): vscode.WorkspaceConfiguration {
    const result: vscode.WorkspaceConfiguration = {
        has(key: string): boolean {
            return items[key] !== 'undefined';
        },
        get<T>(key: string, defaultValue?: T): T {
            let val = items[key];
            if (typeof val === 'undefined') {
                val = defaultValue;
            }
            return val;
        },
        inspect<T>(section: string): { key: string; defaultValue?: T; globalValue?: T; workspaceValue?: T } | undefined {
          return undefined;
        },
        update(section: string, value: any, global?: boolean): Thenable<void> {
            items[section] = value;
            return Promise.resolve();
        }
    };
  
    // Copy properties across so that indexer works as expected
    Object.keys(items).forEach((key) => {
        result.update(key, items[key]);
    });
    return result;
  }


export class WorkspaceMock {
  workspaceFolders?: WorkspaceFoldersMock[];
  workspaceConfig?: vscode.WorkspaceConfiguration;

  getConfiguration(config: string){
    return undefined;
  }

  constructor(
    workspaceFolders?: WorkspaceFoldersMock[]
  ){
    this.workspaceFolders = workspaceFolders;
  }
}

export class WorkspaceFoldersMock {
  uri?:vscode.Uri;

  constructor(
    uri?:vscode.Uri
  ){
    this.uri = uri;
  }
}