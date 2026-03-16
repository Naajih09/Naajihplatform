"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var bcrypt = require("bcryptjs");
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var password, admin, investor, entrepreneur, aspirant, pitch;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, bcrypt.hash('Password123!', 10)];
                case 1:
                    password = _a.sent();
                    console.log('Seeding users...');
                    return [4 /*yield*/, prisma.user.upsert({
                            where: { email: 'admin@naajih.com' },
                            update: {},
                            create: {
                                email: 'admin@naajih.com',
                                password: password,
                                role: client_1.UserRole.ADMIN,
                                isVerified: true,
                            },
                        })];
                case 2:
                    admin = _a.sent();
                    return [4 /*yield*/, prisma.user.upsert({
                            where: { email: 'investor@naajih.com' },
                            update: {},
                            create: {
                                email: 'investor@naajih.com',
                                password: password,
                                role: client_1.UserRole.INVESTOR,
                                isVerified: true,
                                investorProfile: {
                                    create: {
                                        firstName: 'John',
                                        lastName: 'Doe',
                                        organization: 'Naajih Capital',
                                        minTicketSize: 10000,
                                        maxTicketSize: 500000,
                                        focusIndustries: ['Tech', 'Agriculture'],
                                    },
                                },
                            },
                        })];
                case 3:
                    investor = _a.sent();
                    return [4 /*yield*/, prisma.user.upsert({
                            where: { email: 'entrepreneur@naajih.com' },
                            update: {},
                            create: {
                                email: 'entrepreneur@naajih.com',
                                password: password,
                                role: client_1.UserRole.ENTREPRENEUR,
                                isVerified: true,
                                entrepreneurProfile: {
                                    create: {
                                        firstName: 'Jane',
                                        lastName: 'Smith',
                                        businessName: 'EcoPower Solutions',
                                        industry: 'Energy',
                                        stage: 'Seed',
                                        location: 'Lagos, Nigeria',
                                    },
                                },
                            },
                        })];
                case 4:
                    entrepreneur = _a.sent();
                    return [4 /*yield*/, prisma.user.upsert({
                            where: { email: 'aspirant@naajih.com' },
                            update: {},
                            create: {
                                email: 'aspirant@naajih.com',
                                password: password,
                                role: client_1.UserRole.ASPIRING_BUSINESS_OWNER,
                                isVerified: true,
                            },
                        })];
                case 5:
                    aspirant = _a.sent();
                    console.log('Seeding opportunity (Pitch)...');
                    return [4 /*yield*/, prisma.pitch.create({
                            data: {
                                userId: entrepreneur.id,
                                title: 'Solar for All',
                                tagline: 'Affordable clean energy for rural communities',
                                problemStatement: 'Lack of reliable power in rural areas hindering economic growth.',
                                solution: 'Portable solar kits with pay-as-you-go financing.',
                                traction: '100 pilot households onboarded.',
                                marketSize: '$10B TAM',
                                fundingAsk: '$250k',
                                equityOffer: '10%',
                                category: 'Energy',
                            },
                        })];
                case 6:
                    pitch = _a.sent();
                    console.log('Seeding connection...');
                    // 6. Connection between Investor and Entrepreneur
                    return [4 /*yield*/, prisma.connection.upsert({
                            where: {
                                senderId_receiverId: {
                                    senderId: investor.id,
                                    receiverId: entrepreneur.id,
                                },
                            },
                            update: {},
                            create: {
                                senderId: investor.id,
                                receiverId: entrepreneur.id,
                                status: client_1.ConnectionStatus.PENDING,
                            },
                        })];
                case 7:
                    // 6. Connection between Investor and Entrepreneur
                    _a.sent();
                    console.log('Seeding completed!');
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error(e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
