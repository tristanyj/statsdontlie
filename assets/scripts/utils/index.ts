import type { d3GSelection, FormatType } from '~/types';

function wrapText(text: string, width: number): string[] {
  const words = text.split(/\s+/).reverse();
  const lines: string[] = [];
  let line: string[] = [];
  let lineLength = 0;
  const spaceWidth = 4; // Approximate space width

  while (words.length > 0) {
    const word = words.pop()!;
    const wordWidth = word.length * 5.5; // Approximate width per character

    if (lineLength + wordWidth + (line.length > 0 ? spaceWidth : 0) > width) {
      if (line.length > 0) {
        lines.push(line.join(' '));
        line = [word];
        lineLength = wordWidth;
      } else {
        // If single word is too long, just add it
        lines.push(word);
      }
    } else {
      line.push(word);
      lineLength += wordWidth + (line.length > 0 ? spaceWidth : 0);
    }
  }

  if (line.length > 0) {
    lines.push(line.join(' '));
  }

  return lines;
}

function formatNumber(value: number, decimals?: number): string {
  if (value < 1e3) return value.toFixed(decimals ?? 1);
  if (value < 1e6) return `${(value / 1e3).toFixed(decimals ?? 1)}k`;
  if (value < 1e9) return `${value / 1e6}M`;
  return `${value / 1e9}B`;
}

function shouldFlipText(midAngle: number) {
  return midAngle > Math.PI / 2 && midAngle < (3 * Math.PI) / 2;
}

function calcTextLength(g: d3GSelection, id: string, text: string, fontSize: number) {
  const tempText = g
    .append('text')
    .append('textPath')
    .attr('href', `#${id}`)
    .style('font-size', fontSize)
    .text(text)
    .style('visibility', 'hidden');
  const textLength = tempText.node()?.getComputedTextLength() || 0;
  tempText.remove();
  return textLength;
}

function withUnit(value: number, formatType: FormatType) {
  switch (formatType) {
    case 'percent':
      return `${value}%`;
    default:
      return `${value}`;
  }
}

export { wrapText, formatNumber, shouldFlipText, calcTextLength, withUnit };
