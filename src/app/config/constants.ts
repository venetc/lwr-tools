import type { BuildStorageCodecs } from '@features/manage-builds';
import {
  decodeBiosoldierBuild,
  decodeMecBuild,
  decodeShivBuild,
  encodeBiosoldierBuild,
  encodeMecBuild,
  encodeShivBuild,
  storedBuildCodec,
} from '@features/share-build';
import { ROUTES } from '@shared/config/routes';
import type { DeepReadonly } from '@shared/lib/object';
import type { BreadcrumbItem } from '@shared/ui/breadcrumbs';

/**
 * Site-wide breadcrumb that starts every trail in the site header.
 */
export const ROOT_BREADCRUMB = {
  label: 'LWR Tools',
  to: { name: ROUTES.HOME.name },
} as const satisfies BreadcrumbItem;

/** Stored records of builds of every kind through their share codes, provided to the build stores. */
export const BUILD_STORAGE_CODECS: DeepReadonly<BuildStorageCodecs> = {
  biosoldier: storedBuildCodec(encodeBiosoldierBuild, decodeBiosoldierBuild),
  mec: storedBuildCodec(encodeMecBuild, decodeMecBuild),
  shiv: storedBuildCodec(encodeShivBuild, decodeShivBuild),
};
