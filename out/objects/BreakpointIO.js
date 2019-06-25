"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Schema = {
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
class BreakpointIO {
    constructor(location, line, enabled, condition, hitCondition, logMessage) {
        this.location = location;
        this.line = line;
        this.enabled = enabled;
        this.condition = condition;
        this.hitCondition = hitCondition;
        this.logMessage = logMessage;
    }
}
exports.BreakpointIO = BreakpointIO;
//# sourceMappingURL=BreakpointIO.js.map