"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStatus = void 0;
var OrderStatus;
(function (OrderStatus) {
    // When order a normal (not reserved) ticket
    OrderStatus["Created"] = "created";
    // When order a reserved ticket, or user cancelled, or payment time is expired
    OrderStatus["Cancelled"] = "cancelled";
    // Successfully reserved, waiting for payment
    OrderStatus["Pending"] = "pending";
    // All done
    OrderStatus["Fulfilled"] = "fulfilled";
})(OrderStatus = exports.OrderStatus || (exports.OrderStatus = {}));
