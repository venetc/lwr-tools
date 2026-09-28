/**
 * Entries of a static object with its key type kept; order follows the object keys.
 *
 * @param object static object without keys beyond its declared type.
 */
export const typedEntries = <Key extends string, Value>(object: Record<Key, Value>) => {
  return Object.entries(object) as [Key, Value][];
};
