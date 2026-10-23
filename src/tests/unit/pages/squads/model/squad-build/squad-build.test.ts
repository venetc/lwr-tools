import { describe, expect, it } from 'vitest';

import { squadBuildCaption, squadBuildClassName } from '@pages/squads/model/squad-build';

import { GOLIATH_SQUAD_BUILD, SHIV_SQUAD_BUILD, SNIPER_SQUAD_BUILD } from './squad-build.mock';

describe('squadBuildClassName', () => {
  it('names the class of a biosoldier build', () => {
    const name = squadBuildClassName(SNIPER_SQUAD_BUILD);

    expect(name).toBe('Sniper');
  });

  it('names the MEC class of a MEC build', () => {
    const name = squadBuildClassName(GOLIATH_SQUAD_BUILD);

    expect(name).toBe('Goliath');
  });

  it('names the unit type of a SHIV build', () => {
    const name = squadBuildClassName(SHIV_SQUAD_BUILD);

    expect(name).toBe('SHIV');
  });
});

describe('squadBuildCaption', () => {
  it('captions a biosoldier build with the unit type and the class', () => {
    const caption = squadBuildCaption(SNIPER_SQUAD_BUILD);

    expect(caption).toBe('Biosoldier · Sniper');
  });

  it('captions a MEC build with the unit type and the MEC class', () => {
    const caption = squadBuildCaption(GOLIATH_SQUAD_BUILD);

    expect(caption).toBe('MEC · Goliath');
  });

  it('captions a SHIV build with the unit type alone', () => {
    const caption = squadBuildCaption(SHIV_SQUAD_BUILD);

    expect(caption).toBe('SHIV');
  });
});
