import data from '../data.json' assert { type: "json" };

interface Match {
  tag: string;
  name: string;
  native: string;
  count: number;
  total: number;
}

// Convert the data to a format that is faster to process.
const ranges = data.map(({ codepoints }) => codepoints);
const languages = data.map(({ tag, name, native }) => ({
  tag,
  name,
  native,
}));
const totals = Array.from({ length: ranges.length }, () => 0);
const counts = Array.from({ length: ranges.length }, () => 0);

// Precalculate the total number of codepoints for each language.
for (let i = 0; i < ranges.length; i++) {
  for (let j = 0; j < ranges[i].length; j++) {
    totals[i] += ranges[i][j][1] - ranges[i][j][0] + 1;
  }
}

function detect(
  codepoints: Array<number>,
  threshold: number = 0.5
): Array<Match> {
  // Zero the counts array for each run.
  counts.fill(0);

  for (let j = 0; j < codepoints.length; j++) {
    for (let i = 0; i < ranges.length; i++) {
      for (let k = 0; k < ranges[i].length; k++) {
        if (
          codepoints[j] >= ranges[i][k][0] &&
          codepoints[j] <= ranges[i][k][1]
        ) {
          counts[i]++;
        }

        // The ranges are sorted so we can break early.
        if (ranges[i][k][0] > codepoints[j]) {
          break;
        }
      }
    }
  }
  const result = [];

  for (let i = 0; i < languages.length; i++) {
    if (counts[i] / totals[i] >= threshold && counts[i] > 0) {
      result.push({
        tag: languages[i].tag,
        name: languages[i].name,
        native: languages[i].native,
        count: counts[i],
        total: totals[i],
      });
    }
  }

  return result;
}

export default detect;
