import { DomainEvent } from '../domain/DomainEvent';

export interface EventPublisher {
  publish(event: DomainEvent): Promise<void>;
}

export class SimpleEventPublisher implements EventPublisher {
  async publish(event: DomainEvent): Promise<void> {
    // in produzione qui puoi pushare su bus, Kafka, SNS, ecc.
    console.info('[DomainEvent]', event.type, JSON.stringify(event.payload));
  }
}