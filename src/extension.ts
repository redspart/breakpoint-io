// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { writeFileSync, readFileSync } from "fs";

export function breakpoint_export(context: vscode.ExtensionContext){
	let breakpoints = vscode.debug.breakpoints;
	if(breakpoints.length > 0){
		vscode.window.showInformationMessage(`Found ${breakpoints.length} - writing to a file now`);
		let workspace_path = vscode.workspace.workspaceFolders![0].uri.fsPath; // will always have a workspace open
		let workspace_uri_path = vscode.workspace.workspaceFolders![0].uri.path.length;

		try{
			let breakpoints_array = Array<vscode.SourceBreakpoint>(breakpoints.length);
			breakpoints.forEach(element => {
				if(element !== undefined){ 
					let point = <vscode.SourceBreakpoint> element;
					let ex = new vscode.SourceBreakpoint(
						new vscode.Location(
							vscode.Uri.parse(`${point.location.uri.path.substring(workspace_uri_path)}`),
							point.location.range
						),
						element.enabled,
						element.condition,
						element.hitCondition,
						element.logMessage,
					);
					breakpoints_array.push(ex);
				}
			});
	
			let breakpoints_json = JSON.stringify(breakpoints_array, null, 2);
			writeFileSync(`${workspace_path}\\.vscode\\breakpoints.json`, breakpoints_json, {encoding:"utf8"});
		} catch (err){
			console.log(err);
		}
		
	} else {
		vscode.window.showErrorMessage("No breakpoints found");
	}
}

export function breakpoint_load(context: vscode.ExtensionContext){
	let workspace_path = vscode.workspace.workspaceFolders![0].uri.fsPath; // will always have a workspace open
	let breakpoints_json = readFileSync(`${workspace_path}\\.vscode\\breakpoints.json`, {encoding:"utf8"});
	let breakpoints = JSON.parse(breakpoints_json);

	// let xx = new vscode.SourceBreakpoint();
	// vscode.debug.addBreakpoints(xx)

	console.log(breakpoints_json[0]);
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

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
		if(vscode.debug.breakpoints.length === 0){
			vscode.window.showErrorMessage("Nothing to show");
		} else {
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

// this method is called when your extension is deactivated
export function deactivate() {}
