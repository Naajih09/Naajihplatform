"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllExceptionsFilter = void 0;
var common_1 = require("@nestjs/common");
var core_1 = require("@nestjs/core");
var client_1 = require("@prisma/client");
var crypto_1 = require("crypto");
var my_logger_service_1 = require("../../../../../../../../../../src/my-logger/my-logger.service");
var AllExceptionsFilter = function () {
    var _classDecorators = [(0, common_1.Catch)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _classSuper = core_1.BaseExceptionFilter;
    var AllExceptionsFilter = _classThis = /** @class */ (function (_super) {
        __extends(AllExceptionsFilter_1, _super);
        function AllExceptionsFilter_1() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.logger = new my_logger_service_1.MyLoggerService(AllExceptionsFilter.name);
            return _this;
        }
        AllExceptionsFilter_1.prototype.catch = function (exception, host) {
            var ctx = host.switchToHttp();
            var response = ctx.getResponse();
            var request = ctx.getRequest();
            var requestId = request.headers['x-request-id'] || (0, crypto_1.randomUUID)();
            var timestamp = new Date().toISOString();
            var errorPayload = this.buildErrorPayload(exception, request, requestId, timestamp);
            response.status(errorPayload.statusCode).json(errorPayload);
            if (!this.shouldSuppressLog(request, errorPayload.statusCode)) {
                var stack = exception instanceof Error ? exception.stack : JSON.stringify(exception);
                this.logger.error("[".concat(requestId, "] ").concat(request.method, " ").concat(request.url, " -> ").concat(errorPayload.statusCode, " :: ").concat(errorPayload.message), stack);
            }
        };
        AllExceptionsFilter_1.prototype.buildErrorPayload = function (exception, request, requestId, timestamp) {
            var _a, _b;
            var statusCode = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
            var error = 'Internal Server Error';
            var message = 'An unexpected error occurred';
            var details = undefined;
            if (exception instanceof common_1.HttpException) {
                statusCode = exception.getStatus();
                var response = exception.getResponse();
                if (typeof response === 'string') {
                    message = response;
                }
                else if (typeof response === 'object') {
                    var resObj = response;
                    message = this.extractMessage((_a = resObj.message) !== null && _a !== void 0 ? _a : message);
                    error = (_b = resObj.error) !== null && _b !== void 0 ? _b : exception.name;
                    details = resObj.details;
                }
            }
            else if (exception instanceof client_1.Prisma.PrismaClientValidationError) {
                statusCode = common_1.HttpStatus.UNPROCESSABLE_ENTITY;
                error = 'ValidationError';
                message = exception.message.replace(/\n/g, ' ');
            }
            else if (exception instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                var prismaError = this.transformPrismaKnownError(exception);
                statusCode = prismaError.statusCode;
                error = prismaError.error;
                message = prismaError.message;
                details = prismaError.details;
            }
            else if (exception instanceof client_1.Prisma.PrismaClientUnknownRequestError) {
                statusCode = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
                error = 'PrismaUnknownError';
                message = 'An unknown database error occurred';
            }
            else if (exception instanceof Error) {
                message = exception.message || message;
                error = exception.name || error;
                details = this.isDevelopment()
                    ? { stack: exception.stack }
                    : undefined;
            }
            return __assign({ success: false, statusCode: statusCode, error: error, message: message, timestamp: timestamp, path: request.url, method: request.method, requestId: requestId }, (details ? { details: details } : {}));
        };
        AllExceptionsFilter_1.prototype.transformPrismaKnownError = function (exception) {
            var _a, _b, _c;
            var base = {
                statusCode: common_1.HttpStatus.BAD_REQUEST,
                error: 'DatabaseError',
                message: 'A database error occurred',
                details: {
                    code: exception.code,
                    meta: exception.meta,
                },
            };
            switch (exception.code) {
                case 'P2002':
                    return __assign(__assign({}, base), { message: "Duplicate value for ".concat((_a = exception.meta) === null || _a === void 0 ? void 0 : _a.target) });
                case 'P2003':
                    return __assign(__assign({}, base), { message: this.formatForeignKeyMessage(exception) });
                case 'P2025':
                    return __assign(__assign({}, base), { statusCode: common_1.HttpStatus.NOT_FOUND, error: 'NotFound', message: ((_b = exception.meta) === null || _b === void 0 ? void 0 : _b.cause) ||
                            'The requested resource could not be found' });
                case 'P2010':
                    return __assign(__assign({}, base), { message: "Invalid data provided for query" });
                case 'P2023':
                    return __assign(__assign({}, base), { message: "Invalid operation: ".concat((_c = exception.meta) === null || _c === void 0 ? void 0 : _c.operation) });
                default:
                    return base;
            }
        };
        AllExceptionsFilter_1.prototype.isDevelopment = function () {
            return process.env.NODE_ENV !== 'production';
        };
        AllExceptionsFilter_1.prototype.shouldSuppressLog = function (request, statusCode) {
            var suppressedPaths = ['/service-worker.js'];
            return statusCode === common_1.HttpStatus.NOT_FOUND &&
                suppressedPaths.includes(request.path)
                ? true
                : false;
        };
        AllExceptionsFilter_1.prototype.extractMessage = function (message) {
            if (Array.isArray(message)) {
                return message
                    .filter(function (value) { return typeof value === 'string'; })
                    .join('; ');
            }
            if (typeof message === 'string') {
                return message;
            }
            if (message && typeof message === 'object') {
                if ('message' in message) {
                    return this.extractMessage(message.message);
                }
            }
            return 'We could not process your request at this time.';
        };
        AllExceptionsFilter_1.prototype.formatForeignKeyMessage = function (exception) {
            var _a, _b;
            var target = (_b = (_a = exception.meta) === null || _a === void 0 ? void 0 : _a.target) !== null && _b !== void 0 ? _b : '';
            if (!target)
                return 'One of the referenced records does not exist.';
            var cleaned = target
                .replace(/[_-]fkey$/i, '')
                .replace(/_/g, ' ')
                .replace(/product/gi, 'product');
            return "The related record for \"".concat(cleaned.trim(), "\" does not exist. Please create it first or use a valid identifier.");
        };
        return AllExceptionsFilter_1;
    }(_classSuper));
    __setFunctionName(_classThis, "AllExceptionsFilter");
    (function () {
        var _a;
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AllExceptionsFilter = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AllExceptionsFilter = _classThis;
}();
exports.AllExceptionsFilter = AllExceptionsFilter;
