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
exports.BadRequestError = void 0;
var error_interfaces_1 = require("./error-interfaces");
var BadRequestError = /** @class */ (function (_super) {
    __extends(BadRequestError, _super);
    function BadRequestError(reason) {
        if (reason === void 0) { reason = 'Bad Request!'; }
        var _this = _super.call(this, 'Not Found!') || this;
        _this.reason = reason;
        _this.code = 400;
        // Only because we are extending a build-in class
        Object.setPrototypeOf(_this, BadRequestError.prototype);
        return _this;
    }
    BadRequestError.prototype.serialize = function () {
        return [{ message: this.reason }];
    };
    return BadRequestError;
}(error_interfaces_1.CustomError));
exports.BadRequestError = BadRequestError;
