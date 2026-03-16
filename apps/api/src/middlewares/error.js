"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePrismaError = handlePrismaError;
var common_1 = require("@nestjs/common");
var client_1 = require("@prisma/client");
function handlePrismaError(error) {
    var _a, _b, _c, _d, _e, _f, _g;
    if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
            case 'P2002': // Unique constraint failed
                return new common_1.BadRequestException("Duplicate field value for: ".concat((_b = (_a = error.meta) === null || _a === void 0 ? void 0 : _a.target) === null || _b === void 0 ? void 0 : _b.join(', ')));
            case 'P2003': // Foreign key constraint failed
                return new common_1.BadRequestException("Foreign key constraint failed on: ".concat((_c = error.meta) === null || _c === void 0 ? void 0 : _c.target));
            case 'P2025': // Record not found
                return new common_1.NotFoundException("Resource not found or invalid: ".concat((_e = (_d = error.meta) === null || _d === void 0 ? void 0 : _d.target) !== null && _e !== void 0 ? _e : 'Record'));
            case 'P2010': // Invalid data for query
                return new common_1.BadRequestException("Invalid data provided for query: ".concat((_f = error.meta) === null || _f === void 0 ? void 0 : _f.query));
            case 'P2023': // Invalid operation
                return new common_1.BadRequestException("Invalid operation: ".concat((_g = error.meta) === null || _g === void 0 ? void 0 : _g.operation));
            default:
                return new common_1.BadRequestException("Database error: ".concat(error.message));
        }
    }
    if (error instanceof client_1.Prisma.PrismaClientUnknownRequestError) {
        return new common_1.InternalServerErrorException('An unknown Prisma error occurred');
    }
    // Any other non-Prisma error
    return new common_1.InternalServerErrorException(error.message || 'Unexpected error');
}
