export interface DomainEvent {
  readonly type: string;
  readonly occurredOn: Date;
  readonly payload?: unknown;
}