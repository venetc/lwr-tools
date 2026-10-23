import type { SelectedOfficerPerks } from '@entities/soldier';

export const OFFICER_RANKS_MOCK = ['first', 'second', 'third'];

export const NO_OFFICER_PERKS: SelectedOfficerPerks = [null, null, null];

export const ONE_OFFICER_PERK: SelectedOfficerPerks = ['stay-frosty', null, null];

export const GAPPED_OFFICER_PERKS: SelectedOfficerPerks = [null, 'cover-tenacity', null];

export const ALL_OFFICER_PERKS: SelectedOfficerPerks = ['strength-in-numbers', 'cover-tenacity', 'show-em-the-ropes'];
