"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BlueprintClass = (function () {
    function BlueprintClass(blueprint) {
        this.blueprintComponents = [];
        this.blueprintNames = [];
        Object.assign(this, blueprint);
    }
    return BlueprintClass;
}());
exports.BlueprintClass = BlueprintClass;
var BlueprintComponent = (function () {
    function BlueprintComponent(blueprintComponent) {
        Object.assign(this, blueprintComponent);
    }
    return BlueprintComponent;
}());
exports.BlueprintComponent = BlueprintComponent;
//# sourceMappingURL=blueprint.js.map