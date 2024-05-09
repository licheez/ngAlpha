export class AlphaEmsUsoOptionSet {
  keys: string[];
  pairs: { key: string, value: string }[];
  constructor(
    keys: string[],
    options?: Map<string, string>) {
    this.keys = keys;
    this.pairs = [];
    if (options) {
      options.forEach(
        (value: string, key: string) => {
          this.pairs.push({ key: key, value: value });
        });
    }
  }
}
