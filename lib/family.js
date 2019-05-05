"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var AbstractFamily = (function () {
    function AbstractFamily(engine, include, exclude) {
        var _this = this;
        this.includesEntity = function (entity) {
            var e_1, _a, e_2, _b;
            try {
                for (var _c = __values(_this._include), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var include = _d.value;
                    if (!entity.hasComponent(include)) {
                        return false;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_1) throw e_1.error; }
            }
            try {
                for (var _e = __values(_this._exclude), _f = _e.next(); !_f.done; _f = _e.next()) {
                    var exclude = _f.value;
                    if (entity.hasComponent(exclude)) {
                        return false;
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return true;
        };
        this._engine = engine;
        this._include = Object.freeze(include.slice(0));
        this._exclude = Object.freeze(exclude.slice(0));
    }
    Object.defineProperty(AbstractFamily.prototype, "engine", {
        get: function () {
            return this._engine;
        },
        enumerable: true,
        configurable: true
    });
    return AbstractFamily;
}());
var CachedFamily = (function (_super) {
    __extends(CachedFamily, _super);
    function CachedFamily(engine, include, exclude) {
        var e_3, _a;
        var _this = _super.call(this, engine, include, exclude) || this;
        _this.onEntityChanged = function (entity) {
            var index = _this._entities.indexOf(entity);
            if (index === -1) {
                _this._entities.push(entity);
                entity.addListener(_this.onEntityChanged);
            }
            _this._needEntityRefresh = true;
        };
        var allEntities = _this.engine.entities;
        _this._entities = allEntities.filter(_this.includesEntity);
        _this.engine.addEntityListener(_this);
        try {
            for (var allEntities_1 = __values(allEntities), allEntities_1_1 = allEntities_1.next(); !allEntities_1_1.done; allEntities_1_1 = allEntities_1.next()) {
                var entity = allEntities_1_1.value;
                entity.addListener(_this.onEntityAdded);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (allEntities_1_1 && !allEntities_1_1.done && (_a = allEntities_1.return)) _a.call(allEntities_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
        _this._needEntityRefresh = false;
        return _this;
    }
    Object.defineProperty(CachedFamily.prototype, "entities", {
        get: function () {
            if (this._needEntityRefresh) {
                this._needEntityRefresh = false;
                this._entities = this._entities.filter(this.includesEntity);
            }
            return Object.freeze(this._entities.slice(0));
        },
        enumerable: true,
        configurable: true
    });
    CachedFamily.prototype.onEntityAdded = function (entity) {
        var index = this._entities.indexOf(entity);
        if (index === -1) {
            this._entities.push(entity);
            this._needEntityRefresh = true;
            entity.addListener(this.onEntityChanged);
        }
    };
    CachedFamily.prototype.onEntityRemoved = function (entity) {
        var index = this._entities.indexOf(entity);
        if (index !== -1) {
            var entity_1 = this._entities[index];
            this._entities.splice(index, 1);
            entity_1.removeListener(this.onEntityChanged);
        }
    };
    return CachedFamily;
}(AbstractFamily));
var NonCachedFamily = (function (_super) {
    __extends(NonCachedFamily, _super);
    function NonCachedFamily() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(NonCachedFamily.prototype, "entities", {
        get: function () {
            return this.engine.entities.filter(this.includesEntity);
        },
        enumerable: true,
        configurable: true
    });
    return NonCachedFamily;
}(AbstractFamily));
var FamilyBuilder = (function () {
    function FamilyBuilder(engine) {
        this._engine = engine || null;
        this._include = [];
        this._exclude = [];
        this._cached = true;
    }
    FamilyBuilder.prototype.include = function () {
        var _a;
        var classes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            classes[_i] = arguments[_i];
        }
        (_a = this._include).push.apply(_a, __spread(classes));
        return this;
    };
    FamilyBuilder.prototype.exclude = function () {
        var _a;
        var classes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            classes[_i] = arguments[_i];
        }
        (_a = this._exclude).push.apply(_a, __spread(classes));
        return this;
    };
    FamilyBuilder.prototype.changeEngine = function (engine) {
        this._engine = engine;
        return this;
    };
    FamilyBuilder.prototype.setCached = function (cached) {
        this._cached = cached;
    };
    FamilyBuilder.prototype.build = function () {
        if (!this._engine) {
            throw new Error("Family should always belong to an engine.");
        }
        if (!this._cached) {
            return new NonCachedFamily(this._engine, this._include, this._exclude);
        }
        return new CachedFamily(this._engine, this._include, this._exclude);
    };
    return FamilyBuilder;
}());
exports.FamilyBuilder = FamilyBuilder;
//# sourceMappingURL=family.js.map