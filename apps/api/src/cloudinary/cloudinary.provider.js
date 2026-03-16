"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudinaryProvider = void 0;
var cloudinary_1 = require("cloudinary");
exports.CloudinaryProvider = {
    provide: 'CLOUDINARY',
    useFactory: function () {
        return cloudinary_1.v2.config({
            cloud_name: 'dktv7ospa',
            api_key: '266593211724638',
            api_secret: 'z5wiX4apIny6oW4LJmZjjcTZQWU',
        });
    },
};
