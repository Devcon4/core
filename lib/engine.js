"use strict";
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
Object.defineProperty(exports, "__esModule", { value: true });
var entity_factory_1 = require("./entity-factory");
var Engine = (function () {
    function Engine(components, blueprints, blueprintTypes) {
        this._entities = [];
        this._entityListeners = [];
        this._systems = [];
        this._systemsNeedSorting = false;
        this._components = components;
        this._blueprints = blueprints;
        this.blueprintTypes = blueprintTypes ? blueprintTypes : undefined;
    }
    Engine.prototype.startup = function () {
        this.entityFactory = new entity_factory_1.EntityFactory(this._blueprints, this._components);
    };
    Engine.prototype.buildEntity = function (type) {
        if (this.blueprintTypes) {
            if (!this.blueprintTypes[type]) {
                throw new Error("Invalid blueprint type: " + type);
            }
            else {
                type = this.blueprintTypes[type];
            }
        }
        return this.entityFactory.buildEntity(type);
    };
    Object.defineProperty(Engine.prototype, "entities", {
        get: function () {
            return Object.freeze(this._entities.slice(0));
        },
        enumerable: true,
        configurable: true
    });
    Engine.prototype.notifyPriorityChange = function (system) {
        this._systemsNeedSorting = true;
    };
    Engine.prototype.addEntityListener = function (listener) {
        if (this._entityListeners.indexOf(listener) === -1) {
            this._entityListeners.push(listener);
        }
        return this;
    };
    Engine.prototype.removeEntityListener = function (listener) {
        var index = this._entityListeners.indexOf(listener);
        if (index !== -1) {
            this._entityListeners.splice(index, 1);
        }
        return this;
    };
    Engine.prototype.addEntity = function (entity) {
        var e_1, _a;
        if (this._entities.indexOf(entity) === -1) {
            this._entities.push(entity);
            try {
                for (var _b = __values(this._entityListeners), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var listener = _c.value;
                    listener.onEntityAdded(entity);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        return this;
    };
    Engine.prototype.addEntities = function () {
        var e_2, _a;
        var entities = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            entities[_i] = arguments[_i];
        }
        try {
            for (var entities_1 = __values(entities), entities_1_1 = entities_1.next(); !entities_1_1.done; entities_1_1 = entities_1.next()) {
                var entity = entities_1_1.value;
                this.addEntity(entity);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (entities_1_1 && !entities_1_1.done && (_a = entities_1.return)) _a.call(entities_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return this;
    };
    Engine.prototype.removeEntity = function (entity) {
        var e_3, _a;
        var index = this._entities.indexOf(entity);
        if (index !== -1) {
            this._entities.splice(index, 1);
            try {
                for (var _b = __values(this._entityListeners), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var listener = _c.value;
                    listener.onEntityRemoved(entity);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_3) throw e_3.error; }
            }
        }
    };
    Engine.prototype.removeEntities = function () {
        var e_4, _a;
        var entities = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            entities[_i] = arguments[_i];
        }
        try {
            for (var entities_2 = __values(entities), entities_2_1 = entities_2.next(); !entities_2_1.done; entities_2_1 = entities_2.next()) {
                var entity = entities_2_1.value;
                this.removeEntity(entity);
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (entities_2_1 && !entities_2_1.done && (_a = entities_2.return)) _a.call(entities_2);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return this;
    };
    Engine.prototype.addSystem = function (system) {
        var index = this._systems.indexOf(system);
        if (index === -1) {
            this._systems.push(system);
            system.onAttach(this);
            this._systemsNeedSorting = true;
        }
        return this;
    };
    Engine.prototype.addSystems = function () {
        var e_5, _a;
        var systems = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            systems[_i] = arguments[_i];
        }
        try {
            for (var systems_1 = __values(systems), systems_1_1 = systems_1.next(); !systems_1_1.done; systems_1_1 = systems_1.next()) {
                var system = systems_1_1.value;
                this.addSystem(system);
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (systems_1_1 && !systems_1_1.done && (_a = systems_1.return)) _a.call(systems_1);
            }
            finally { if (e_5) throw e_5.error; }
        }
    };
    Engine.prototype.removeSystem = function (system) {
        var index = this._systems.indexOf(system);
        if (index !== -1) {
            this._systems.splice(index, 1);
            system.onDetach(this);
        }
        return this;
    };
    Engine.prototype.removeSystems = function () {
        var e_6, _a;
        var systems = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            systems[_i] = arguments[_i];
        }
        try {
            for (var systems_2 = __values(systems), systems_2_1 = systems_2.next(); !systems_2_1.done; systems_2_1 = systems_2.next()) {
                var system = systems_2_1.value;
                this.removeSystem(system);
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (systems_2_1 && !systems_2_1.done && (_a = systems_2.return)) _a.call(systems_2);
            }
            finally { if (e_6) throw e_6.error; }
        }
    };
    Engine.prototype.addBlueprint = function (blueprint) {
        if (!this._blueprints.has(blueprint)) {
            this._blueprints.add(blueprint);
        }
    };
    Engine.prototype.addBlueprints = function () {
        var blueprints = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            blueprints[_i] = arguments[_i];
        }
        blueprints.forEach(this.addBlueprint);
    };
    Engine.prototype.removeBlueprint = function (blueprint) {
        this._blueprints.delete(blueprint);
    };
    Engine.prototype.removeBlueprints = function () {
        var blueprints = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            blueprints[_i] = arguments[_i];
        }
        blueprints.forEach(this.removeBlueprint);
    };
    Engine.prototype.update = function (delta) {
        var e_7, _a;
        if (this._systemsNeedSorting) {
            this._systemsNeedSorting = false;
            this._systems.sort(function (a, b) { return a.priority - b.priority; });
        }
        try {
            for (var _b = __values(this._systems), _c = _b.next(); !_c.done; _c = _b.next()) {
                var system = _c.value;
                system.update(this, delta);
            }
        }
        catch (e_7_1) { e_7 = { error: e_7_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_7) throw e_7.error; }
        }
    };
    return Engine;
}());
exports.Engine = Engine;
//# sourceMappingURL=engine.js.map