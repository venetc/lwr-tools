import { describe, expect, it, vi } from 'vitest';

import { loadoutSlots } from '@entities/loadout';
import { loadoutTiles } from '@pages/squads/model/loadout-tiles';

import {
  AEGIS_SLOTS,
  AEGIS_TONES,
  ASSAULT,
  AURORA_CAPTIONS,
  AURORA_SLOTS,
  BIOSOLDIER_CAPTIONS,
  BIOSOLDIER_SLOTS,
  createLoadoutMock,
  MEC,
  MEC_CAPTIONS,
  MEC_LOADOUT,
  MEC_SLOTS,
  MEC_TILE_SIZES,
  MEDIKIT_LOADOUT,
  NO_SECONDARY_CAPTIONS,
  NO_SECONDARY_SLOTS,
  ROCKETEER_LOADOUT,
  SHIV,
  SHIV_CAPTIONS,
  SHIV_LOADOUT,
  SHIV_SLOTS,
  VEST_TILE_ITEM,
} from './loadout-tiles.mock';

vi.mock('@entities/loadout', async () => ({
  LOADOUT_UNITS: [],
  findLoadoutItem: (await import('./loadout-tiles.mock')).findLoadoutItemStub,
  loadoutSlots: vi.fn(),
}));

describe('loadoutTiles', () => {
  it('lists the slots of a biosoldier in inventory order', () => {
    vi.mocked(loadoutSlots).mockReturnValue(BIOSOLDIER_SLOTS);

    const tiles = loadoutTiles(createLoadoutMock(), ASSAULT);

    expect(tiles.map(tile => tile.caption)).toEqual(BIOSOLDIER_CAPTIONS);
  });

  it('has no secondary tile for a unit without the slot', () => {
    vi.mocked(loadoutSlots).mockReturnValue(NO_SECONDARY_SLOTS);

    const tiles = loadoutTiles(createLoadoutMock(), ASSAULT);

    expect(tiles.map(tile => tile.caption)).toEqual(NO_SECONDARY_CAPTIONS);
  });

  it('shows the item of the secondary slot on its tile', () => {
    vi.mocked(loadoutSlots).mockReturnValue(BIOSOLDIER_SLOTS);

    const tiles = loadoutTiles(ROCKETEER_LOADOUT, ASSAULT);

    expect(tiles.find(tile => tile.id === 'secondary')?.item?.name).toBe('Launcher');
  });

  it('lists the exoskeleton and Module slots of a MEC without a secondary tile', () => {
    vi.mocked(loadoutSlots).mockReturnValue(MEC_SLOTS);

    const tiles = loadoutTiles(MEC_LOADOUT, MEC);

    expect(tiles.map(tile => tile.caption)).toEqual(MEC_CAPTIONS);
  });

  it('lists the SHIV type of a SHIV without a secondary tile', () => {
    vi.mocked(loadoutSlots).mockReturnValue(SHIV_SLOTS);

    const tiles = loadoutTiles(SHIV_LOADOUT, SHIV);

    expect(tiles.map(tile => tile.caption)).toEqual(SHIV_CAPTIONS);
  });

  it('colours the Gear Slots', () => {
    vi.mocked(loadoutSlots).mockReturnValue(AEGIS_SLOTS);

    const tiles = loadoutTiles(createLoadoutMock({ utility: [null, null, null, null] }), ASSAULT);

    expect(tiles.map(tile => tile.tone)).toEqual(AEGIS_TONES);
  });

  it('captions a Psi Slot', () => {
    vi.mocked(loadoutSlots).mockReturnValue(AURORA_SLOTS);

    const tiles = loadoutTiles(createLoadoutMock({ utility: [null, null, null, null] }), ASSAULT);

    expect(tiles.map(tile => tile.caption)).toEqual(AURORA_CAPTIONS);
  });

  it('shows the name and image of the item in the slot', () => {
    vi.mocked(loadoutSlots).mockReturnValue(BIOSOLDIER_SLOTS);

    const tiles = loadoutTiles(createLoadoutMock(), ASSAULT);

    expect(tiles[0].item).toEqual(VEST_TILE_ITEM);
  });

  it('leaves an empty slot without an item', () => {
    vi.mocked(loadoutSlots).mockReturnValue(BIOSOLDIER_SLOTS);

    const tiles = loadoutTiles(MEDIKIT_LOADOUT, ASSAULT);

    expect(tiles.map(tile => tile.item?.name ?? null).slice(3)).toEqual(['Medikit', null, null]);
  });

  it('makes armor and weapon tiles large', () => {
    vi.mocked(loadoutSlots).mockReturnValue(MEC_SLOTS);

    const tiles = loadoutTiles(MEC_LOADOUT, MEC);

    expect(tiles.map(tile => tile.isLarge)).toEqual(MEC_TILE_SIZES);
  });
});
