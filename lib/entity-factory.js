"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var blueprint_1 = require("./blueprint");
var entity_1 = require("./entity");
var EntityFactory = (function () {
    function EntityFactory(blueprintTemplates, componentModule) {
        this.blueprints = [];
        if (this.validateBlueprints(blueprintTemplates)) {
            this.components = componentModule;
            this.blueprints = this.buildBlueprintsFromTemplates(blueprintTemplates);
        }
    }
    EntityFactory.prototype.buildEntity = function (name) {
        return this.getEntityFromBlueprint(this.getBlueprintFromName(name), new entity_1.Entity());
    };
    EntityFactory.prototype.getEntityFromBlueprint = function (blueprint, entity) {
        var _this = this;
        blueprint.blueprintNames.forEach(function (x) {
            entity = _this.getEntityFromBlueprint(_this.getBlueprintFromName(x), entity);
        });
        blueprint.blueprintComponents.forEach(function (x) {
            entity.putComponent(x.component);
            if (x.values) {
                var component_1 = entity.getComponent(x.component);
                Object.getOwnPropertyNames(x.values).forEach(function (value) { return component_1[value] = x.values[value]; });
            }
        });
        return entity;
    };
    EntityFactory.prototype.getBlueprintFromName = function (name) {
        var blueprint = this.blueprints.find(function (x) { return x.name === name; });
        if (!blueprint) {
            throw new Error("Cannot find blueprint by that name.");
        }
        return blueprint;
    };
    EntityFactory.prototype.buildBlueprintsFromTemplates = function (blueprintTemplates) {
        var _this = this;
        return blueprintTemplates.map(function (x) {
            return new blueprint_1.BlueprintClass({
                name: x.name,
                blueprintComponents: _this.getComponentsFromTemplates(x.components),
                blueprintNames: _this.hasBlueprints(x) ? x.blueprints : []
            });
        });
    };
    EntityFactory.prototype.hasBlueprints = function (blueprintTemplate) {
        return blueprintTemplate.blueprints && blueprintTemplate.blueprints.length > 0;
    };
    EntityFactory.prototype.getComponentsFromTemplates = function (components) {
        var _this = this;
        if (!components || components.length === 0) {
            throw new Error("Blueprint must implement one or more components.");
        }
        else {
            return components.map(function (x) { return new blueprint_1.BlueprintComponent({
                component: _this.components[x.name],
                values: x.values
            }); });
        }
    };
    EntityFactory.prototype.validateBlueprints = function (blueprints) {
        if (!blueprints || !Array.isArray(blueprints)) {
            throw new Error('Must input array of blueprint templates.');
        }
        if (blueprints.some(function (b) { return !b.name || b.name.length < 1; })) {
            throw new Error('All blueprints must have a name.');
        }
        if (new Set(blueprints.map(function (b) { return b.name.toLowerCase(); })).size !== blueprints.length) {
            throw new Error('All blueprints must have a unique name.');
        }
        if (blueprints.some(function (b) { return !b.components || b.components.length === 0; })) {
            throw new Error('All blueprints must implement one or more components.');
        }
        return true;
    };
    return EntityFactory;
}());
exports.EntityFactory = EntityFactory;
//# sourceMappingURL=entity-factory.js.map