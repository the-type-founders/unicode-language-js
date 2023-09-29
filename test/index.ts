import { expect } from 'chai';
import detect, { names } from '../src/index.ts';

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
        tag: 't1',
        name: 'test1',
        native: 'test1',
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
        tag: 't1',
        name: 'test1',
        native: 'test1',
        count: 3,
        total: 3,
      },
    ]);
  });

  it('returns the test language if the threshold is partially met', () => {
    expect(detect([1, 2], 0.6)).to.eql([
      {
        tag: 't1',
        name: 'test1',
        native: 'test1',
        count: 2,
        total: 3,
      },
    ]);
  });

  it('returns multiple languages', () => {
    expect(detect([1, 4], 0)).to.eql([
      {
        tag: 't1',
        name: 'test1',
        native: 'test1',
        count: 1,
        total: 3,
      },
      {
        tag: 't2',
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
        tag: 't3',
        name: 'test3',
        native: 'test3',
        count: 1,
        total: 3,
      },
      {
        tag: 't4',
        name: 'test4',
        native: 'test4',
        count: 1,
        total: 1,
      },
    ]);
  });
});

describe('Names', () => {
  it('returns the name of a language', () => {
    expect(names.get('t1')).to.eql('test1');
    expect(names.get('t2')).to.eql('test2');
  });
});
