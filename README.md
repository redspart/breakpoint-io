# BreakpointIO [![Build Status](https://travis-ci.org/redspart/breakpoint-io.svg?branch=master)](https://travis-ci.org/redspart/breakpoint-io)

`BreakpointIO` a [Visual Studio Code extension](https://marketplace.visualstudio.com/VSCode), allows you to import and export breakpoints to be used by other users, machines, or whatever you desire.

## Extension Settings
This extension allows you to set the following variabels to the settings:
- `breakpointio.logPath`: path for exporting the log
- `breakpointio.exportPath`: path for exporting breakpoints

## Features

Two main features is the import and export functionality.

### Export breakpoints

Here we create two breakpoints, one regular and one conditional. Then we export them to a `breakpoints.json` file in the `.vscode` folder. You access the `breakpointio-export` command by hitting `control-shift-p` on windows or `command-shift-p` on mac.

![exporting breakpoints in action](content/export.gif)

We have reset the breakpoints in the above example but kept the `breakpoints.json`. You can see when we import them, all the settings for each breakpiont is kept in it's original location.You access the `breakpointio-import` command by hitting `control-shift-p` on windows or `command-shift-p` on mac.

![importing breakpoints in action](content/import.gif)

## Known Issues

## Release Notes

### 1.0.0

- Base functionality to importing and exporting breakpoints
- Test cases
- TravisCI build
- ReadMe with gifs
- Installation instructions

## Contributions

Feel free to contribute to this project with a fork request.
