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
exports.ConnectionsController = exports.RespondConnectionDto = exports.CreateConnectionDto = void 0;
var common_1 = require("@nestjs/common");
var class_validator_1 = require("class-validator");
var jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
var roles_guard_1 = require("../auth/guards/roles.guard");
var roles_decorator_1 = require("../auth/decorators/roles.decorator");
var client_1 = require("@prisma/client");
// DTO for creating connections
// Consider moving this to `apps/api/src/connections/dto/create-connection.dto.ts`
var CreateConnectionDto = function () {
    var _a;
    var _receiverId_decorators;
    var _receiverId_initializers = [];
    var _receiverId_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateConnectionDto() {
                // @IsString() @IsNotEmpty() senderId: string; // senderId should come from authenticated user
                this.receiverId = __runInitializers(this, _receiverId_initializers, void 0);
                __runInitializers(this, _receiverId_extraInitializers);
            }
            return CreateConnectionDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _receiverId_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            __esDecorate(null, null, _receiverId_decorators, { kind: "field", name: "receiverId", static: false, private: false, access: { has: function (obj) { return "receiverId" in obj; }, get: function (obj) { return obj.receiverId; }, set: function (obj, value) { obj.receiverId = value; } }, metadata: _metadata }, _receiverId_initializers, _receiverId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateConnectionDto = CreateConnectionDto;
// DTO for responding to connections
// Consider moving this to `apps/api/src/connections/dto/respond-connection.dto.ts`
var RespondConnectionDto = function () {
    var _a;
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    return _a = /** @class */ (function () {
            function RespondConnectionDto() {
                this.status = __runInitializers(this, _status_initializers, void 0); // Only these two values
                __runInitializers(this, _status_extraInitializers);
            }
            return RespondConnectionDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _status_decorators = [(0, class_validator_1.IsEnum)(client_1.ConnectionStatus)];
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.RespondConnectionDto = RespondConnectionDto;
var ConnectionsController = function () {
    var _classDecorators = [(0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard), (0, common_1.Controller)('connections')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _create_decorators;
    var _findAll_decorators;
    var _findPending_decorators;
    var _respond_decorators;
    var _removeConnection_decorators;
    var ConnectionsController = _classThis = /** @class */ (function () {
        function ConnectionsController_1(connectionsService) {
            this.connectionsService = (__runInitializers(this, _instanceExtraInitializers), connectionsService);
        }
        // POST /api/connections -> Send Request
        // Allowed for Entrepreneur, Investor, and Aspiring Business Owner
        ConnectionsController_1.prototype.create = function (createConnectionDto, req) {
            return __awaiter(this, void 0, void 0, function () {
                var senderId;
                return __generator(this, function (_a) {
                    senderId = req.user.id;
                    if (senderId === createConnectionDto.receiverId) {
                        throw new common_1.ForbiddenException('Cannot send a connection request to yourself.');
                    }
                    return [2 /*return*/, this.connectionsService.create({ senderId: senderId, receiverId: createConnectionDto.receiverId })];
                });
            });
        };
        // GET /api/connections/user/:userId -> Get My Connections (Accepted)
        // User can get their own connections, Admin can get anyone's
        ConnectionsController_1.prototype.findAll = function (userId, req) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (req.user.role !== client_1.UserRole.ADMIN && req.user.id !== userId) {
                        throw new common_1.ForbiddenException('You can only view your own connections.');
                    }
                    return [2 /*return*/, this.connectionsService.getMyConnections(userId)];
                });
            });
        };
        // GET /api/connections/pending/:userId -> Get Incoming Requests
        // User can get their own pending requests, Admin can get anyone's
        ConnectionsController_1.prototype.findPending = function (userId, req) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (req.user.role !== client_1.UserRole.ADMIN && req.user.id !== userId) {
                        throw new common_1.ForbiddenException('You can only view your own pending requests.');
                    }
                    return [2 /*return*/, this.connectionsService.getPendingRequests(userId)];
                });
            });
        };
        // PATCH /api/connections/:id -> Accept/Reject a specific connection request
        // Only the receiver of the connection request should be able to respond
        ConnectionsController_1.prototype.respond = function (id, respondConnectionDto, // Use DTO
        req) {
            return __awaiter(this, void 0, void 0, function () {
                var connection;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.connectionsService.findOne(id)];
                        case 1:
                            connection = _a.sent();
                            if (!connection || connection.receiverId !== req.user.id) {
                                throw new common_1.ForbiddenException('You are not authorized to respond to this connection request.');
                            }
                            return [2 /*return*/, this.connectionsService.respond(id, respondConnectionDto.status)];
                    }
                });
            });
        };
        // DELETE /api/connections/:id -> Cancel/Remove Connection
        // User can remove their own connection (either as sender or receiver)
        // Admin can remove any connection
        ConnectionsController_1.prototype.removeConnection = function (id, userId, // Expected via ?userId=... (the user initiating the removal)
        req) {
            return __awaiter(this, void 0, void 0, function () {
                var connection;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            // Ensure the userId in the query parameter matches the authenticated user's ID, unless it's an ADMIN
                            if (req.user.role !== client_1.UserRole.ADMIN && req.user.id !== userId) {
                                throw new common_1.ForbiddenException('You can only remove connections for your own account.');
                            }
                            return [4 /*yield*/, this.connectionsService.findOne(id)];
                        case 1:
                            connection = _a.sent();
                            if (!connection || (req.user.role !== client_1.UserRole.ADMIN && connection.senderId !== userId && connection.receiverId !== userId)) {
                                throw new common_1.ForbiddenException('You are not authorized to remove this connection.');
                            }
                            return [2 /*return*/, this.connectionsService.removeConnection(id, userId)];
                    }
                });
            });
        };
        return ConnectionsController_1;
    }());
    __setFunctionName(_classThis, "ConnectionsController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _create_decorators = [(0, common_1.Post)(), (0, roles_decorator_1.Roles)(client_1.UserRole.ENTREPRENEUR, client_1.UserRole.INVESTOR, client_1.UserRole.ASPIRING_BUSINESS_OWNER)];
        _findAll_decorators = [(0, common_1.Get)('user/:userId'), (0, roles_decorator_1.Roles)(client_1.UserRole.ENTREPRENEUR, client_1.UserRole.INVESTOR, client_1.UserRole.ASPIRING_BUSINESS_OWNER, client_1.UserRole.ADMIN)];
        _findPending_decorators = [(0, common_1.Get)('pending/:userId'), (0, roles_decorator_1.Roles)(client_1.UserRole.ENTREPRENEUR, client_1.UserRole.INVESTOR, client_1.UserRole.ASPIRING_BUSINESS_OWNER, client_1.UserRole.ADMIN)];
        _respond_decorators = [(0, common_1.Patch)(':id'), (0, roles_decorator_1.Roles)(client_1.UserRole.ENTREPRENEUR, client_1.UserRole.INVESTOR, client_1.UserRole.ASPIRING_BUSINESS_OWNER)];
        _removeConnection_decorators = [(0, common_1.Delete)(':id'), (0, roles_decorator_1.Roles)(client_1.UserRole.ENTREPRENEUR, client_1.UserRole.INVESTOR, client_1.UserRole.ASPIRING_BUSINESS_OWNER, client_1.UserRole.ADMIN)];
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: function (obj) { return "create" in obj; }, get: function (obj) { return obj.create; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findAll_decorators, { kind: "method", name: "findAll", static: false, private: false, access: { has: function (obj) { return "findAll" in obj; }, get: function (obj) { return obj.findAll; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findPending_decorators, { kind: "method", name: "findPending", static: false, private: false, access: { has: function (obj) { return "findPending" in obj; }, get: function (obj) { return obj.findPending; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _respond_decorators, { kind: "method", name: "respond", static: false, private: false, access: { has: function (obj) { return "respond" in obj; }, get: function (obj) { return obj.respond; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _removeConnection_decorators, { kind: "method", name: "removeConnection", static: false, private: false, access: { has: function (obj) { return "removeConnection" in obj; }, get: function (obj) { return obj.removeConnection; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ConnectionsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ConnectionsController = _classThis;
}();
exports.ConnectionsController = ConnectionsController;
