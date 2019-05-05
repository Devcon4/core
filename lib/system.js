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
var System = (function () {
    function System() {
        this._priority = 0;
        this._engines = [];
    }
    Object.defineProperty(System.prototype, "priority", {
        get: function () {
            return this._priority;
        },
        set: function (value) {
            var e_1, _a;
            this._priority = value;
            try {
                for (var _b = __values(this._engines), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var engine = _c.value;
                    engine.notifyPriorityChange(this);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(System.prototype, "engines", {
        get: function () {
            return Object.freeze(this._engines.slice(0));
        },
        enumerable: true,
        configurable: true
    });
    System.prototype.onAttach = function (engine) {
        var index = this._engines.indexOf(engine);
        if (index === -1) {
            this._engines.push(engine);
        }
    };
    System.prototype.onDetach = function (engine) {
        var index = this._engines.indexOf(engine);
        if (index !== -1) {
            this._engines.splice(index, 1);
        }
    };
    return System;
}());
exports.System = System;
//# sourceMappingURL=system.js.map