"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nats = void 0;
exports.nats = {
    client: {
        publish: jest.fn().mockImplementation(function (subject, data, callback) {
            callback();
        }),
    },
};
