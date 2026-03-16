"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcademyController = void 0;
var common_1 = require("@nestjs/common");
var AcademyController = function () {
    var _classDecorators = [(0, common_1.Controller)('academy')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _findAll_decorators;
    var _findOne_decorators;
    var _completeLesson_decorators;
    var _getLesson_decorators;
    var _seed_decorators;
    var AcademyController = _classThis = /** @class */ (function () {
        function AcademyController_1(academyService) {
            this.academyService = (__runInitializers(this, _instanceExtraInitializers), academyService);
        }
        AcademyController_1.prototype.findAll = function () {
            return this.academyService.findAll();
        };
        AcademyController_1.prototype.findOne = function (id, userId) {
            return this.academyService.findOne(id, userId);
        };
        AcademyController_1.prototype.completeLesson = function (lessonId, userId) {
            return this.academyService.completeLesson(userId, lessonId);
        };
        AcademyController_1.prototype.getLesson = function (id) {
            return this.academyService.getLesson(id);
        };
        AcademyController_1.prototype.seed = function () {
            return this.academyService.seed();
        };
        return AcademyController_1;
    }());
    __setFunctionName(_classThis, "AcademyController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _findAll_decorators = [(0, common_1.Get)()];
        _findOne_decorators = [(0, common_1.Get)(':id')];
        _completeLesson_decorators = [(0, common_1.Post)('lesson/:lessonId/complete')];
        _getLesson_decorators = [(0, common_1.Get)('lesson/:id')];
        _seed_decorators = [(0, common_1.Post)('seed')];
        __esDecorate(_classThis, null, _findAll_decorators, { kind: "method", name: "findAll", static: false, private: false, access: { has: function (obj) { return "findAll" in obj; }, get: function (obj) { return obj.findAll; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findOne_decorators, { kind: "method", name: "findOne", static: false, private: false, access: { has: function (obj) { return "findOne" in obj; }, get: function (obj) { return obj.findOne; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _completeLesson_decorators, { kind: "method", name: "completeLesson", static: false, private: false, access: { has: function (obj) { return "completeLesson" in obj; }, get: function (obj) { return obj.completeLesson; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getLesson_decorators, { kind: "method", name: "getLesson", static: false, private: false, access: { has: function (obj) { return "getLesson" in obj; }, get: function (obj) { return obj.getLesson; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _seed_decorators, { kind: "method", name: "seed", static: false, private: false, access: { has: function (obj) { return "seed" in obj; }, get: function (obj) { return obj.seed; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AcademyController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AcademyController = _classThis;
}();
exports.AcademyController = AcademyController;
