"use strict";
exports.__esModule = true;
var fs_1 = require("fs");
var jsonFile = 'settings.json';
var savedSettings = {};
if ((0, fs_1.existsSync)(jsonFile)) {
    savedSettings = JSON.parse((0, fs_1.readFileSync)(jsonFile).toString());
}
else {
    savedSettings = {};
    (0, fs_1.writeFileSync)(jsonFile, "{}");
}
var SettingsObject = /** @class */ (function () {
    function SettingsObject(object, parent, keyInParent) {
        var _this = this;
        this.set = function (key, value) {
            _this.object[key] = value;
            if (_this.parent != undefined && _this.keyInParent != undefined) {
                _this.parent.set(_this.keyInParent, _this.object);
            }
            dirty = true;
        };
        this.get = function (key, implicit) {
            if (implicit === void 0) { implicit = {}; }
            if (_this.object[key] == undefined)
                _this.object[key] = implicit;
            return new SettingsObject(_this.object[key], _this, key);
        };
        this.append = function (value) {
            if (_this.object.constructor != Array)
                throw ("Append called on an object that is not an array.");
            _this.object.push(value);
            if (_this.parent != undefined && _this.keyInParent != undefined) {
                _this.parent.set(_this.keyInParent, _this.object);
            }
            dirty = true;
        };
        this.remove = function (value) {
            if (_this.object.constructor != Array)
                throw ("Remove called on an object that is not an array.");
            _this.object = _this.object.filter(function (element) {
                return element != value;
            });
            if (_this.parent != undefined && _this.keyInParent != undefined) {
                _this.parent.set(_this.keyInParent, _this.object);
            }
            dirty = true;
        };
        this.parent = parent;
        this.object = object;
        this.keyInParent = keyInParent;
    }
    return SettingsObject;
}());
var dirty = false;
var saveInterval;
var so = new SettingsObject(savedSettings, undefined, undefined);
var set = so.set;
var append = so.append;
var remove = so.remove;
var get = so.get;
var setSaveInterval = function (ms) {
    clearInterval(saveInterval);
    setInterval(saveSettings, ms);
};
var saveSettings = function () {
    if (!dirty)
        return;
    dirty = false;
    (0, fs_1.writeFileSync)('./settings.json', JSON.stringify(so.object, undefined, 2));
};
module.exports = {
    set: set,
    append: append,
    remove: remove,
    get: get,
    setSaveInterval: setSaveInterval,
    saveSettings: saveSettings
};
