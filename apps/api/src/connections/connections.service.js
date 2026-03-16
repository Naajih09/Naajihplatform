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
exports.ConnectionsService = void 0;
// apps/api/src/connections/connections.service.ts
var common_1 = require("@nestjs/common");
var client_1 = require("@prisma/client"); // NEW: Import ConnectionStatus enum
var ConnectionsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ConnectionsService = _classThis = /** @class */ (function () {
        function ConnectionsService_1(databaseService, notificationsService) {
            this.databaseService = databaseService;
            this.notificationsService = notificationsService;
        }
        // NEW: findOne method for the controller's authorization checks
        ConnectionsService_1.prototype.findOne = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.databaseService.connection.findUnique({
                            where: { id: id },
                        })];
                });
            });
        };
        // 1. SEND CONNECTION REQUEST
        ConnectionsService_1.prototype.create = function (data) {
            return __awaiter(this, void 0, void 0, function () {
                var senderId, receiverId, existing, connection, sender, senderName;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            senderId = data.senderId, receiverId = data.receiverId;
                            if (senderId === receiverId) {
                                throw new common_1.ConflictException('You cannot connect with yourself.');
                            }
                            return [4 /*yield*/, this.databaseService.connection.findFirst({
                                    where: {
                                        OR: [
                                            { senderId: senderId, receiverId: receiverId },
                                            { senderId: receiverId, receiverId: senderId },
                                        ],
                                    },
                                })];
                        case 1:
                            existing = _c.sent();
                            if (existing) {
                                // Use ConnectionStatus enum
                                throw new common_1.ConflictException("Connection already exists or is ".concat(existing.status.toLowerCase()));
                            }
                            return [4 /*yield*/, this.databaseService.connection.create({
                                    data: {
                                        senderId: senderId,
                                        receiverId: receiverId,
                                        status: client_1.ConnectionStatus.PENDING, // Use enum here
                                    },
                                })];
                        case 2:
                            connection = _c.sent();
                            return [4 /*yield*/, this.databaseService.user.findUnique({
                                    where: { id: senderId },
                                    include: { entrepreneurProfile: true, investorProfile: true }
                                })];
                        case 3:
                            sender = _c.sent();
                            senderName = ((_a = sender === null || sender === void 0 ? void 0 : sender.entrepreneurProfile) === null || _a === void 0 ? void 0 : _a.firstName) || ((_b = sender === null || sender === void 0 ? void 0 : sender.investorProfile) === null || _b === void 0 ? void 0 : _b.firstName) || 'Someone';
                            return [4 /*yield*/, this.notificationsService.create(receiverId, "".concat(senderName, " sent you a connection request."))];
                        case 4:
                            _c.sent();
                            return [2 /*return*/, connection];
                    }
                });
            });
        };
        // 2. GET MY CONNECTIONS (Accepted)
        ConnectionsService_1.prototype.getMyConnections = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.databaseService.connection.findMany({
                            where: {
                                OR: [{ senderId: userId }, { receiverId: userId }],
                                status: client_1.ConnectionStatus.ACCEPTED, // Use enum here
                            },
                            include: {
                                sender: { include: { entrepreneurProfile: true, investorProfile: true } },
                                receiver: { include: { entrepreneurProfile: true, investorProfile: true } },
                            },
                        })];
                });
            });
        };
        // 3. GET PENDING REQUESTS (Waiting for me to accept)
        ConnectionsService_1.prototype.getPendingRequests = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.databaseService.connection.findMany({
                            where: {
                                receiverId: userId,
                                status: client_1.ConnectionStatus.PENDING, // Use enum here
                            },
                            include: {
                                sender: { include: { entrepreneurProfile: true, investorProfile: true } },
                            },
                        })];
                });
            });
        };
        // 4. ACCEPT / REJECT REQUEST
        ConnectionsService_1.prototype.respond = function (id, status) {
            return __awaiter(this, void 0, void 0, function () {
                var connection, receiverName;
                var _a, _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0: return [4 /*yield*/, this.databaseService.connection.update({
                                where: { id: id },
                                data: { status: client_1.ConnectionStatus[status] }, // Convert string to enum member
                                include: { receiver: { include: { entrepreneurProfile: true, investorProfile: true } } }
                            })];
                        case 1:
                            connection = _e.sent();
                            if (!(status === 'ACCEPTED')) return [3 /*break*/, 3];
                            receiverName = ((_b = (_a = connection.receiver) === null || _a === void 0 ? void 0 : _a.entrepreneurProfile) === null || _b === void 0 ? void 0 : _b.firstName) || ((_d = (_c = connection.receiver) === null || _c === void 0 ? void 0 : _c.investorProfile) === null || _d === void 0 ? void 0 : _d.firstName) || 'Someone';
                            return [4 /*yield*/, this.notificationsService.create(connection.senderId, "".concat(receiverName, " accepted your connection request."))];
                        case 2:
                            _e.sent();
                            _e.label = 3;
                        case 3: return [2 /*return*/, connection];
                    }
                });
            });
        };
        // 5. REMOVE / CANCEL CONNECTION (NEW)
        ConnectionsService_1.prototype.removeConnection = function (id, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var connection;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.databaseService.connection.findUnique({
                                where: { id: id },
                            })];
                        case 1:
                            connection = _a.sent();
                            if (!connection) {
                                throw new common_1.NotFoundException('Connection not found');
                            }
                            // Authorization: Only people involved in the connection can delete it
                            if (connection.senderId !== userId && connection.receiverId !== userId) {
                                throw new common_1.UnauthorizedException('Not authorized to modify this connection');
                            }
                            return [2 /*return*/, this.databaseService.connection.delete({
                                    where: { id: id },
                                })];
                    }
                });
            });
        };
        return ConnectionsService_1;
    }());
    __setFunctionName(_classThis, "ConnectionsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ConnectionsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ConnectionsService = _classThis;
}();
exports.ConnectionsService = ConnectionsService;
