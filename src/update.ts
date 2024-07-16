import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { load, DEFAULT_SCHEMA, Type } from 'js-yaml';

const range = new Type('!ruby/range', {
  kind: 'scalar',
  instanceOf: Array,
  represent: (data: Array<number>) => data.join('..'),
  construct: (data) => data.split('..').map(Number),
  resolve: (data) => data.split('..').map(Number),
});

const schema = DEFAULT_SCHEMA.extend([range]);
const DIR = './speakeasy';

async function fetch() {
  const files = await readdir(join(DIR, 'data'));

  // Read the files and parse them as YAML
  const data = await Promise.all(
    files.map(async (file) => {
      const content = await readFile(join(DIR, 'data', file), 'utf8');
      const language: Record<string, any> = load(content, { schema });
      const tag = file.replace('.yml', '');

      // Convert the codepoints to a more usable format
      language.codepoints = language.codepoints
        .map((codepoint: Array<number> | number) => {
          if (Array.isArray(codepoint)) {
            return codepoint;
          } else {
            return [codepoint, codepoint];
          }
          // Unfortunatly, there are some invalid ranges in the data. We filter
          // them out here. Note that these issues should be fixed upstream.
        })
        .filter((codepoint: Array<number>) => {
          if (codepoint[0] > codepoint[1]) {
            console.error(
              `Invalid range: ${codepoint.join('..')} in ${tag}. Ignoring.`
            );
            return false;
          } else {
            return true;
          }
        });

      // Make sure the codepoints are sorted so we can break early in the detection
      language.codepoints.sort(
        (a: Array<number>, b: Array<number>) => a[0] - b[0]
      );

      return {
        tag,
        name: language.anglicized_name,
        native: language.native_name,
        codepoints: language.codepoints,
      };
    })
  );

  return data;
}

async function main() {
  const data = await fetch();
  await writeFile('./data.json', JSON.stringify(data, null, 2));
}

main();
