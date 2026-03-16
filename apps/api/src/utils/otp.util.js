"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOtp = generateOtp;
exports.otpExpiry = otpExpiry;
var crypto_1 = require("crypto");
function generateOtp() {
    return (0, crypto_1.randomInt)(100000, 999999).toString();
}
function otpExpiry(minutes) {
    if (minutes === void 0) { minutes = 10; }
    return new Date(Date.now() + minutes * 60000);
}
