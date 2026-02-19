import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) { }

    @Get('health')
    @ApiOperation({ summary: 'Check system health' })
    @ApiResponse({ status: 200, description: 'System is operational' })
    getHealth(): string {
        return this.appService.getHealth();
    }
}
