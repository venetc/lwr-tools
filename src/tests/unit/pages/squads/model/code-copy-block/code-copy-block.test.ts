import { describe, expect, it } from 'vitest';

import { squadCodeCopyBlock, unitCodeCopyBlock } from '@pages/squads/model/code-copy-block';

import {
  CURRENT_CARD,
  ONE_OUTDATED_TEXT,
  OUTDATED_CARD,
  SECOND_OUTDATED_CARD,
  SQUAD_BLOCK_TITLE,
  TWO_OUTDATED_TEXT,
  UNIT_BLOCK,
} from './code-copy-block.mock';

describe('unitCodeCopyBlock', () => {
  it('lets a Unit of a regular build be copied', () => {
    const block = unitCodeCopyBlock(CURRENT_CARD);

    expect(block).toBeNull();
  });

  it('blocks a Unit of an Outdated build with a hint', () => {
    const block = unitCodeCopyBlock(OUTDATED_CARD);

    expect(block).toEqual(UNIT_BLOCK);
  });
});

describe('squadCodeCopyBlock', () => {
  it('lets a Squad without Outdated builds be copied', () => {
    const block = squadCodeCopyBlock([CURRENT_CARD, CURRENT_CARD]);

    expect(block).toBeNull();
  });

  it('blocks a Squad with an Outdated build', () => {
    const block = squadCodeCopyBlock([CURRENT_CARD, OUTDATED_CARD]);

    expect(block?.title).toBe(SQUAD_BLOCK_TITLE);
  });

  it('names the Outdated build', () => {
    const block = squadCodeCopyBlock([CURRENT_CARD, OUTDATED_CARD]);

    expect(block?.description).toBe(ONE_OUTDATED_TEXT);
  });

  it('lists each Outdated build once in Squad order', () => {
    const block = squadCodeCopyBlock([OUTDATED_CARD, CURRENT_CARD, SECOND_OUTDATED_CARD, OUTDATED_CARD]);

    expect(block?.description).toBe(TWO_OUTDATED_TEXT);
  });
});
