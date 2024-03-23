import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Message } from '@khlug/constant/message';
import { EventEntity } from '@khlug/khuthon/entities/EventEntity';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,
  ) {}

  async getThisYearEventOrThrowError(): Promise<EventEntity> {
    const year = new Date().getFullYear();

    const event = await this.eventRepository.findOneBy({ year });
    if (!event) {
      throw new NotFoundException(Message.EVENT_NOT_FOUND_ON_THIS_YEAR);
    }

    return event;
  }
}
