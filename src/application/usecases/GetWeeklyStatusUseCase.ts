import { Clock } from '@ports/Clock';
import { CurrentUserProvider } from '@ports/CurrentUserProvider';
import { WorkLogRepository } from '@ports/WorkLogRepository';
import { addDays, formatIsoDate, startOfWeekMonday, weekdayLabel } from '@/application/time/dateUtils';

export type WeeklyStatusDay = {
  date: string;
  weekday: string;
  totalHours: number;
};

export type GetWeeklyStatusOutput = {
  startDate: string;
  endDateExclusive: string;
  days: WeeklyStatusDay[];
  totalHours: number;
};

export class GetWeeklyStatusUseCase {
  constructor(
    private readonly deps: {
      workLogRepository: WorkLogRepository;
      currentUserProvider: CurrentUserProvider;
      clock: Clock;
    },
  ) {}

  async execute(): Promise<GetWeeklyStatusOutput> {
    const now = this.deps.clock.now();
    const userId = await this.deps.currentUserProvider.getCurrentUserId();

    const start = startOfWeekMonday(now);
    const endExclusive = addDays(start, 7);

    const entries = await this.deps.workLogRepository.listByUserAndDateRange({
      userId,
      startInclusive: start,
      endExclusive,
    });

    const days: WeeklyStatusDay[] = [];
    for (let i = 0; i < 7; i += 1) {
      const dayDate = addDays(start, i);
      const dayKey = formatIsoDate(dayDate);

      const dayTotal = entries
        .filter((e) => formatIsoDate(e.createdAt) === dayKey)
        .reduce((sum, e) => sum + e.hoursWorked.value, 0);

      days.push({
        date: dayKey,
        weekday: weekdayLabel(dayDate),
        totalHours: dayTotal,
      });
    }

    const totalHours = days.reduce((sum, d) => sum + d.totalHours, 0);

    return {
      startDate: formatIsoDate(start),
      endDateExclusive: formatIsoDate(endExclusive),
      days,
      totalHours,
    };
  }
}
