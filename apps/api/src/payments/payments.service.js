"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
var common_1 = require("@nestjs/common");
var axios_1 = require("axios");
var PaymentsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var PaymentsService = _classThis = /** @class */ (function () {
        function PaymentsService_1(databaseService, notificationsService) {
            this.databaseService = databaseService;
            this.notificationsService = notificationsService;
            this.PAYSTACK_SECRET_KEY = "sk_test_e3dd5e59df60bbba4ea58351f3f3b6e2c2e9941d";
            this.OPAY_SECRET_KEY = "OPAYPRV17728253752030.1304038873532969";
            this.OPAY_MERCHANT_ID = "281826030662239";
            this.OPAY_PUB_KEY = "OPAYPUB17728253752030.23745205607820175";
        }
        PaymentsService_1.prototype.initializeTransaction = function (provider, email, amount) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (provider === 'paystack') {
                        return [2 /*return*/, this.initializePaystack(email, amount)];
                    }
                    else {
                        return [2 /*return*/, this.initializeOPay(email, amount)];
                    }
                    return [2 /*return*/];
                });
            });
        };
        PaymentsService_1.prototype.initializePaystack = function (email, amount) {
            return __awaiter(this, void 0, void 0, function () {
                var url, response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            url = 'https://api.paystack.co/transaction/initialize';
                            return [4 /*yield*/, axios_1.default.post(url, {
                                    email: email,
                                    amount: amount * 100, // Paystack expects Kobo
                                }, {
                                    headers: {
                                        Authorization: "Bearer ".concat(this.PAYSTACK_SECRET_KEY),
                                        'Content-Type': 'application/json',
                                    },
                                })];
                        case 1:
                            response = _a.sent();
                            return [2 /*return*/, response.data.data]; // { authorization_url, reference }
                    }
                });
            });
        };
        PaymentsService_1.prototype.initializeOPay = function (email, amount) {
            return __awaiter(this, void 0, void 0, function () {
                var reference, url, response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            reference = "OPAY_".concat(Date.now());
                            url = 'https://api.opaycheckout.com/api/v1/international/cashier/create';
                            return [4 /*yield*/, axios_1.default.post(url, {
                                    amount: {
                                        total: amount * 100,
                                        currency: 'NGN',
                                    },
                                    reference: reference,
                                    returnUrl: "".concat(process.env.FRONTEND_URL, "/dashboard/subscription?provider=opay"),
                                    callbackUrl: "".concat(process.env.BACKEND_URL, "/api/payments/webhook/opay"),
                                    merchantId: this.OPAY_MERCHANT_ID,
                                    productName: 'Najih Premium Subscription',
                                    productDescription: 'Subscription for Premium access on Naajihplatform',
                                    userClientIp: '127.0.0.1', // Should be dynamic in production
                                }, {
                                    headers: {
                                        Authorization: "Bearer ".concat(this.OPAY_PUB_KEY),
                                        'Content-Type': 'application/json',
                                        'Merchant-Id': this.OPAY_MERCHANT_ID,
                                    },
                                })];
                        case 1:
                            response = _a.sent();
                            if (response.data.code !== '00000') {
                                throw new Error(response.data.message || 'OPay initialization failed');
                            }
                            return [2 /*return*/, {
                                    authorization_url: response.data.data.cashierUrl,
                                    reference: reference,
                                }];
                    }
                });
            });
        };
        PaymentsService_1.prototype.verifyTransaction = function (provider, reference) {
            return __awaiter(this, void 0, void 0, function () {
                var status, customerEmail, url, response, data, url, response, data, user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            status = 'failed';
                            customerEmail = '';
                            if (!(provider === 'paystack')) return [3 /*break*/, 2];
                            url = "https://api.paystack.co/transaction/verify/".concat(reference);
                            return [4 /*yield*/, axios_1.default.get(url, {
                                    headers: { Authorization: "Bearer ".concat(this.PAYSTACK_SECRET_KEY) },
                                })];
                        case 1:
                            response = _a.sent();
                            data = response.data.data;
                            if (data.status === 'success') {
                                status = 'success';
                                customerEmail = data.customer.email;
                            }
                            return [3 /*break*/, 4];
                        case 2:
                            url = 'https://api.opaycheckout.com/api/v1/international/cashier/query';
                            return [4 /*yield*/, axios_1.default.post(url, {
                                    merchantId: this.OPAY_MERCHANT_ID,
                                    reference: reference,
                                }, {
                                    headers: {
                                        Authorization: "Bearer ".concat(this.OPAY_PUB_KEY),
                                        'Merchant-Id': this.OPAY_MERCHANT_ID,
                                    },
                                })];
                        case 3:
                            response = _a.sent();
                            data = response.data.data;
                            if (response.data.code === '00000' && data.status === 'SUCCESSFUL') {
                                status = 'success';
                                // OPay might not return email in query, we might need to store reference/email mapping or use the reference to find the user
                            }
                            _a.label = 4;
                        case 4:
                            if (!(status === 'success')) return [3 /*break*/, 8];
                            return [4 /*yield*/, this.databaseService.user.findFirst({
                                    where: customerEmail ? { email: customerEmail } : {}, // Placeholder logic
                                })];
                        case 5:
                            user = _a.sent();
                            if (!user) return [3 /*break*/, 8];
                            return [4 /*yield*/, this.databaseService.subscription.upsert({
                                    where: { userId: user.id },
                                    create: {
                                        userId: user.id,
                                        plan: 'PREMIUM',
                                        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                                    },
                                    update: {
                                        plan: 'PREMIUM',
                                        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                                    },
                                })];
                        case 6:
                            _a.sent();
                            // Notify user
                            return [4 /*yield*/, this.notificationsService.create(user.id, "Subscription upgraded to PREMIUM! Enjoy your new perks.")];
                        case 7:
                            // Notify user
                            _a.sent();
                            _a.label = 8;
                        case 8: return [2 /*return*/, { status: status }];
                    }
                });
            });
        };
        return PaymentsService_1;
    }());
    __setFunctionName(_classThis, "PaymentsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PaymentsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PaymentsService = _classThis;
}();
exports.PaymentsService = PaymentsService;
