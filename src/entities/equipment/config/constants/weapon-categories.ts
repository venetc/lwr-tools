/** Weapon technology tiers in game order; `arc` is the electric tier (Arc Rifle, Stun Rifle, Arc Pistol). */
export const WEAPON_TIERS = ['ballistic', 'laser', 'arc', 'gauss', 'pulse', 'plasma'] as const;

/** Weapon types as the game groups weapons of every tier. */
export const WEAPON_TYPES = [
  'assault-rifle',
  'battle-rifle',
  'carbine',
  'smg',
  'shotgun',
  'saw',
  'lmg',
  'strike-rifle',
  'sniper-rifle',
  'mec-weapon',
  'autocannon',
  'vulcan-cannon',
  'arc-rifle',
  'stun-rifle',
  'pistol',
  'autopistol',
  'arc-pistol',
  'sawed-off-shotgun',
  'rocket-launcher',
] as const;

/** Loadout slots a weapon goes to: the primary weapon, or the secondary one (sidearms and rocket launchers). */
export const WEAPON_SLOTS = ['primary', 'secondary'] as const;
