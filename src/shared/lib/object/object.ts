/**
 * Values kept as they are by `DeepReadonly`: primitives (including branded strings like `string & {}`) and functions.
 */
type DeepReadonlyLeaf = string | number | boolean | bigint | symbol | null | undefined | ((...args: never[]) => unknown);

/**
 * Type of a static value that is never changed at runtime: every property and array is readonly at any depth.
 * Primitives and functions (components, callbacks) are kept as they are; maps need `ReadonlyMap` instead.
 */
export type DeepReadonly<Value> = Value extends DeepReadonlyLeaf
  ? Value
  : { readonly [Key in keyof Value]: DeepReadonly<Value[Key]> };
