import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import dayjs from 'dayjs';

@Injectable()
export class StatisticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserCountByCountry() {
    const result = await this.prisma.user.groupBy({
      by: ['country'],
      _count: {
        country: true,
      },
      where: {
        country: {
          not: null,
        },
      },
      orderBy: {
        _count: {
          country: 'desc',
        },
      },
    });

    return result.map((item) => ({
      country: item.country,
      count: item._count.country,
    }));
  }

  async getNumbers() {
    const usersCount = await this.prisma.user.count();

    const activeUsersCount = await this.prisma.user.count({
      where: {
        updatedAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 30)),
        },
      },
    });

    const newUsersLastMonth = await this.prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 30)),
        },
      },
    });

    const uniqueCountriesCount = await this.prisma.user.groupBy({
      by: ['country'],
      _count: {
        country: true,
      },
      where: {
        country: {
          not: null,
        },
      },
    });

    return [
      {
        name: 'Users',
        value: usersCount,
      },
      {
        name: 'Active Users',
        value: activeUsersCount,
      },
      {
        name: 'Last Month',
        value: newUsersLastMonth,
      },
      {
        name: 'Countries',
        value: uniqueCountriesCount.length,
      },
    ];
  }

  async getUserRegistrationsByMonth() {
    const currentMonth = new Date().getMonth(); // Текущий месяц от 0 до 11
    const currentYear = new Date().getFullYear(); // Текущий год

    // Начало отсчет периода за год относительно текщего месяца
    const startDate = new Date(currentYear - 1, currentMonth + 1, 1);

    // Конец отчетного периода (последний день текущего месяца)
    const endDate = new Date(currentYear, currentMonth + 1, 0);

    // Генерация всех месяцев между startDate и endDate
    const allMonths = this.generateMonths(startDate, endDate);

    // Группировка пользователей по месяцу создания (createdAt)
    const registrations = await this.prisma.user.groupBy({
      by: ['createdAt'],
      _count: true,
      orderBy: { createdAt: 'asc' },
      where: {
        createdAt: {
          gte: startDate, // От начала отчетного периода
          lte: endDate, // От конца отчетного периода
        },
      },
    });

    const registrationMap = new Map<string, number>(); // Map для хранения количества регистраций за месяц

    for (const reg of registrations) {
      const month = reg.createdAt.getMonth() + 1; // Получаем месяц создания от 1 до 12
      const year = reg.createdAt.getFullYear(); // Получаем год создания
      const key = `${year}-${month}`; // Создаем ключ в формате год-месяц

      if (registrationMap.has(key)) {
        const currentCount = registrationMap.get(key); // Получаем текущее значение
        if (currentCount !== undefined) {
          // Проверяем, что оно не undefined
          registrationMap.set(key, currentCount + reg._count);
        }
        // Если ключ уже существует, увеличиваем значение на количество регистраций
      } else {
        // Если ключ не существет, добавляем новую запись
        registrationMap.set(key, reg._count);
      }
    }
    // Преобразование числа месяца в название
    return allMonths.map(({ year, month }) => {
      const key = `${year}-${month}`;
      const monthName = dayjs(new Date(year, month - 1)).format('MMMM');

      return {
        month: monthName,
        year,
        count: registrationMap.get(key) || 0,
      };
    });
  }

  private generateMonths(
    start: Date,
    end: Date,
  ): { month: number; year: number }[] {
    const current = new Date(start); // Копируем начльную дату
    const endMonth = new Date(end); // Копируем конечную дату
    const months: { month: number; year: number }[] = []; // Массив для хранения месяцев

    while (current < endMonth) {
      months.push({
        month: current.getMonth() + 1, // Добавляем месяц от 1 до 12
        year: current.getFullYear(), //Добавляем год
      });
      current.setMonth(current.getMonth() + 1); // Переходи к следующему месяцу
    }

    // Добавление последнего месяца
    months.push({
      month: endMonth.getMonth() + 1, // Месяц (от 1 до 12)
      year: endMonth.getFullYear(), // Год
    });

    return months;
  }
}
