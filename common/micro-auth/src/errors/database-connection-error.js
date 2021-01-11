"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseConnectionError = void 0;
var error_interfaces_1 = require("./error-interfaces");
var DatabaseConnectionError = /** @class */ (function (_super) {
    __extends(DatabaseConnectionError, _super);
    function DatabaseConnectionError(reason, code) {
        if (reason === void 0) { reason = 'Unknown db error'; }
        if (code === void 0) { code = 500; }
        var _this = _super.call(this, 'Unknown db error') || this;
        _this.reason = reason;
        _this.code = code;
        // Only because we are extending a build-in class
        Object.setPrototypeOf(_this, DatabaseConnectionError.prototype);
        return _this;
    }
    DatabaseConnectionError.prototype.serialize = function () {
        return [{ message: this.reason }];
    };
    return DatabaseConnectionError;
}(error_interfaces_1.CustomError));
exports.DatabaseConnectionError = DatabaseConnectionError;
