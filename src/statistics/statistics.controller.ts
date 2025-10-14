import { Controller, Get } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Auth('ADMIN')
  @Get('/registrations-by-month')
  getRegistrationByMonth() {
    return this.statisticsService.getUserRegistrationsByMonth();
  }

  @Auth('ADMIN')
  @Get('/numbers')
  getNumbers() {
    return this.statisticsService.getNumbers();
  }

  @Auth('ADMIN')
  @Get('/count-by-country')
  getCountByCountry() {
    return this.statisticsService.getUserCountByCountry();
  }
}
