export const BIOSOLDIER_BUILDS = 'Biosoldier builds';

export const BIOSOLDIER_PATH = '/builds/biosoldier';

export const SNIPER = 'Sniper';

/** Perk of Master Sergeant of a Sniper, not selected in a Default build. */
export const LONE_WOLF = 'Lone Wolf';

export const LONE_WOLF_LABEL = 'Signature skill: Lone Wolf';

export const IN_THE_ZONE = 'In The Zone';

/** Build code of a Default Sniper build with In The Zone as the Signature skill. */
export const SNIPER_BUILD_CODE = 'AQg4OAOCBwDQ';

export const SERAPH_SNIPER = 'Seraph Sniper';

/** Unit code of the Sniper build `Seraph Sniper` with In The Zone as the Signature skill and a Seraph Armor Loadout. */
export const SERAPH_UNIT_CODE = 'AQg4OAEbWqbK5MLg0ECm3NLgyuRh6FBIbAsAAAAOCBwAAw';

/**
 * Squad code `Signature Squad`: the Unit of `SERAPH_UNIT_CODE`, then a Unit of a Default Jaeger build with Lone Wolf as
 * the Signature skill.
 */
export const SQUAD_CODE = 'BAn16m0s7cwujq5MpApuLqwsgB0.AQg4OAEbWqbK5MLg0ECm3NLgyuRh6FBIbAsAAAAOCBwAAw.Awg5OAMLQ8KACAIAcEEIALI';

/** Units of `SQUAD_CODE` by build name with the perk names of their Signature skills. */
export const SQUAD_SIGNATURE_SKILLS = [
  { buildName: 'Seraph Sniper', perkName: 'In The Zone' },
  { buildName: 'Jaeger', perkName: 'Lone Wolf' },
];

/** Query that matches no build name or Class, only the Signature skill Lone Wolf. */
export const LONE_WOLF_QUERY = 'lone WOLF';
