import { inject } from 'vue';

import type { ShivBuildData } from '@entities/shiv';
import type { BiosoldierBuildData, SoldierBuildData } from '@entities/soldier';
import type { StoredListOptions } from '@shared/lib/stored-list';

import { BUILD_STORAGE_CODECS_KEY } from '../config/constants';
import type { ListedBuild, NamedBuildData } from './build-list';

/**
 * Stored record of a build and the build of a stored record.
 */
export type BuildStorageCodec<Data extends NamedBuildData> = Pick<StoredListOptions<ListedBuild<Data>>, 'serialize' | 'parse'>;

/**
 * Stored records of builds of every kind.
 */
export interface BuildStorageCodecs {
  /** Records of Biosoldier builds. */
  biosoldier: BuildStorageCodec<BiosoldierBuildData>
  /** Records of MEC builds. */
  mec: BuildStorageCodec<SoldierBuildData>
  /** Records of SHIV builds. */
  shiv: BuildStorageCodec<ShivBuildData>
}

/**
 * Stored records of builds of the kind, as the app provides them.
 *
 * @description Without provided records nothing is read or written: the builds live only in the tab.
 *
 * @param kind build kind.
 */
export const injectBuildStorageCodec = <Kind extends keyof BuildStorageCodecs>(kind: Kind) => {
  const codecs = inject(BUILD_STORAGE_CODECS_KEY, null);

  if (!codecs) return { serialize: () => null, parse: () => null };

  return codecs[kind];
};
