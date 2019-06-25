"use strict";
import * as assert from "assert";
import * as vscode from "vscode";
import * as exportIO from "../src/commands/Export";
import * as log from "../src/helpers/Logger";
import { SourceBreakpoint, Path, WorkspaceMock, WorkspaceFoldersMock, Point, createWorkspaceConfiguration } from "./stubs";
import * as fs from "fs";
import * as sinon from "sinon";
import { resolve } from "url";


describe("Export tests", function() {
  let Sandbox: sinon.SinonSandbox;
  let WorkspaceMockValue: WorkspaceMock;

  beforeEach(async() => {   
    Sandbox = sinon.createSandbox();
    WorkspaceMockValue = new WorkspaceMock([new WorkspaceFoldersMock(vscode.Uri.file(Path))]);
    Sandbox.stub(vscode, "workspace").value(WorkspaceMockValue);
    vscode.debug.addBreakpoints([SourceBreakpoint]);
  });

  afterEach(async() => {
    Sandbox.restore();
    vscode.debug.removeBreakpoints(vscode.debug.breakpoints);
  });

  it("CreateBreakPoint - Returns BreakpointIO", function() {
    // setup
    
    // act
    let ret = exportIO.CreateBreakPoint(SourceBreakpoint, 0);

    // assert
    assert.equal("/python.py", ret.location);
    assert.equal(SourceBreakpoint.location.range.start.line, ret.line.start.line);
    assert.equal(SourceBreakpoint.location.range.end.line, ret.line.end.line);
    assert.equal(SourceBreakpoint.enabled, ret.enabled);
    assert.equal(SourceBreakpoint.condition, ret.condition);
  });

  
  it("ExportBreakpoints - should export to default path", function() {
    // setup
    let writer = Sandbox.stub(fs, "writeFileSync");
    let mockInformationMessages = Sandbox.stub(vscode.window, "showInformationMessage");

    // Act
    exportIO.ExportBreakpoints();

    // Assert
    assert(writer.calledOnce);
    assert(Point, writer.getCall(0).args[1]);

    assert(mockInformationMessages.calledOnce);
    assert("Found 1 breakpoint - exporting now", mockInformationMessages.getCall(0).args[0]);
    assert(Path, <string> writer.getCall(0).args[0]);
  });

  it("ExportBreakpoints - should export to config path", function(done){
    // setup
    let writer = Sandbox.stub(fs, "writeFileSync");
    let mockInformationMessages = Sandbox.stub(vscode.window, "showInformationMessage");
    let config: {[key: string]: any} = {"exportPath": "\\CustomPath"};
    let mockWorkspaceConfig = Sandbox.stub(vscode.workspace, "getConfiguration").returns(createWorkspaceConfiguration(config));

    // Act
    exportIO.ExportBreakpoints();

    // Assert
    assert(mockWorkspaceConfig.calledOnce);

    assert(writer.calledOnce);
    assert(Point, writer.getCall(0).args[1]);
    assert("\\CustomPath", <string> writer.getCall(0).args[0]);

    assert(mockInformationMessages.calledOnce);
    assert("Found 1 breakpoint - exporting now", mockInformationMessages.getCall(0).args[0]);
    assert("\\CustomPath", mockInformationMessages.getCall(0).args[0]);

    done();
  });

  it("ExportBreakpoints - doesn't find any breakpoints", function() {
    // setup
    vscode.debug.removeBreakpoints(vscode.debug.breakpoints);
    let mockErrorMessages = Sandbox.stub(vscode.window, "showErrorMessage");
    let mockInformationMessages = Sandbox.stub(vscode.window, "showInformationMessage");

    // Act
    exportIO.ExportBreakpoints();

    // Assert
    assert(mockInformationMessages.notCalled);
    assert(mockErrorMessages.calledOnce);
    assert("No breakpoints found.", mockErrorMessages.getCall(0).args[0]);
  });

  it("ExportBreakpoints - saving error should log error", function() {
    // setup
    let logger = Sandbox.stub(log, "Log");
    let writer = Sandbox.stub(fs, "writeFileSync").throws();

    // Act
    exportIO.ExportBreakpoints();

    // Assert
    assert(writer.calledOnce);
    assert(logger.calledOnce);
  });
});
