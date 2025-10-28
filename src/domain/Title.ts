export class Title {
  private readonly _text: string;

  constructor(text: string) {
    if (!text || text.trim().length === 0) throw new Error('Title cannot be empty');
    this._text = text.trim();
    Object.freeze(this);
  }

  toString(): string {
    return this._text;
  }

  equals(other?: Title): boolean {
    return other instanceof Title && other._text === this._text;
  }
}