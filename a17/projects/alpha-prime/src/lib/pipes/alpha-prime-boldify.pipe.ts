import { Pipe, PipeTransform } from '@angular/core';

/** returns the inner HTML boldifying the given.
 * Usage alphaBoldify:term
 * where term is then part of the text to display in bold */
@Pipe({
  name: 'alphaPrimeBoldify',
  standalone: true
})
export class AlphaPrimeBoldifyPipe implements PipeTransform {

  /** returns the inner HTML boldifying the given term.
   * Usage alphaBoldify:term
   * where term is then part of the text to display in bold.
   * Example 'France' | alphaBoldify:'fr'
   * will return &lt;strong&gt;Fr&lt;/strong&gt;ance */
  transform(value: unknown, ...args: unknown[]): unknown {

    if (value == null) {
      return '';
    }
    if (args.length == 0
       || args[0] == null) {
      return value;
    }
    const input = value as string;
    const term = args[0] as string;
    const len = term.length;

    const lcInput = input.toLowerCase();
    const lcTerm = term.toLowerCase();

    const pos = lcInput.indexOf(lcTerm);
    if (pos < 0) return value;

    const leftPart = input.substring(0, pos);
    const termPart = input.substring(pos, pos + len);
    const rightPart = input.substring(pos + len);
    return `${leftPart}<strong>${termPart}</strong>${rightPart}`;
  }

}
