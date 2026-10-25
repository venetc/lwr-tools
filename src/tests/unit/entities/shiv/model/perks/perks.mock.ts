import type { ShivPerkContent, ShivPerkIcon, ShivPerkIconPlaceholder } from '@entities/shiv/model/perks';

export const SHIV_PERK_CONTENT_MOCK: Record<string, ShivPerkContent> = {
  left: { code: 1, name: 'Left', description: 'Left description' },
};

const PLACEHOLDER: ShivPerkIconPlaceholder = {
  selected: { backdrop: '#000000', glyph: '#ffffff' },
  available: { backdrop: '#000000', glyph: '#888888' },
  disabled: { backdrop: '#222222', glyph: '#444444' },
};

const LEFT_ICON: ShivPerkIcon = { selected: 'left.png', available: 'left_available.png', disabled: 'left_disabled.png', placeholder: PLACEHOLDER };

export const SHIV_PERK_ICON_MOCK: Record<string, ShivPerkIcon> = {
  left: LEFT_ICON,
};

export const LEFT_PERK = { id: 'left', code: 1, name: 'Left', description: 'Left description', icon: LEFT_ICON };
