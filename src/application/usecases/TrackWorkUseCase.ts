import { CurrentUserProvider } from '@ports/CurrentUserProvider';
import { IdGenerator } from '@ports/IdGenerator';
import { WorkLogRepository } from '@ports/WorkLogRepository';
import { Clock } from '@ports/Clock';
import { HoursWorked } from '@workLog/HoursWorked';
import { TicketId } from '@workLog/TicketId';
import { WorkLogEntry } from '@workLog/WorkLogEntry';
import { WorkLogEntryId } from '@workLog/WorkLogEntryId';
import { addDays, startOfDay } from '@/application/time/dateUtils';

export type TrackWorkInput = {
  hoursWorked: number;
  ticketId?: string;
  description: string;
};

export type TrackWorkOutput = {
  entryId: string;
  totalTodayHours: number;
};

export class TrackWorkUseCase {
  constructor(
    private readonly deps: {
      workLogRepository: WorkLogRepository;
      currentUserProvider: CurrentUserProvider;
      clock: Clock;
      idGenerator: IdGenerator;
    },
  ) {}

  async execute(input: TrackWorkInput): Promise<TrackWorkOutput> {
    const now = this.deps.clock.now();
    const userId = await this.deps.currentUserProvider.getCurrentUserId();

    const entry = WorkLogEntry.create({
      id: WorkLogEntryId.create(this.deps.idGenerator.generate()),
      userId,
      hoursWorked: HoursWorked.create(input.hoursWorked),
      ticketId: input.ticketId ? TicketId.create(input.ticketId) : undefined,
      description: input.description,
      createdAt: now,
      syncedAt: null,
    });

    await this.deps.workLogRepository.add(entry);

    const start = startOfDay(now);
    const end = addDays(start, 1);
    const todayEntries = await this.deps.workLogRepository.listByUserAndDateRange({
      userId,
      startInclusive: start,
      endExclusive: end,
    });

    const totalTodayHours = todayEntries.reduce((sum, e) => sum + e.hoursWorked.value, 0);

    return {
      entryId: entry.id.value,
      totalTodayHours,
    };
  }
}
