"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nats = void 0;
var node_nats_streaming_1 = require("node-nats-streaming");
var Nats = /** @class */ (function () {
    function Nats() {
    }
    Object.defineProperty(Nats.prototype, "client", {
        get: function () {
            if (!this._client) {
                throw new Error('You need to connect first.');
            }
            return this._client;
        },
        enumerable: false,
        configurable: true
    });
    Nats.prototype.connect = function (clusterID, clientID, url, callback) {
        var _this = this;
        this._client = node_nats_streaming_1.connect(clusterID, clientID, { url: url });
        return new Promise(function (resolve, reject) {
            _this._client.on('connect', function () {
                if (callback)
                    callback();
                resolve();
            });
            _this._client.on('error', function (err) {
                reject(err);
            });
        });
    };
    return Nats;
}());
var nats = new Nats();
exports.nats = nats;
