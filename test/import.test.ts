"use strict";
import * as assert from "assert";
import * as vscode from "vscode";
import * as importIO from "../src/commands/Import";
import * as log from "../src/helpers/Logger";
import { Path, WorkspaceMock, WorkspaceFoldersMock, Point, createWorkspaceConfiguration } from "./stubs";
import * as fs from "fs";
import * as sinon from "sinon";

describe("Import tests", function() {
  let Sandbox: sinon.SinonSandbox;
  let WorkspaceMockValue: WorkspaceMock;

  beforeEach(async() => {   
    Sandbox = sinon.createSandbox();
    WorkspaceMockValue = new WorkspaceMock([new WorkspaceFoldersMock(vscode.Uri.file(Path))]);
    Sandbox.stub(vscode, "workspace").value(WorkspaceMockValue);
    // Reset everytime
    vscode.debug.removeBreakpoints(vscode.debug.breakpoints);
  });

  afterEach(async() => {
    Sandbox.restore();
  });

   it("ConvertTOSrouceBreakpoint - Maps properly", function() {
    //setup 

    // act
    let ret = importIO.ConvertToSourceBreakpoint(Point, Path);

    // assert
    assert.equal(ret.location.uri.path, `${Path}${Point.location}`);
    assert.equal(ret.location.range.start.line, Point.line[0].line);
    assert.equal(ret.location.range.end.line, Point.line[1].line);
    assert.equal(ret.enabled, Point.enabled);
    assert.equal(ret.condition, Point.condition);
  });

  it("Breakpoint_import - sucessfully loads breakpoints from default path", function(){
    // setup
    let reader = Sandbox.stub(fs, "readFileSync").returns(JSON.stringify([Point], null, 2));

    // act
    importIO.ImportBreakpoints();

    // assert
    assert(reader.calledOnce);
    assert.equal(vscode.debug.breakpoints.length, 1);
    assert.equal(vscode.debug.breakpoints[0].condition, Point.condition);
    assert(Path, <string> reader.getCall(0).args[0]);
  });

  it("Breakpoint_import - sucessfully loads breakpoints from custom path", function(done){
    // setup
    let reader = Sandbox.stub(fs, "readFileSync").returns(JSON.stringify([Point], null, 2));
    let config: {[key: string]: any} = {"exportPath": "\\CustomPath"};
    let mockWorkspaceConfig = Sandbox.stub(vscode.workspace, "getConfiguration").returns(createWorkspaceConfiguration(config));

    // act
    importIO.ImportBreakpoints();

    // assert
    assert(reader.calledOnce);
    assert.equal(vscode.debug.breakpoints.length, 1);
    assert.equal(vscode.debug.breakpoints[0].condition, Point.condition);
    assert("\\CustomPath", <string> reader.getCall(0).args[0]);
    
    done();
  });

  it("Breakpoint_import - validation fails", function(){
    // setup
    let p = Point;
    delete p.enabled;

    Sandbox.stub(fs, "readFileSync").returns(JSON.stringify([p], null, 2));
    let logger = Sandbox.stub(log, "Log");

    // act
    importIO.ImportBreakpoints();

    // assert
    assert.equal("data should have required property 'enabled'", logger.getCall(0).args[0][0]);
    assert.equal(0, vscode.debug.breakpoints.length);
  });
});
