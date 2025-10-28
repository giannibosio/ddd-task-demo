export class TaskId {
  private readonly _value: string;

  constructor(value: string) {
    if (!value || value.trim() === '') throw new Error('TaskId required');
    this._value = value;
    Object.freeze(this);
  }

  toString(): string {
    return this._value;
  }

  equals(other?: TaskId): boolean {
    return other instanceof TaskId && other._value === this._value;
  }
}