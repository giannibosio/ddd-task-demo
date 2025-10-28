import { Title } from '../../src/domain/Title';

describe('Title (Value Object)', () => {
  test('throws when empty', () => {
    expect(() => new Title('')).toThrow('Title cannot be empty');
  });

  test('equals compares by value', () => {
    const a = new Title('Fare la spesa');
    const b = new Title('Fare la spesa');
    expect(a.equals(b)).toBe(true);
  });
});