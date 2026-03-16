"use strict";
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
var common_1 = require("@nestjs/common");
var client_1 = require("@prisma/client");
var bcrypt = require("bcryptjs");
var UsersService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var UsersService = _classThis = /** @class */ (function () {
        function UsersService_1(databaseService) {
            this.databaseService = databaseService;
        }
        // 1. SIGNUP (Create User + Profile + Hash Password)
        UsersService_1.prototype.create = function (createUserDto) {
            return __awaiter(this, void 0, void 0, function () {
                var email, password, role, firstName, lastName, hashedPassword, profileData, newUser, _, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            email = createUserDto.email, password = createUserDto.password, role = createUserDto.role, firstName = createUserDto.firstName, lastName = createUserDto.lastName;
                            return [4 /*yield*/, bcrypt.hash(password, 10)];
                        case 1:
                            hashedPassword = _a.sent();
                            profileData = {};
                            if (role === client_1.UserRole.ENTREPRENEUR) {
                                profileData = { entrepreneurProfile: { create: { firstName: firstName, lastName: lastName } } };
                            }
                            else if (role === client_1.UserRole.INVESTOR) {
                                profileData = { investorProfile: { create: { firstName: firstName, lastName: lastName } } };
                            }
                            else {
                                // Default for Aspirant
                                profileData = { entrepreneurProfile: { create: { firstName: firstName, lastName: lastName } } };
                            }
                            return [4 /*yield*/, this.databaseService.user.create({
                                    data: __assign({ email: email, password: hashedPassword, // Save the HASH
                                        role: role }, profileData),
                                    include: { entrepreneurProfile: true, investorProfile: true }
                                })];
                        case 2:
                            newUser = _a.sent();
                            _ = newUser.password, result = __rest(newUser, ["password"]);
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        UsersService_1.prototype.findById = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.databaseService.user.findUnique({
                            where: { id: id },
                        })];
                });
            });
        };
        // 2. LOGIN (Check Hashed Password)
        UsersService_1.prototype.login = function (email, pass) {
            return __awaiter(this, void 0, void 0, function () {
                var user, isMatch;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.databaseService.user.findUnique({
                                where: { email: email },
                                include: { entrepreneurProfile: true, investorProfile: true },
                            })];
                        case 1:
                            user = _a.sent();
                            if (!user)
                                return [2 /*return*/, null];
                            return [4 /*yield*/, bcrypt.compare(pass, user.password)];
                        case 2:
                            isMatch = _a.sent();
                            if (!isMatch)
                                return [2 /*return*/, null];
                            return [2 /*return*/, user];
                    }
                });
            });
        };
        // 3. FIND ALL
        UsersService_1.prototype.findAll = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.databaseService.user.findMany({
                            include: { entrepreneurProfile: true, investorProfile: true },
                        })];
                });
            });
        };
        // 4. FIND ONE
        UsersService_1.prototype.findOne = function (email) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.databaseService.user.findUnique({
                            where: { email: email },
                            include: { entrepreneurProfile: true, investorProfile: true },
                        })];
                });
            });
        };
        // 5. UPDATE PROFILE
        UsersService_1.prototype.update = function (id, data) {
            return __awaiter(this, void 0, void 0, function () {
                var entrepreneurProfile, investorProfile, userData, updateData, _id, _uid, cleanData, _id, _uid, cleanData;
                return __generator(this, function (_a) {
                    entrepreneurProfile = data.entrepreneurProfile, investorProfile = data.investorProfile, userData = __rest(data, ["entrepreneurProfile", "investorProfile"]);
                    updateData = __assign({}, userData);
                    if (entrepreneurProfile) {
                        _id = entrepreneurProfile.id, _uid = entrepreneurProfile.userId, cleanData = __rest(entrepreneurProfile, ["id", "userId"]);
                        updateData.entrepreneurProfile = {
                            upsert: { create: cleanData, update: cleanData },
                        };
                    }
                    if (investorProfile) {
                        _id = investorProfile.id, _uid = investorProfile.userId, cleanData = __rest(investorProfile, ["id", "userId"]);
                        if (cleanData.minTicketSize)
                            cleanData.minTicketSize = Number(cleanData.minTicketSize);
                        if (cleanData.maxTicketSize)
                            cleanData.maxTicketSize = Number(cleanData.maxTicketSize);
                        updateData.investorProfile = {
                            upsert: { create: cleanData, update: cleanData },
                        };
                    }
                    return [2 /*return*/, this.databaseService.user.update({
                            where: { id: id },
                            data: updateData,
                            include: { entrepreneurProfile: true, investorProfile: true },
                        })];
                });
            });
        };
        // 6. DASHBOARD STATS
        UsersService_1.prototype.getDashboardStats = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var activePitches, pendingConnections, user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.databaseService.pitch.count({
                                where: { userId: userId }
                            })];
                        case 1:
                            activePitches = _a.sent();
                            return [4 /*yield*/, this.databaseService.connection.count({
                                    where: {
                                        receiverId: userId,
                                        status: 'PENDING'
                                    }
                                })];
                        case 2:
                            pendingConnections = _a.sent();
                            return [4 /*yield*/, this.databaseService.user.findUnique({
                                    where: { id: userId },
                                    select: { isVerified: true }
                                })];
                        case 3:
                            user = _a.sent();
                            return [2 /*return*/, {
                                    activePitches: activePitches,
                                    pendingConnections: pendingConnections,
                                    isVerified: (user === null || user === void 0 ? void 0 : user.isVerified) || false,
                                    totalViews: 0
                                }];
                    }
                });
            });
        };
        // 7. CHANGE PASSWORD
        UsersService_1.prototype.changePassword = function (id, newPassword) {
            return __awaiter(this, void 0, void 0, function () {
                var hashedPassword;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, bcrypt.hash(newPassword, 10)];
                        case 1:
                            hashedPassword = _a.sent();
                            return [2 /*return*/, this.databaseService.user.update({
                                    where: { id: id },
                                    data: { password: hashedPassword },
                                })];
                    }
                });
            });
        };
        // 8. DELETE ACCOUNT (The Nuclear Option - Fixed)
        UsersService_1.prototype.deleteUser = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var e_1, e_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: 
                        // 1. Delete related connections
                        return [4 /*yield*/, this.databaseService.connection.deleteMany({
                                where: { OR: [{ senderId: id }, { receiverId: id }] }
                            })];
                        case 1:
                            // 1. Delete related connections
                            _a.sent();
                            // 2. Delete related messages (New addition for safety)
                            return [4 /*yield*/, this.databaseService.message.deleteMany({
                                    where: { OR: [{ senderId: id }, { receiverId: id }] }
                                })];
                        case 2:
                            // 2. Delete related messages (New addition for safety)
                            _a.sent();
                            // 3. Delete their pitches
                            return [4 /*yield*/, this.databaseService.pitch.deleteMany({
                                    where: { userId: id }
                                })];
                        case 3:
                            // 3. Delete their pitches
                            _a.sent();
                            _a.label = 4;
                        case 4:
                            _a.trys.push([4, 6, , 7]);
                            return [4 /*yield*/, this.databaseService.entrepreneurProfile.delete({ where: { userId: id } })];
                        case 5:
                            _a.sent();
                            return [3 /*break*/, 7];
                        case 6:
                            e_1 = _a.sent();
                            return [3 /*break*/, 7];
                        case 7:
                            _a.trys.push([7, 9, , 10]);
                            return [4 /*yield*/, this.databaseService.investorProfile.delete({ where: { userId: id } })];
                        case 8:
                            _a.sent();
                            return [3 /*break*/, 10];
                        case 9:
                            e_2 = _a.sent();
                            return [3 /*break*/, 10];
                        case 10: 
                        // 5. Finally, Delete the User
                        return [2 /*return*/, this.databaseService.user.delete({ where: { id: id } })];
                    }
                });
            });
        };
        // 9. UPGRADE TO PREMIUM
        UsersService_1.prototype.upgradeToPremium = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var sub;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.databaseService.subscription.findUnique({ where: { userId: userId } })];
                        case 1:
                            sub = _a.sent();
                            if (sub) {
                                return [2 /*return*/, this.databaseService.subscription.update({
                                        where: { userId: userId },
                                        data: { plan: 'PREMIUM' }
                                    })];
                            }
                            else {
                                return [2 /*return*/, this.databaseService.subscription.create({
                                        data: {
                                            userId: userId,
                                            plan: 'PREMIUM'
                                        }
                                    })];
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        return UsersService_1;
    }());
    __setFunctionName(_classThis, "UsersService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        UsersService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return UsersService = _classThis;
}();
exports.UsersService = UsersService;
