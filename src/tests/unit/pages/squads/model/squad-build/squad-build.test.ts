import { describe, expect, it } from 'vitest';

import { unitWearer } from '@pages/squads/model/squad-build';

import { createBiosoldierBuildMock, GENE_MODS, MEC_BUILD, MEC_WEARER, OFFICER_PERKS, PSIONIC_ABILITIES, SHIV_BUILD, SHIV_WEARER, SNIPER_WEARER } from './squad-build.mock';

describe('unitWearer', () => {
  it('takes the class of a biosoldier build', () => {
    const wearer = unitWearer(createBiosoldierBuildMock());

    expect(wearer).toEqual(SNIPER_WEARER);
  });

  it('counts a gene mod of a biosoldier build', () => {
    const wearer = unitWearer(createBiosoldierBuildMock({ geneMods: GENE_MODS }));

    expect(wearer.hasGeneMod).toBe(true);
  });

  it('counts a psionic ability of a biosoldier build', () => {
    const wearer = unitWearer(createBiosoldierBuildMock({ psionicAbilities: PSIONIC_ABILITIES }));

    expect(wearer.hasPsionicAbility).toBe(true);
  });

  it('makes a biosoldier with an officer perk an Officer', () => {
    const wearer = unitWearer(createBiosoldierBuildMock({ officerPerks: OFFICER_PERKS }));

    expect(wearer.isOfficer).toBe(true);
  });

  it('takes the MEC class of a MEC build, never an Officer', () => {
    const wearer = unitWearer(MEC_BUILD);

    expect(wearer).toEqual(MEC_WEARER);
  });

  it('has no class for a SHIV', () => {
    const wearer = unitWearer(SHIV_BUILD);

    expect(wearer).toEqual(SHIV_WEARER);
  });
});
