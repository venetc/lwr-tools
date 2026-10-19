import { describe, expect, it, vi } from 'vitest';

import { loadoutTiles } from '@pages/squads/model/loadout-tiles';

import {
  AEGIS_LOADOUT,
  AEGIS_TONES,
  ASSAULT,
  AURORA_CAPTIONS,
  AURORA_LOADOUT,
  BIOSOLDIER_CAPTIONS,
  createLoadoutMock,
  GUNNER,
  GUNNER_CAPTIONS,
  MEC,
  MEC_CAPTIONS,
  MEC_LOADOUT,
  MEC_TILE_SIZES,
  MEDIKIT_LOADOUT,
  ROCKETEER,
  ROCKETEER_LOADOUT,
  SHIV,
  SHIV_CAPTIONS,
  SHIV_LOADOUT,
  UNKNOWN_ARMOR_CAPTIONS,
  UNKNOWN_ARMOR_LOADOUT,
  VEST_TILE_ITEM,
} from './loadout-tiles.mock';

vi.mock('@entities/loadout/config/constants/armor-content', async () => ({
  ARMOR_CONTENT: (await import('./loadout-tiles.mock')).ARMOR_CONTENT_MOCK,
}));

vi.mock('@entities/loadout/config/constants/weapon-content', async () => ({
  WEAPON_CONTENT: (await import('./loadout-tiles.mock')).WEAPON_CONTENT_MOCK,
}));

vi.mock('@entities/loadout/config/constants/equipment-content', async () => ({
  EQUIPMENT_CONTENT: (await import('./loadout-tiles.mock')).EQUIPMENT_CONTENT_MOCK,
}));

vi.mock('@entities/loadout/config/constants/shiv-type-content', async () => ({
  SHIV_TYPE_CONTENT: (await import('./loadout-tiles.mock')).SHIV_TYPE_CONTENT_MOCK,
}));

vi.mock('@entities/loadout/config/constants/armor-icons', async () => ({
  ARMOR_ICON: (await import('./loadout-tiles.mock')).ARMOR_ICON_MOCK,
}));

vi.mock('@entities/loadout/config/constants/weapon-icons', () => ({ WEAPON_ICON: {} }));

vi.mock('@entities/loadout/config/constants/equipment-icons', () => ({ EQUIPMENT_ICON: {} }));

vi.mock('@entities/loadout/config/constants/shiv-type-icons', () => ({ SHIV_TYPE_ICON: {} }));

vi.mock('@entities/loadout/config/constants/loadout-ability-content', () => ({ LOADOUT_ABILITY_CONTENT: {} }));

vi.mock('@entities/loadout/config/constants/loadout-ability-icons', () => ({ LOADOUT_ABILITY_ICON: {} }));

describe('loadoutTiles', () => {
  it('lists the slots of a biosoldier in inventory order', () => {
    const tiles = loadoutTiles(createLoadoutMock(), ASSAULT);

    expect(tiles.map(tile => tile.caption)).toEqual(BIOSOLDIER_CAPTIONS);
  });

  it('has no secondary tile for a class without secondary weapons', () => {
    const tiles = loadoutTiles(createLoadoutMock(), GUNNER);

    expect(tiles.map(tile => tile.caption)).toEqual(GUNNER_CAPTIONS);
  });

  it('shows the rocket launcher of a Rocketeer on the secondary tile', () => {
    const tiles = loadoutTiles(ROCKETEER_LOADOUT, ROCKETEER);

    expect(tiles.find(tile => tile.id === 'secondary')?.item?.name).toBe('Launcher');
  });

  it('lists the exoskeleton and Module slots of a MEC without a secondary tile', () => {
    const tiles = loadoutTiles(MEC_LOADOUT, MEC);

    expect(tiles.map(tile => tile.caption)).toEqual(MEC_CAPTIONS);
  });

  it('lists the SHIV type of a SHIV without a secondary tile', () => {
    const tiles = loadoutTiles(SHIV_LOADOUT, SHIV);

    expect(tiles.map(tile => tile.caption)).toEqual(SHIV_CAPTIONS);
  });

  it('puts the Gear Slots last', () => {
    const tiles = loadoutTiles(AEGIS_LOADOUT, ASSAULT);

    expect(tiles.map(tile => tile.tone)).toEqual(AEGIS_TONES);
  });

  it('captions a Psi Slot', () => {
    const tiles = loadoutTiles(AURORA_LOADOUT, ASSAULT);

    expect(tiles.map(tile => tile.caption)).toEqual(AURORA_CAPTIONS);
  });

  it('shows the name and image of the item in the slot', () => {
    const tiles = loadoutTiles(createLoadoutMock(), ASSAULT);

    expect(tiles[0].item).toEqual(VEST_TILE_ITEM);
  });

  it('leaves an empty slot without an item', () => {
    const tiles = loadoutTiles(MEDIKIT_LOADOUT, ASSAULT);

    expect(tiles.map(tile => tile.item?.name ?? null).slice(3)).toEqual(['Medikit', null, null]);
  });

  it('makes armor and weapon tiles large', () => {
    const tiles = loadoutTiles(MEC_LOADOUT, MEC);

    expect(tiles.map(tile => tile.isLarge)).toEqual(MEC_TILE_SIZES);
  });

  it('keeps the stored slots while the armor is unknown', () => {
    const tiles = loadoutTiles(UNKNOWN_ARMOR_LOADOUT, ASSAULT);

    expect(tiles.map(tile => tile.caption)).toEqual(UNKNOWN_ARMOR_CAPTIONS);
  });
});
