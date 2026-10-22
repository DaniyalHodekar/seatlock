import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller.js';
import { EventsService } from './events.service.js';

describe('EventsController', () => {
  let controller: EventsController;

  const findUpcoming = vi.fn();

  beforeEach(async () => {
    findUpcoming.mockReset();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [{ provide: EventsService, useValue: { findUpcoming } }],
    }).compile();

    controller = module.get<EventsController>(EventsController);
  });

  it('returns the events the service provides', async () => {
    const fakeEvents = [
      { id: 1, title: 'EventName', venue: 'HallName', startsAt: new Date() },
    ];
    findUpcoming.mockResolvedValue(fakeEvents);

    const result = await controller.getEvents();

    expect(result).toBe(fakeEvents);
    expect(findUpcoming).toHaveBeenCalled();
  });
});
