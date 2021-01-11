"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
var error_interfaces_1 = require("../errors/error-interfaces");
// TODO investigate the ts err reason
// @ts-ignore
exports.errorHandler = function (err, req, res, next) {
    if (err instanceof error_interfaces_1.CustomError)
        return res.status(err.code).send({ errors: err.serialize() });
    console.error(err);
    res.status(500).send({
        errors: [{ message: 'Something went wrong!' }],
    });
};
