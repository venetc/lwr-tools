/** Loadout slots equipment goes to: utility slots of every unit, or Module slots of a MEC. */
export const EQUIPMENT_SLOTS = ['utility', 'module'] as const;

/** Groups of equipment that does not stack: a unit carries at most one item of a group. */
export const EQUIPMENT_STACK_GROUPS = ['plating', 'scope', 'ammo-capacity', 'ammo-type', 'launcher', 'alien-grenade', 'disorient-grenade'] as const;
