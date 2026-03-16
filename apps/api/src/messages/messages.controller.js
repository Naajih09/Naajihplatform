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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesController = exports.CreateMessageDto = exports.MessageType = void 0;
var common_1 = require("@nestjs/common");
var class_validator_1 = require("class-validator");
// Standard DTOs embedded for convenience
var MessageType;
(function (MessageType) {
    MessageType["TEXT"] = "TEXT";
    MessageType["IMAGE"] = "IMAGE";
    MessageType["AUDIO"] = "AUDIO";
    MessageType["PDF"] = "PDF";
})(MessageType || (exports.MessageType = MessageType = {}));
var CreateMessageDto = function () {
    var _a;
    var _content_decorators;
    var _content_initializers = [];
    var _content_extraInitializers = [];
    var _senderId_decorators;
    var _senderId_initializers = [];
    var _senderId_extraInitializers = [];
    var _receiverId_decorators;
    var _receiverId_initializers = [];
    var _receiverId_extraInitializers = [];
    var _attachmentUrl_decorators;
    var _attachmentUrl_initializers = [];
    var _attachmentUrl_extraInitializers = [];
    var _type_decorators;
    var _type_initializers = [];
    var _type_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateMessageDto() {
                this.content = __runInitializers(this, _content_initializers, void 0);
                this.senderId = (__runInitializers(this, _content_extraInitializers), __runInitializers(this, _senderId_initializers, void 0));
                this.receiverId = (__runInitializers(this, _senderId_extraInitializers), __runInitializers(this, _receiverId_initializers, void 0));
                this.attachmentUrl = (__runInitializers(this, _receiverId_extraInitializers), __runInitializers(this, _attachmentUrl_initializers, void 0));
                this.type = (__runInitializers(this, _attachmentUrl_extraInitializers), __runInitializers(this, _type_initializers, void 0));
                __runInitializers(this, _type_extraInitializers);
            }
            return CreateMessageDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _content_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _senderId_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _receiverId_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _attachmentUrl_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _type_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(MessageType)];
            __esDecorate(null, null, _content_decorators, { kind: "field", name: "content", static: false, private: false, access: { has: function (obj) { return "content" in obj; }, get: function (obj) { return obj.content; }, set: function (obj, value) { obj.content = value; } }, metadata: _metadata }, _content_initializers, _content_extraInitializers);
            __esDecorate(null, null, _senderId_decorators, { kind: "field", name: "senderId", static: false, private: false, access: { has: function (obj) { return "senderId" in obj; }, get: function (obj) { return obj.senderId; }, set: function (obj, value) { obj.senderId = value; } }, metadata: _metadata }, _senderId_initializers, _senderId_extraInitializers);
            __esDecorate(null, null, _receiverId_decorators, { kind: "field", name: "receiverId", static: false, private: false, access: { has: function (obj) { return "receiverId" in obj; }, get: function (obj) { return obj.receiverId; }, set: function (obj, value) { obj.receiverId = value; } }, metadata: _metadata }, _receiverId_initializers, _receiverId_extraInitializers);
            __esDecorate(null, null, _attachmentUrl_decorators, { kind: "field", name: "attachmentUrl", static: false, private: false, access: { has: function (obj) { return "attachmentUrl" in obj; }, get: function (obj) { return obj.attachmentUrl; }, set: function (obj, value) { obj.attachmentUrl = value; } }, metadata: _metadata }, _attachmentUrl_initializers, _attachmentUrl_extraInitializers);
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: function (obj) { return "type" in obj; }, get: function (obj) { return obj.type; }, set: function (obj, value) { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateMessageDto = CreateMessageDto;
var MessagesController = function () {
    var _classDecorators = [(0, common_1.Controller)('messages')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _create_decorators;
    var _getConversation_decorators;
    var _getPartners_decorators;
    var _markAsRead_decorators;
    var _deleteMessage_decorators;
    var MessagesController = _classThis = /** @class */ (function () {
        function MessagesController_1(messagesService) {
            this.messagesService = (__runInitializers(this, _instanceExtraInitializers), messagesService);
        }
        // POST /api/messages -> Send a text
        MessagesController_1.prototype.create = function (body) {
            return this.messagesService.create(body);
        };
        // GET /api/messages/conversation/:myId/:otherId
        MessagesController_1.prototype.getConversation = function (myId, otherId) {
            return this.messagesService.getConversation(myId, otherId);
        };
        // GET /api/messages/partners/:myId -> List of friends to chat with
        MessagesController_1.prototype.getPartners = function (myId) {
            return this.messagesService.getMyChatPartners(myId);
        };
        // PATCH /api/messages/:messageId/read -> Mark as read
        MessagesController_1.prototype.markAsRead = function (messageId, userId // Ideally replace with @Request() req.user.id when JwtAuthGuard is added globally
        ) {
            return this.messagesService.markAsRead(messageId, userId);
        };
        // DELETE /api/messages/:messageId -> Unsend/Delete message
        MessagesController_1.prototype.deleteMessage = function (messageId, userId // Passed as query param: ?userId=xxx
        ) {
            return this.messagesService.deleteMessage(messageId, userId);
        };
        return MessagesController_1;
    }());
    __setFunctionName(_classThis, "MessagesController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _create_decorators = [(0, common_1.Post)()];
        _getConversation_decorators = [(0, common_1.Get)('conversation/:myId/:otherId')];
        _getPartners_decorators = [(0, common_1.Get)('partners/:myId')];
        _markAsRead_decorators = [(0, common_1.Patch)(':messageId/read')];
        _deleteMessage_decorators = [(0, common_1.Delete)(':messageId')];
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: function (obj) { return "create" in obj; }, get: function (obj) { return obj.create; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getConversation_decorators, { kind: "method", name: "getConversation", static: false, private: false, access: { has: function (obj) { return "getConversation" in obj; }, get: function (obj) { return obj.getConversation; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getPartners_decorators, { kind: "method", name: "getPartners", static: false, private: false, access: { has: function (obj) { return "getPartners" in obj; }, get: function (obj) { return obj.getPartners; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _markAsRead_decorators, { kind: "method", name: "markAsRead", static: false, private: false, access: { has: function (obj) { return "markAsRead" in obj; }, get: function (obj) { return obj.markAsRead; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteMessage_decorators, { kind: "method", name: "deleteMessage", static: false, private: false, access: { has: function (obj) { return "deleteMessage" in obj; }, get: function (obj) { return obj.deleteMessage; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MessagesController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MessagesController = _classThis;
}();
exports.MessagesController = MessagesController;
