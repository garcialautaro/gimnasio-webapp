"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    app.enableCors({
        origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
        credentials: true,
    });
    app.setGlobalPrefix('api');
    const port = process.env.BACKOFFICE_API_PORT || 3001;
    await app.listen(port);
    console.log(`🚀 Backoffice API running on: http://localhost:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map