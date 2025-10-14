import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Auth('ADMIN')
  @Get(':key')
  getSeting(@Param('key') key: string) {
    return this.settingsService.getSettingByKey(key);
  }

  @Auth('ADMIN')
  @Post()
  setSetting(@Body() data: { key: string; value: string }) {
    return this.settingsService.setSetting(data.key, data.value);
  }
}
