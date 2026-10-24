import type { ShivPerkContent, ShivPerkIcon } from '@entities/shiv/model/perks';

export const SHIV_PERK_CONTENT_MOCK: Record<string, ShivPerkContent> = {
  left: { code: 1, name: 'Left', description: 'Left description' },
};

const LEFT_ICON: ShivPerkIcon = { selected: 'left.png', available: 'left_available.png', disabled: 'left_disabled.png' };

export const SHIV_PERK_ICON_MOCK: Record<string, ShivPerkIcon> = {
  left: LEFT_ICON,
};

export const LEFT_PERK = { id: 'left', code: 1, name: 'Left', description: 'Left description', icon: LEFT_ICON };
