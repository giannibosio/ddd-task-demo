import { DomainEvent } from '../domain/DomainEvent';

export interface EventPublisher {
  publish(event: DomainEvent): Promise<void>;
}

export class SimpleEventPublisher implements EventPublisher {
  async publish(event: DomainEvent): Promise<void> {
    // demo: loggare l'evento. In produzione qui puoi inviare a un bus, Kafka, ecc.
    console.info('[DomainEvent]', event.type, JSON.stringify(event.payload));
  }
}