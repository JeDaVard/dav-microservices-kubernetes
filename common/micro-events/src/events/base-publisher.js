"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Publisher = void 0;
var Publisher = /** @class */ (function () {
    function Publisher(stan) {
        this.stan = stan;
    }
    Publisher.prototype.publish = function (data) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.stan.publish(_this.subject, JSON.stringify(data), function (err) {
                if (err)
                    reject(err);
                console.log("Event published to subject [" + _this.subject + "]");
                resolve();
            });
        });
    };
    return Publisher;
}());
exports.Publisher = Publisher;
