import { expect } from 'chai';
import data from '../data.json';

// Zero out the real data.
data.splice(0, data.length);
data[0] = { tag: 'test', codepoints: [[1, 3]], name: 'test', native: 'test' };
data[1] = {
  tag: 'test2',
  codepoints: [[4, 6]],
  name: 'test2',
  native: 'test2',
};
data[2] = {
  tag: 'test3',
  codepoints: [[7, 9]],
  name: 'test3',
  native: 'test3',
};
data[3] = {
  tag: 'test4',
  codepoints: [[8, 8]],
  name: 'test4',
  native: 'test4',
};

import detect from '../src/index';

describe('Detects languages', () => {
  it('returns an empty array when not given code points', () => {
    expect(detect([])).to.eql([]);
  });

  it('returns an empty array when given an invalid code point', () => {
    expect(detect([256], 0)).to.eql([]);
  });

  it('returns the test language', () => {
    expect(detect([1], 0)).to.eql([
      {
        tag: 'test',
        name: 'test',
        native: 'test',
        count: 1,
        total: 3,
      },
    ]);
  });

  it('does not return the test language if the threshold is not met', () => {
    expect(detect([1, 2], 1)).to.eql([]);
  });

  it('returns the test language if the threshold is met', () => {
    expect(detect([1, 2, 3], 1)).to.eql([
      {
        tag: 'test',
        name: 'test',
        native: 'test',
        count: 3,
        total: 3,
      },
    ]);
  });

  it('returns the test language if the threshold is partially met', () => {
    expect(detect([1, 2], 0.6)).to.eql([
      {
        tag: 'test',
        name: 'test',
        native: 'test',
        count: 2,
        total: 3,
      },
    ]);
  });

  it('returns multiple languages', () => {
    expect(detect([1, 4], 0)).to.eql([
      {
        tag: 'test',
        name: 'test',
        native: 'test',
        count: 1,
        total: 3,
      },
      {
        tag: 'test2',
        name: 'test2',
        native: 'test2',
        count: 1,
        total: 3,
      },
    ]);
  });

  it('returns overlapping languages', () => {
    expect(detect([8], 0)).to.eql([
      {
        tag: 'test3',
        name: 'test3',
        native: 'test3',
        count: 1,
        total: 3,
      },
      {
        tag: 'test4',
        name: 'test4',
        native: 'test4',
        count: 1,
        total: 1,
      },
    ]);
  });
});
