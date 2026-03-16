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
exports.VerificationController = exports.UpdateVerificationStatusDto = exports.SubmitVerificationDto = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
var roles_guard_1 = require("../auth/guards/roles.guard");
var roles_decorator_1 = require("../auth/decorators/roles.decorator");
var client_1 = require("@prisma/client");
// DTO for submitting verification requests
// Consider moving this to `apps/api/src/verification/dto/submit-verification.dto.ts`
var class_validator_1 = require("class-validator");
var SubmitVerificationDto = function () {
    var _a;
    var _userId_decorators;
    var _userId_initializers = [];
    var _userId_extraInitializers = [];
    var _documentUrl_decorators;
    var _documentUrl_initializers = [];
    var _documentUrl_extraInitializers = [];
    return _a = /** @class */ (function () {
            function SubmitVerificationDto() {
                this.userId = __runInitializers(this, _userId_initializers, void 0);
                this.documentUrl = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _documentUrl_initializers, void 0));
                __runInitializers(this, _documentUrl_extraInitializers);
            }
            return SubmitVerificationDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _userId_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _documentUrl_decorators = [(0, class_validator_1.IsUrl)(), (0, class_validator_1.IsNotEmpty)()];
            __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: function (obj) { return "userId" in obj; }, get: function (obj) { return obj.userId; }, set: function (obj, value) { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
            __esDecorate(null, null, _documentUrl_decorators, { kind: "field", name: "documentUrl", static: false, private: false, access: { has: function (obj) { return "documentUrl" in obj; }, get: function (obj) { return obj.documentUrl; }, set: function (obj, value) { obj.documentUrl = value; } }, metadata: _metadata }, _documentUrl_initializers, _documentUrl_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.SubmitVerificationDto = SubmitVerificationDto;
// DTO for updating verification status
// Consider moving this to `apps/api/src/verification/dto/update-verification-status.dto.ts`
var class_validator_2 = require("class-validator");
var UpdateVerificationStatusDto = function () {
    var _a;
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _rejectionReason_decorators;
    var _rejectionReason_initializers = [];
    var _rejectionReason_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateVerificationStatusDto() {
                this.status = __runInitializers(this, _status_initializers, void 0);
                this.rejectionReason = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _rejectionReason_initializers, void 0));
                __runInitializers(this, _rejectionReason_extraInitializers);
            }
            return UpdateVerificationStatusDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _status_decorators = [(0, class_validator_2.IsEnum)(client_1.VerificationStatus)];
            _rejectionReason_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_2.IsOptional)()];
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _rejectionReason_decorators, { kind: "field", name: "rejectionReason", static: false, private: false, access: { has: function (obj) { return "rejectionReason" in obj; }, get: function (obj) { return obj.rejectionReason; }, set: function (obj, value) { obj.rejectionReason = value; } }, metadata: _metadata }, _rejectionReason_initializers, _rejectionReason_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateVerificationStatusDto = UpdateVerificationStatusDto;
// Protect the whole controller with authentication and role checking
var VerificationController = function () {
    var _classDecorators = [(0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard), (0, common_1.Controller)('verification')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _submitVerification_decorators;
    var _getVerificationStatus_decorators;
    var _getPendingVerifications_decorators;
    var _updateVerificationStatus_decorators;
    var VerificationController = _classThis = /** @class */ (function () {
        function VerificationController_1(verificationService) {
            this.verificationService = (__runInitializers(this, _instanceExtraInitializers), verificationService);
        }
        // 1️⃣ USER: Submit verification request
        // Entrepreneur/Investor can submit their own verification
        VerificationController_1.prototype.submitVerification = function (submitVerificationDto, // Use DTO
        req) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    // Ensure the userId in the body matches the authenticated user's ID
                    if (req.user.id !== submitVerificationDto.userId) {
                        throw new common_1.ForbiddenException('You can only submit verification for your own account.');
                    }
                    return [2 /*return*/, this.verificationService.create(submitVerificationDto)];
                });
            });
        };
        // 2️⃣ USER: Check verification status
        // Entrepreneur/Investor can check their own status
        VerificationController_1.prototype.getVerificationStatus = function (userId, req) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    // Ensure the userId in the param matches the authenticated user's ID, unless it's an ADMIN
                    if (req.user.role !== client_1.UserRole.ADMIN && req.user.id !== userId) {
                        throw new common_1.ForbiddenException('You can only view your own verification status.');
                    }
                    return [2 /*return*/, this.verificationService.getStatus(userId)];
                });
            });
        };
        // 3️⃣ ADMIN: Get all pending verification requests
        VerificationController_1.prototype.getPendingVerifications = function () {
            return this.verificationService.findAllPending();
        };
        // 4️⃣ ADMIN: Approve or reject verification
        VerificationController_1.prototype.updateVerificationStatus = function (id, updateVerificationStatusDto) {
            if (updateVerificationStatusDto.status !== 'APPROVED' &&
                updateVerificationStatusDto.status !== 'REJECTED') {
                throw new common_1.ForbiddenException('Status must be APPROVED or REJECTED.');
            }
            return this.verificationService.updateStatus(id, updateVerificationStatusDto.status, updateVerificationStatusDto.rejectionReason);
        };
        return VerificationController_1;
    }());
    __setFunctionName(_classThis, "VerificationController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _submitVerification_decorators = [(0, common_1.Post)('submit'), (0, roles_decorator_1.Roles)(client_1.UserRole.ENTREPRENEUR, client_1.UserRole.INVESTOR)];
        _getVerificationStatus_decorators = [(0, common_1.Get)(':userId'), (0, roles_decorator_1.Roles)(client_1.UserRole.ENTREPRENEUR, client_1.UserRole.INVESTOR, client_1.UserRole.ADMIN)];
        _getPendingVerifications_decorators = [(0, common_1.Get)('admin/pending'), (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN)];
        _updateVerificationStatus_decorators = [(0, common_1.Patch)('admin/:id'), (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN)];
        __esDecorate(_classThis, null, _submitVerification_decorators, { kind: "method", name: "submitVerification", static: false, private: false, access: { has: function (obj) { return "submitVerification" in obj; }, get: function (obj) { return obj.submitVerification; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getVerificationStatus_decorators, { kind: "method", name: "getVerificationStatus", static: false, private: false, access: { has: function (obj) { return "getVerificationStatus" in obj; }, get: function (obj) { return obj.getVerificationStatus; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getPendingVerifications_decorators, { kind: "method", name: "getPendingVerifications", static: false, private: false, access: { has: function (obj) { return "getPendingVerifications" in obj; }, get: function (obj) { return obj.getPendingVerifications; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateVerificationStatus_decorators, { kind: "method", name: "updateVerificationStatus", static: false, private: false, access: { has: function (obj) { return "updateVerificationStatus" in obj; }, get: function (obj) { return obj.updateVerificationStatus; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        VerificationController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return VerificationController = _classThis;
}();
exports.VerificationController = VerificationController;
