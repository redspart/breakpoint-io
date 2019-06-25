import { Range } from "vscode";

export const Schema = {
  required: ["location", "line", "enabled"],
  minProperties: 3,
  properties: {
    location: { type: "string" },
    line: { type: "array" },
    enabled: { type: "boolean" },
    condition: { type: "string" },
    hitCondition: { type: "string" },
    logMessage: { type: "string" }
  }
};

export class BreakpointIO {
  location: string;
  line: Range;
  enabled?: boolean;
  condition?: string;
  hitCondition?: string;
  logMessage?: string;

  constructor(
    location: string,
    line: Range,
    enabled?: boolean,
    condition?: string,
    hitCondition?: string,
    logMessage?: string
  ) {
    this.location = location;
    this.line = line;
    this.enabled = enabled;
    this.condition = condition;
    this.hitCondition = hitCondition;
    this.logMessage = logMessage;
  }
}
