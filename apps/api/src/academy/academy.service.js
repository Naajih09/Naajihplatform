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
exports.AcademyService = void 0;
var common_1 = require("@nestjs/common");
var AcademyService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AcademyService = _classThis = /** @class */ (function () {
        function AcademyService_1(databaseService) {
            this.databaseService = databaseService;
        }
        // 1️⃣ GET ALL PROGRAMS (With optional progress count)
        AcademyService_1.prototype.findAll = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.databaseService.program.findMany({
                            include: {
                                modules: {
                                    include: {
                                        lessons: {
                                            include: {
                                                progress: userId ? { where: { userId: userId } } : false,
                                            },
                                        },
                                    },
                                },
                            },
                        })];
                });
            });
        };
        // 2️⃣ GET ONE PROGRAM (With lessons + progress)
        AcademyService_1.prototype.findOne = function (programId, userId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.databaseService.program.findUnique({
                            where: { id: programId },
                            include: {
                                modules: {
                                    orderBy: { order: 'asc' },
                                    include: {
                                        lessons: {
                                            orderBy: { order: 'asc' },
                                            include: {
                                                progress: { where: { userId: userId } },
                                            },
                                        },
                                    },
                                },
                            },
                        })];
                });
            });
        };
        // 3️⃣ GET ONE LESSON
        AcademyService_1.prototype.getLesson = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.databaseService.lesson.findUnique({
                            where: { id: id },
                        })];
                });
            });
        };
        // 4️⃣ MARK LESSON COMPLETE
        AcademyService_1.prototype.completeLesson = function (userId, lessonId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.databaseService.userLessonProgress.upsert({
                            where: { userId_lessonId: { userId: userId, lessonId: lessonId } },
                            update: { isCompleted: true },
                            create: { userId: userId, lessonId: lessonId, isCompleted: true },
                        })];
                });
            });
        };
        // 5️⃣ JOIN PROGRAM (ProgramEnrollment)
        AcademyService_1.prototype.joinProgram = function (userId, programId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.databaseService.programEnrollment.upsert({
                            where: { userId_programId: { userId: userId, programId: programId } },
                            update: {},
                            create: { userId: userId, programId: programId },
                        })];
                });
            });
        };
        // 6️⃣ SEED PROGRAMS + MODULES + LESSONS
        AcademyService_1.prototype.seed = function () {
            return __awaiter(this, void 0, void 0, function () {
                var programsData, createdCount, _i, programsData_1, programData, existingProgram;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            programsData = [
                                {
                                    title: "1. Build a Profitable Business in 30 Days",
                                    description: "The Flagship Program. Go from zero to your first customer in one month. No theory, just execution.",
                                    cohort: "Cohort 1 (Feb 2026)",
                                    modules: [
                                        {
                                            title: "Week 1: Finding a Pain-Killer Idea",
                                            order: 1,
                                            unlockDate: new Date(),
                                            lessons: [
                                                {
                                                    title: "The Pain-Killer Framework",
                                                    order: 1,
                                                    videoUrl: "", // ✅ FIXED: Replaced ", with ""
                                                    content: "<h3>The Pain-Killer Framework</h3><p>Don't build vitamins. Build Pain-Killers. Go to the market and find 10 people screaming for a solution.</p><strong>Task:</strong> Interview 5 potential customers today.",
                                                    contentType: "video",
                                                    duration: 600,
                                                },
                                                {
                                                    title: "Interview Customers",
                                                    order: 2,
                                                    videoUrl: "", // ✅ FIXED
                                                    content: "Task: Interview 5 potential customers today.",
                                                    contentType: "video",
                                                    duration: 300,
                                                },
                                            ],
                                        },
                                        {
                                            title: "Week 2: The MVP (Minimum Viable Product)",
                                            order: 2,
                                            unlockDate: new Date(),
                                            lessons: [
                                                {
                                                    title: "Build it Ugly",
                                                    order: 1,
                                                    videoUrl: "", // ✅ FIXED
                                                    content: "<h3>Build it Ugly</h3><p>If you aren't embarrassed by your first version, you launched too late. Do not code yet. Use WhatsApp, Excel, or paper.</p>",
                                                    contentType: "video",
                                                    duration: 600,
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ];
                            createdCount = 0;
                            _i = 0, programsData_1 = programsData;
                            _a.label = 1;
                        case 1:
                            if (!(_i < programsData_1.length)) return [3 /*break*/, 5];
                            programData = programsData_1[_i];
                            return [4 /*yield*/, this.databaseService.program.findFirst({
                                    where: { title: programData.title },
                                })];
                        case 2:
                            existingProgram = _a.sent();
                            if (!!existingProgram) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.databaseService.program.create({
                                    data: {
                                        title: programData.title,
                                        description: programData.description,
                                        cohort: programData.cohort,
                                        modules: {
                                            create: programData.modules.map(function (mod) { return ({
                                                title: mod.title,
                                                order: mod.order,
                                                unlockDate: mod.unlockDate,
                                                lessons: {
                                                    create: mod.lessons.map(function (lesson) { return ({
                                                        title: lesson.title,
                                                        order: lesson.order,
                                                        videoUrl: lesson.videoUrl,
                                                        content: lesson.content,
                                                        contentType: lesson.contentType,
                                                        duration: lesson.duration,
                                                    }); }),
                                                },
                                            }); }),
                                        },
                                    },
                                })];
                        case 3:
                            _a.sent();
                            createdCount++;
                            _a.label = 4;
                        case 4:
                            _i++;
                            return [3 /*break*/, 1];
                        case 5: return [2 /*return*/, { message: "".concat(createdCount, " programs created successfully!") }];
                    }
                });
            });
        };
        return AcademyService_1;
    }());
    __setFunctionName(_classThis, "AcademyService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AcademyService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AcademyService = _classThis;
}();
exports.AcademyService = AcademyService;
