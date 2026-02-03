"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const firebase_config_1 = require("@turnos/firebase-config");
const users_service_1 = require("../users/users.service");
let AuthService = class AuthService {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    async register(createUserDto) {
        const firebaseAuth = (0, firebase_config_1.getAuth)();
        const firebaseUser = await firebaseAuth.createUser({
            email: createUserDto.email,
            password: createUserDto.password,
        });
        const user = await this.usersService.create({
            ...createUserDto,
            firebaseUid: firebaseUser.uid,
        });
        return { user };
    }
    async login(authFirebaseDto) {
        try {
            const firebaseAuth = (0, firebase_config_1.getAuth)();
            const decoded = await firebaseAuth.verifyIdToken(authFirebaseDto.idToken);
            const user = await this.usersService.findByFirebaseUid(decoded.uid);
            if (!user) {
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            return { user };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
    }
    async validateUser(userId) {
        return this.usersService.findOne(userId);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], AuthService);
//# sourceMappingURL=auth.service.js.map